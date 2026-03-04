import { NextResponse } from 'next/server';
import { getStripe, PRICE_ID } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trial, email, utm } = body as {
      trial?: number;
      email?: string;
      utm?: { source?: string; medium?: string; campaign?: string };
    };

    const origin = request.headers.get('origin') || 'https://rozproszenie.masterzone.edu.pl';

    const sessionParams: Record<string, any> = {
      mode: 'subscription',
      locale: 'pl',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        utm_source: utm?.source || '',
        utm_medium: utm?.medium || '',
        utm_campaign: utm?.campaign || '',
      },
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    if (trial && trial > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trial,
      };
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stripe error' },
      { status: 500 }
    );
  }
}
