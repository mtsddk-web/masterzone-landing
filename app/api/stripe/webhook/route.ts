import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { senderUpsertSubscriber } from '@/lib/sender';
import { sendSkoolInvite } from '@/lib/skool';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Meta CAPI helper - generic, supports Purchase + StartTrial (i kolejne event types).
 */
async function sendMetaCAPIEvent(params: {
  eventName: 'Purchase' | 'StartTrial' | 'Subscribe';
  email: string;
  value: number;          // value in PLN (NIE w groszach)
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
        event_name: params.eventName,
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
          value: params.value,
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
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'atlas-mz/1.0' },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error(`Meta CAPI ${params.eventName} error:`, res.status, data);
    } else {
      console.log(`Meta CAPI ${params.eventName} sent:`, params.email, data?.events_received);
    }
  } catch (error) {
    console.error(`Meta CAPI ${params.eventName} fetch error:`, error);
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
 * Tag subscriber w Sender po pelnej platnosci (status='paid') albo canceled.
 * Migracja MailerLite -> Sender (28.05.2026).
 */
async function tagSender(email: string, status: 'paid' | 'canceled' | 'past_due') {
  if (!email) return;
  const paidGroupId = process.env.SENDER_PAID_GROUP_ID?.trim();
  if (!paidGroupId) {
    console.warn('[webhook] SENDER_PAID_GROUP_ID not configured');
    return;
  }

  // Dla canceled/past_due - nie dodajemy do Paid Members group, tylko log
  // (idealnie powinien byc osobny Cancellers group, ale MVP wystarczy log + Stripe status).
  if (status !== 'paid') {
    console.log(`[webhook] subscriber ${email} status=${status} (no Sender group change)`);
    return;
  }

  await senderUpsertSubscriber({
    email,
    groups: [paidGroupId],
    trigger_automation: false,
    fields: {
      trial_status: status,
      payment_date: new Date().toISOString(),
    },
  });
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

        const isTrial = !!subscription.trial_end && subscription.status === 'trialing';
        const sourceUrl =
          (session.metadata?.landing_url as string) ||
          'https://rozproszenie.masterzone.edu.pl/';
        const fbp = (session.metadata?.fbp as string) || null;
        const fbc = (session.metadata?.fbc as string) || null;
        const amountPln = (item?.price.unit_amount || 9700) / 100;
        const currency = item?.price.currency || 'pln';

        if (isTrial) {
          // Trial start = StartTrial CAPI (value 0, sygnal dla Meta ze user wszedl w funnel)
          await sendMetaCAPIEvent({
            eventName: 'StartTrial',
            email,
            value: 0,
            currency,
            eventId: `start_trial_${session.id}`,
            sourceUrl,
            fbp,
            fbc,
          });

          // Wyslij Skool invite od razu po starcie trialu (klient ma odzyskac kontekst po Stripe checkout)
          if (email) {
            await sendSkoolInvite({
              email,
              firstname: session.customer_details?.name?.split(' ')[0],
            });
          }
        } else {
          // Direct purchase (bez trialu) - Sender PAID + Purchase CAPI
          await tagSender(email, 'paid');
          await sendMetaCAPIEvent({
            eventName: 'Purchase',
            email,
            value: amountPln,
            currency,
            eventId: session.id,
            sourceUrl,
            fbp,
            fbc,
          });

          // Skool invite tez po direct purchase
          if (email) {
            await sendSkoolInvite({
              email,
              firstname: session.customer_details?.name?.split(' ')[0],
            });
          }
        }

        console.log(`Checkout completed: ${email}, subscription: ${subscriptionId}, trial=${isTrial}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const previous = (event.data.previous_attributes || {}) as Partial<Stripe.Subscription>;
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

        // Trial -> active = REAL Purchase: Sender Paid + CAPI Purchase
        const wasTrialing = previous.status === 'trialing';
        const nowActive = subscription.status === 'active';
        if (wasTrialing && nowActive && email) {
          console.log(`[webhook] trial -> active for ${email}, sending Purchase events`);
          await tagSender(email, 'paid');
          await sendMetaCAPIEvent({
            eventName: 'Purchase',
            email,
            value: (subItem?.price.unit_amount || 9700) / 100,
            currency: subItem?.price.currency || 'pln',
            eventId: `sub_active_${subscription.id}`,
            sourceUrl:
              (subscription.metadata?.landing_url as string) ||
              'https://rozproszenie.masterzone.edu.pl/',
            fbp: (subscription.metadata?.fbp as string) || null,
            fbc: (subscription.metadata?.fbc as string) || null,
          });
        }

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

        await tagSender(email, 'canceled');
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
