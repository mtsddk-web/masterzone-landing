import { NextRequest, NextResponse } from 'next/server';
import { senderUpsertSubscriber } from '@/lib/sender';

/**
 * /api/subscribe - ContactForm submission (newsletter / lead form).
 * Migracja MailerLite -> Sender (28.05.2026).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, source, utm } = body;

    if (!firstName || !email) {
      return NextResponse.json({ error: 'Imię i email są wymagane' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Nieprawidłowy format email' }, { status: 400 });
    }

    // Newsletter / leady idą do "Z reklam FB przez Landing Page Rozproszenie" w Sender,
    // tej samej co trial. Newsletter-only group nie jest w sandboxie - SENDER_FB_LANDING_GROUP_ID
    // fallback, jesli ktos w przyszlosci doda osobna newsletter group.
    const groupId =
      process.env.SENDER_FB_LANDING_GROUP_ID?.trim() ||
      process.env.SENDER_NEWSLETTER_GROUP_ID?.trim() ||
      process.env.SENDER_TRIAL_GROUP_ID?.trim();

    if (!groupId) {
      console.error('[subscribe] No Sender group configured');
      return NextResponse.json({ error: 'Konfiguracja API nie jest dostępna' }, { status: 500 });
    }

    const result = await senderUpsertSubscriber({
      email,
      firstname: firstName,
      groups: [groupId],
      trigger_automation: false,
      fields: {
        source: source || 'contact_form',
        utm_source: utm?.source || '',
        utm_medium: utm?.medium || '',
        utm_campaign: utm?.campaign || '',
        signup_date: new Date().toISOString(),
      },
    });

    if (!result.ok) {
      console.error('[subscribe] Sender upsert failed:', result.status, result.error);
      // Mimo bledu zwracamy 200 zeby formularz przeszedl do Thank You (RODO/UX) -
      // log wystarczy do reconcyliacji.
      return NextResponse.json(
        { message: 'Zapisano (z opóźnieniem synchronizacji)' },
        { status: 200 }
      );
    }

    console.log('[subscribe] OK:', email, 'source:', source);

    return NextResponse.json({
      success: true,
      message: 'Zapisano pomyślnie',
    });
  } catch (error) {
    console.error('[subscribe] error:', error);
    return NextResponse.json(
      {
        error: 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
