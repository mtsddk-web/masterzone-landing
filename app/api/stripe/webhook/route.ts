import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
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
        utm_source: sessionOrSub.utm_source || null,
        utm_medium: sessionOrSub.utm_medium || null,
        utm_campaign: sessionOrSub.utm_campaign || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_customer_id' }
    );

  if (error) {
    console.error('Supabase upsert error:', error);
  }
}

async function tagMailerLite(email: string, status: string) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return;

  try {
    const groupId = process.env.MAILERLITE_PAID_GROUP_ID;

    await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        fields: {
          trial_status: status,
          payment_date: new Date().toISOString(),
        },
        groups: groupId ? [groupId] : [],
        status: 'active',
      }),
    });
  } catch (error) {
    console.error('MailerLite tag error:', error);
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
        await tagMailerLite(email, 'paid');

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

        await tagMailerLite(email, 'canceled');
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
