/**
 * Email transport stub.
 *
 * MVP: Resend (https://resend.com) - 100 emails/day free, RESEND_API_KEY required.
 * TODO: skonfigurowac RESEND_API_KEY w Vercel envach + Resend domain verification (masterzone.edu.pl).
 *
 * Fallback: SMTP nodemailer (nie zainstalowany - jesli Resend brak, log warning + skip).
 */

interface SendMailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface SendMailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = 'MasterZone <kontakt@masterzone.edu.pl>';
const RESEND_API = 'https://api.resend.com/emails';
const USER_AGENT = 'atlas-mz/1.0';

export async function sendMail(args: SendMailArgs): Promise<SendMailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    // CELOWO WYLACZONE: RESEND_API_KEY nie jest ustawiony na Vercel prod.
    // Skool-invite mailem przez Resend to ścieżka opcjonalna - klient i tak trafia
    // na Skool przez: (a) redirect na /checkout/success (instrukcja krok 1-3) +
    // (b) welcome/automation Sender po dodaniu do grupy. Nie traktujemy braku klucza
    // jako bledu - logujemy jawnie raz, dla widocznosci w logach Vercela.
    console.warn(
      `[email] RESEND disabled (no RESEND_API_KEY) - skipping transactional mail to ${args.to}. ` +
        `Sciezka aktywacji: success page + Sender welcome.`
    );
    return { ok: false, error: 'RESEND_API_KEY not configured (intentional)' };
  }

  const payload = {
    from: args.from || DEFAULT_FROM,
    to: [args.to],
    subject: args.subject,
    html: args.html,
    ...(args.text ? { text: args.text } : {}),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[email] Resend send failed:', res.status, data);
      return { ok: false, error: data?.message || `HTTP ${res.status}` };
    }

    console.log('[email] sent to', args.to, 'id:', data?.id);
    return { ok: true, id: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[email] fetch error:', msg);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
}
