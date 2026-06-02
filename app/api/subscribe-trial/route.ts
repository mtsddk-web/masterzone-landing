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
    const { name, email, source, utm } = (await request.json()) as {
      name?: string;
      email?: string;
      source?: string;
      utm?: {
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_content?: string;
        landing_url?: string;
      };
    };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    const trialGroupId = process.env.SENDER_TRIAL_GROUP_ID?.trim();
    if (!trialGroupId) {
      console.error('[subscribe-trial] SENDER_TRIAL_GROUP_ID not configured');
      return NextResponse.json({ success: false, error: 'Group not configured' }, { status: 500 });
    }

    // Atrybucja leada (lead email-gate / exit-intent / checkout pre-warm) - zapis
    // do custom fields Sender, zeby leady z reklamy bez platnosci tez byly sledzone.
    const attributionFields: Record<string, string> = {};
    if (utm?.utm_source) attributionFields.utm_source = utm.utm_source;
    if (utm?.utm_medium) attributionFields.utm_medium = utm.utm_medium;
    if (utm?.utm_campaign) attributionFields.utm_campaign = utm.utm_campaign;
    if (utm?.utm_content) attributionFields.utm_content = utm.utm_content;
    if (utm?.landing_url) attributionFields.landing_url = utm.landing_url.slice(0, 480);

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
        ...attributionFields,
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
