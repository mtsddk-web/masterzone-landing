import { NextResponse } from 'next/server';
import { getPayU } from '@/lib/payu';
import type { PayUOrder } from '@/lib/payu';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trial, email, utm } = body as {
      trial?: number;
      email?: string;
      utm?: { source?: string; medium?: string; campaign?: string };
    };

    const origin = request.headers.get('origin') || 'https://rozproszenie.masterzone.edu.pl';

    // Cena MasterZone: 97 PLN = 9700 groszy
    const totalAmount = '9700';

    // Pobierz IP klienta (wymagane przez PayU)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const customerIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Przygotuj zamówienie PayU
    const order: PayUOrder = {
      notifyUrl: `${origin}/api/payu/webhook`,
      continueUrl: `${origin}/checkout/success?provider=payu`,
      customerIp,
      merchantPosId: process.env.PAYU_POS_ID!,
      description: trial && trial > 0
        ? `MasterZone Community - ${trial} dni trial + 97 PLN/msc`
        : 'MasterZone Community - 97 PLN/msc',
      currencyCode: 'PLN',
      totalAmount,
      products: [
        {
          name: 'MasterZone Community - miesięczna subskrypcja',
          unitPrice: totalAmount,
          quantity: '1',
        },
      ],
    };

    // Dodaj dane kupującego jeśli podano email
    if (email) {
      order.buyer = {
        email,
        language: 'pl',
      };
    }

    // Metadata UTM zapisujemy w extOrderId (PayU pozwala na custom ID)
    if (utm?.source || utm?.medium || utm?.campaign) {
      const metadata = {
        utm_source: utm.source || '',
        utm_medium: utm.medium || '',
        utm_campaign: utm.campaign || '',
        trial_days: trial || 0,
      };
      // extOrderId może zawierać JSON (max 255 znaków)
      const extOrderId = Buffer.from(JSON.stringify(metadata)).toString('base64').substring(0, 255);
      (order as any).extOrderId = extOrderId;
    }

    // Utwórz zamówienie w PayU
    const payu = getPayU();
    const response = await payu.createOrder(order);

    if (response.status.statusCode !== 'SUCCESS') {
      console.error('PayU order creation failed:', response);
      return NextResponse.json(
        { error: 'Failed to create PayU order', details: response.status },
        { status: 500 }
      );
    }

    // Zwróć URL do przekierowania (PayU payment page)
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
