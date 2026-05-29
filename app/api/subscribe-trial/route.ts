import { NextResponse } from 'next/server';
import { senderUpsertSubscriber } from '@/lib/sender';

/**
 * /api/subscribe-trial - EmailGateModal submission.
 *
 * Sender.net (primary). MailerLite kept as legacy fallback (Radek migracja 19.04.2026
 * przeniosla 716 active subs do Sender, ale apka pisala do MailerLite -> 0 trialow ostatnio).
 */
export async function POST(request: Request) {
  try {
    const { name, email, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    const trialGroupId = process.env.SENDER_TRIAL_GROUP_ID?.trim();
    if (!trialGroupId) {
      console.error('[subscribe-trial] SENDER_TRIAL_GROUP_ID not configured');
      return NextResponse.json({ success: false, error: 'Group not configured' }, { status: 500 });
    }

    const result = await senderUpsertSubscriber({
      email,
      firstname: name?.trim() || undefined,
      groups: [trialGroupId],
      trigger_automation: true, // pal automation welcome maila Sender (Skool invite)
      fields: {
        source: source || 'Landing - rozproszenie.masterzone.edu.pl',
        last_interest: new Date().toISOString(),
        signup_date: new Date().toISOString(),
        trial_status: 'pending',
      },
    });

    if (!result.ok) {
      console.error('[subscribe-trial] Sender upsert failed:', result.status, result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to subscribe' },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('[subscribe-trial] error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
