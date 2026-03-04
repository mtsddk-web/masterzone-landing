import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find customer by email
    const customers = await getStripe().customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'Nie znaleziono konta dla tego adresu email' }, { status: 404 });
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${request.headers.get('origin')}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Portal error' },
      { status: 500 }
    );
  }
}
