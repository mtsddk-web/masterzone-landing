import { NextResponse } from 'next/server';
import { getPayU } from '@/lib/payu';
import type { PayUOrder } from '@/lib/payu';

/**
 * PayU checkout - jednorazowa płatność (BLIK / szybki przelew / karta) za pierwszy miesiąc.
 *
 * Świadomie BEZ `recurring` - recurring przez PayU wymaga osobnej konfiguracji POS
 * i tokenizacji; tu chodzi o najprostszą, niezawodną ścieżkę bez karty na evencie.
 * Odnowienie po miesiącu obsługujemy mailowo. Stripe (karta) nadal robi pełną subskrypcję.
 */
// PayU swiadomie wylaczone (UI: PAYU_ENABLED=false w app/checkout/page.tsx).
// Guard server-side: bezposredni POST nie moze tworzyc zamowien PayU dopoki
// NEXT_PUBLIC_PAYU_ENABLED !== "true". Domyslnie zablokowane (fail-closed).
const PAYU_ENABLED = process.env.NEXT_PUBLIC_PAYU_ENABLED === 'true';

export async function POST(request: Request) {
  try {
    if (!PAYU_ENABLED) {
      console.warn('[payu-checkout] blocked: PayU disabled (NEXT_PUBLIC_PAYU_ENABLED != "true")');
      return NextResponse.json(
        { error: 'Płatność PayU jest obecnie niedostępna.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, utm } = body as {
      email?: string;
      utm?: { source?: string; medium?: string; campaign?: string };
    };

    const origin = request.headers.get('origin') || 'https://rozproszenie.masterzone.edu.pl';

    // Cena MasterZone promo zalozycielska: 67 zl = 6700 groszy
    // (PayU obecnie wylaczone - PAYU_ENABLED=false w checkout)
    const totalAmount = '6700';

    // Pobierz IP klienta (wymagane przez PayU)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const customerIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // extOrderId MUSI być unikalny w obrębie sklepu (PayU odrzuca duplikaty).
    // Zaszywamy w nim metadane UTM (base64 JSON) + znacznik czasu/losowy sufiks dla unikalności.
    const metadata = {
      utm_source: utm?.source || '',
      utm_medium: utm?.medium || '',
      utm_campaign: utm?.campaign || '',
      trial_days: 0,
      ts: Date.now(),
      rnd: Math.random().toString(36).slice(2, 8),
    };
    const extOrderId = Buffer.from(JSON.stringify(metadata)).toString('base64').slice(0, 255);

    const order: PayUOrder = {
      notifyUrl: `${origin}/api/payu/webhook`,
      continueUrl: `${origin}/checkout/success?provider=payu`,
      customerIp,
      merchantPosId: process.env.PAYU_POS_ID!,
      description: 'MasterZone Community - 67 zl (pierwszy miesiac)',
      currencyCode: 'PLN',
      totalAmount,
      products: [
        {
          name: 'MasterZone Community - miesieczny dostep',
          unitPrice: totalAmount,
          quantity: '1',
        },
      ],
    };
    (order as { extOrderId?: string }).extOrderId = extOrderId;

    if (email) {
      order.buyer = {
        email,
        language: 'pl',
      };
    }

    const payu = getPayU();
    const response = await payu.createOrder(order);

    if (response.status.statusCode !== 'SUCCESS') {
      console.error('PayU order creation failed:', response);
      return NextResponse.json(
        { error: 'Failed to create PayU order', details: response.status },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: response.redirectUri,
      orderId: response.orderId,
    });
  } catch (error) {
    console.error('PayU checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PayU checkout error' },
      { status: 500 }
    );
  }
}
