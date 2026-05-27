import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { upsertSubscriber, legacyMailerLiteTag } from '@/lib/sender';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function sendMetaCAPIPurchase(params: {
  email: string;
  amount: number;
  currency: string;
  eventId: string;
  sourceUrl?: string;
  fbp?: string | null;
  fbc?: string | null;
}) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn('Meta CAPI not configured (META_PIXEL_ID / META_CAPI_ACCESS_TOKEN missing)');
    return;
  }

  const hashedEmail = createHash('sha256')
    .update(params.email.trim().toLowerCase())
    .digest('hex');

  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        event_source_url: params.sourceUrl || 'https://rozproszenie.masterzone.edu.pl/',
        action_source: 'website',
        user_data: {
          em: [hashedEmail],
          ...(params.fbp ? { fbp: params.fbp } : {}),
          ...(params.fbc ? { fbc: params.fbc } : {}),
        },
        custom_data: {
          currency: params.currency.toUpperCase(),
          value: params.amount / 100,
          content_name: 'MasterZone Strefa Skupienia',
          content_category: 'subscription',
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v25.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error('Meta CAPI error:', res.status, data);
    } else {
      console.log('Meta CAPI Purchase sent:', params.email, data);
    }
  } catch (error) {
    console.error('Meta CAPI fetch error:', error);
  }
}

async function upsertSubscription(
  customerId: string,
  email: string,
  subscriptionId: string | null,
  status: string,
  sessionOrSub: Record<string, any>
) {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured - skipping subscription upsert');
    return;
  }

  const row: Record<string, any> = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    email,
    status,
    price_id: sessionOrSub.price_id || null,
    currency: 'pln',
    amount: sessionOrSub.amount || 9700,
    current_period_start: sessionOrSub.current_period_start
      ? new Date(sessionOrSub.current_period_start * 1000).toISOString()
      : null,
    current_period_end: sessionOrSub.current_period_end
      ? new Date(sessionOrSub.current_period_end * 1000).toISOString()
      : null,
    trial_start: sessionOrSub.trial_start
      ? new Date(sessionOrSub.trial_start * 1000).toISOString()
      : null,
    trial_end: sessionOrSub.trial_end
      ? new Date(sessionOrSub.trial_end * 1000).toISOString()
      : null,
    checkout_session_id: sessionOrSub.checkout_session_id || null,
    updated_at: new Date().toISOString(),
  };

  // UTM zapisujemy TYLKO jak ma sens - nigdy nie nadpisuj istniejacej atrybucji nullem
  // (np. gdy customer.subscription.updated przyjdzie po checkout.session.completed).
  if (sessionOrSub.utm_source) row.utm_source = sessionOrSub.utm_source;
  if (sessionOrSub.utm_medium) row.utm_medium = sessionOrSub.utm_medium;
  if (sessionOrSub.utm_campaign) row.utm_campaign = sessionOrSub.utm_campaign;

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(row, { onConflict: 'stripe_customer_id' });

  if (error) {
    console.error('Supabase upsert error:', error);
  }
}

/**
 * Tag Paid Member po sukcesie płatności Stripe.
 *
 * PARALLEL MODE (od 27.05.2026, ~2 tyg do ~10.06.2026):
 * - Sender.net = primary (env SENDER_PAID_GROUP_ID, default "e9jg23" Paid Members)
 * - MailerLite = legacy (drugi call, jeśli MAILERLITE_API_KEY w env)
 *
 * Po potwierdzeniu że Sender łapie 100% — usunąć MAILERLITE_API_KEY z env.
 */
async function tagPaidMember(email: string, status: string) {
  if (!email) return;

  const groupId = process.env.SENDER_PAID_GROUP_ID || 'e9jg23';
  const fields = {
    trial_status: status,
    payment_date: new Date().toISOString(),
  };

  const senderResult = await upsertSubscriber({
    email,
    groups: [groupId],
    fields,
  });
  if (!senderResult.success) {
    console.error('Sender.net paid tag error (stripe):', senderResult.error);
  } else {
    console.log('✅ Sender.net paid tag (stripe):', email, status);
  }

  const mlGroupId = process.env.MAILERLITE_PAID_GROUP_ID;
  const mlResult = await legacyMailerLiteTag(email, fields, mlGroupId);
  if (mlResult.ok) {
    console.log('🟡 [parallel] MailerLite tag (stripe):', email);
  } else if (mlResult.error !== 'no_key') {
    console.warn('MailerLite legacy tag failed (stripe):', mlResult.error);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const email = session.customer_details?.email || session.customer_email || '';
        const subscriptionId = session.subscription as string;

        // Get subscription details
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const item = subscription.items.data[0];
        const priceId = item?.price.id || '';

        await upsertSubscription(customerId, email, subscriptionId, subscription.status, {
          price_id: priceId,
          amount: item?.price.unit_amount || 9700,
          current_period_start: item?.current_period_start,
          current_period_end: item?.current_period_end,
          trial_start: subscription.trial_start,
          trial_end: subscription.trial_end,
          checkout_session_id: session.id,
          utm_source: session.metadata?.utm_source,
          utm_medium: session.metadata?.utm_medium,
          utm_campaign: session.metadata?.utm_campaign,
        });

        // Tag in MailerLite
        await tagPaidMember(email, 'paid');

        // Send Meta CAPI Purchase (server-side, closes the attribution loop).
        // fbc/fbp z metadata sesji => Meta dopina Purchase do kliku w reklame.
        await sendMetaCAPIPurchase({
          email,
          amount: item?.price.unit_amount || 9700,
          currency: item?.price.currency || 'pln',
          eventId: session.id,
          sourceUrl:
            (session.metadata?.landing_url as string) ||
            'https://rozproszenie.masterzone.edu.pl/',
          fbp: (session.metadata?.fbp as string) || null,
          fbc: (session.metadata?.fbc as string) || null,
        });

        console.log(`Checkout completed: ${email}, subscription: ${subscriptionId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await getStripe().customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email || '';
        const subItem = subscription.items.data[0];

        await upsertSubscription(customerId, email, subscription.id, subscription.status, {
          price_id: subItem?.price.id,
          amount: subItem?.price.unit_amount,
          current_period_start: subItem?.current_period_start,
          current_period_end: subItem?.current_period_end,
          trial_start: subscription.trial_start,
          trial_end: subscription.trial_end,
          utm_source: subscription.metadata?.utm_source || undefined,
          utm_medium: subscription.metadata?.utm_medium || undefined,
          utm_campaign: subscription.metadata?.utm_campaign || undefined,
        });

        console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await getStripe().customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email || '';

        await upsertSubscription(customerId, email, subscription.id, 'canceled', {
          current_period_end: subscription.items.data[0]?.current_period_end,
        });

        await tagPaidMember(email, 'canceled');
        console.log(`Subscription canceled: ${subscription.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Record<string, any>;
        const failedCustomerId = failedInvoice.customer as string;
        const failedCustomer = await getStripe().customers.retrieve(failedCustomerId);
        const failedEmail = (failedCustomer as Stripe.Customer).email || '';
        const failedSubId = failedInvoice.subscription as string | null;

        if (failedSubId) {
          await upsertSubscription(failedCustomerId, failedEmail, failedSubId, 'past_due', {});
        }

        console.log(`Payment failed: ${failedEmail}`);
        break;
      }

      case 'invoice.paid': {
        const paidInvoice = event.data.object as Record<string, any>;
        const paidCustomerId = paidInvoice.customer as string;
        const paidCustomer = await getStripe().customers.retrieve(paidCustomerId);
        const paidEmail = (paidCustomer as Stripe.Customer).email || '';
        const paidSubId = paidInvoice.subscription as string | null;

        if (paidSubId) {
          const paidSub = await getStripe().subscriptions.retrieve(paidSubId);
          const paidItem = paidSub.items.data[0];
          await upsertSubscription(paidCustomerId, paidEmail, paidSubId, 'active', {
            current_period_start: paidItem?.current_period_start,
            current_period_end: paidItem?.current_period_end,
          });
        }

        console.log(`Invoice paid: ${paidEmail}`);
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
