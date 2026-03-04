import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getPayU } from '@/lib/payu';

/**
 * PayU Webhook - odbiera notyfikacje o statusie płatności
 *
 * PayU wysyła POST z JSON body:
 * {
 *   "order": {
 *     "orderId": "...",
 *     "extOrderId": "...",
 *     "orderCreateDate": "...",
 *     "notifyUrl": "...",
 *     "customerIp": "...",
 *     "merchantPosId": "...",
 *     "description": "...",
 *     "currencyCode": "PLN",
 *     "totalAmount": "9700",
 *     "buyer": { "email": "...", ... },
 *     "products": [...],
 *     "status": "COMPLETED" | "PENDING" | "CANCELED"
 *   },
 *   "localReceiptDateTime": "...",
 *   "properties": [...]
 * }
 */

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
          payment_provider: 'payu',
          payment_status: status,
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

async function upsertSubscription(
  orderId: string,
  email: string,
  status: string,
  totalAmount: string,
  metadata: Record<string, any>,
  cardToken?: string,
  isRecurring: boolean = false
) {
  if (!supabaseAdmin) {
    console.warn('Supabase not configured - skipping subscription upsert');
    return;
  }

  // PayU orderId jako customer_id (PayU nie ma stałego customer ID jak Stripe)
  const customerId = `payu_${orderId}`;

  const subscriptionData: any = {
    stripe_customer_id: customerId, // używamy tego pola dla PayU order ID
    stripe_subscription_id: null, // PayU nie ma subscription ID
    email,
    status: status === 'COMPLETED' ? 'active' : status === 'PENDING' ? 'trialing' : 'canceled',
    price_id: 'payu_masterzone_97pln', // custom ID dla PayU
    currency: 'pln',
    amount: parseInt(totalAmount, 10),
    payment_provider: 'payu',
    payu_order_id: orderId,
    updated_at: new Date().toISOString(),
  };

  // Dla pierwszej płatności (nie recurring) - ustaw period start/end i trial
  if (!isRecurring) {
    subscriptionData.current_period_start = new Date().toISOString();
    subscriptionData.current_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // +30 dni
    subscriptionData.trial_start = metadata.trial_days > 0 ? new Date().toISOString() : null;
    subscriptionData.trial_end = metadata.trial_days > 0
      ? new Date(Date.now() + metadata.trial_days * 24 * 60 * 60 * 1000).toISOString()
      : null;
    subscriptionData.checkout_session_id = orderId;
    subscriptionData.utm_source = metadata.utm_source || null;
    subscriptionData.utm_medium = metadata.utm_medium || null;
    subscriptionData.utm_campaign = metadata.utm_campaign || null;
  } else {
    // Recurring payment - extend period
    subscriptionData.current_period_start = new Date().toISOString();
    subscriptionData.current_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  // Zapisz card token (jeśli dostępny)
  if (cardToken) {
    subscriptionData.payu_card_token = cardToken;
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(subscriptionData, { onConflict: 'stripe_customer_id' });

  if (error) {
    console.error('Supabase upsert error:', error);
  }
}

export async function POST(request: Request) {
  const body = await request.text();

  // PayU wysyła notyfikacje jako application/x-www-form-urlencoded z polem "order"
  // lub jako JSON - sprawdzamy Content-Type
  const contentType = request.headers.get('content-type') || '';

  let notification: any;

  if (contentType.includes('application/json')) {
    notification = JSON.parse(body);
  } else {
    // Form-encoded: order=<JSON>
    const params = new URLSearchParams(body);
    const orderParam = params.get('order');
    if (!orderParam) {
      return NextResponse.json({ error: 'Missing order parameter' }, { status: 400 });
    }
    notification = { order: JSON.parse(orderParam) };
  }

  if (!notification.order) {
    return NextResponse.json({ error: 'Invalid notification format' }, { status: 400 });
  }

  const order = notification.order;
  const orderId = order.orderId;
  const email = order.buyer?.email || '';
  const status = order.status; // COMPLETED, PENDING, CANCELED
  const totalAmount = order.totalAmount;

  // Wyciągnij card token (dla recurring payments)
  let cardToken: string | undefined;
  if (order.payMethod?.type === 'CARD_TOKEN') {
    cardToken = order.payMethod.value; // masked card number lub token
  }

  // Rozróżnij: first payment vs recurring payment
  // Recurring payment NIE ma extOrderId (metadata)
  const isRecurring = !order.extOrderId;

  console.log(
    `PayU webhook: order ${orderId}, status: ${status}, email: ${email}, recurring: ${isRecurring}, cardToken: ${cardToken || 'none'}`
  );

  // Dekoduj metadata z extOrderId (tylko dla first payment)
  let metadata: any = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    trial_days: 0,
  };

  if (order.extOrderId) {
    try {
      const decoded = Buffer.from(order.extOrderId, 'base64').toString('utf-8');
      metadata = JSON.parse(decoded);
    } catch (err) {
      console.warn('Failed to decode extOrderId:', err);
    }
  }

  // Zapisz w Supabase
  await upsertSubscription(orderId, email, status, totalAmount, metadata, cardToken, isRecurring);

  // Tag w MailerLite tylko dla COMPLETED
  if (status === 'COMPLETED') {
    await tagMailerLite(email, isRecurring ? 'renewed' : 'paid');
  }

  // PayU wymaga odpowiedzi 200 OK
  return NextResponse.json({ received: true });
}
