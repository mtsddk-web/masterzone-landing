/**
 * Skool invite stub.
 *
 * Skool.com nie ma public API do programatic invite generation - musimy:
 * (a) wyslac klientowi mail z linkiem invite (SKOOL_INVITE_URL env),
 * (b) recznie kopiowac dedykowane invite-y po stronie admina Skool jesli chcemy
 *     spersonalizowanego linku per klient.
 *
 * MVP: jeden public invite link wysylany w transakcyjnym mailu Resend zaraz po
 * checkout.session.completed (server-side, NIE klient-side, bo klient moze
 * zamknac success page przed obejrzeniem CTA).
 */

import { sendMail } from './email';

const FALLBACK_SKOOL_URL = 'https://www.skool.com/masterzone/about';

interface SkoolInviteArgs {
  email: string;
  firstname?: string;
}

interface SkoolInviteResult {
  ok: boolean;
  error?: string;
}

function buildHtml(skoolUrl: string, firstname?: string): string {
  const hello = firstname ? `Cześć ${firstname},` : 'Cześć,';
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height:1.5; color:#1a1a1a; max-width:540px; margin:0 auto; padding:24px;">
  <p>${hello}</p>

  <p>Dzięki za zaufanie! Twój 7-dniowy trial MasterZone właśnie wystartował.</p>

  <p>Jeden krok do dołączenia: kliknij link poniżej i dołącz do społeczności tym samym adresem email, którego użyłeś przy zakupie.</p>

  <p style="text-align:center; margin:32px 0;">
    <a href="${skoolUrl}"
       style="display:inline-block; background:#F5B731; color:#1a1a1a; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
      Dołącz do społeczności
    </a>
  </p>

  <p style="font-size:12px; color:#555;">Link bezpośredni: <a href="${skoolUrl}">${skoolUrl}</a></p>

  <p>Widzimy się na pierwszym bloku pracy głębokiej.</p>

  <p>Pozdrawiam<br/>Mateusz</p>

  <hr style="border:none; border-top:1px solid #eee; margin:24px 0;"/>
  <p style="font-size:11px; color:#999;">
    MasterZone &mdash; Strefa Skupienia<br/>
    Jeśli to nie Ty robiłeś zakup, napisz na <a href="mailto:kontakt@masterzone.edu.pl">kontakt@masterzone.edu.pl</a>.
  </p>
</body>
</html>`;
}

function buildText(skoolUrl: string, firstname?: string): string {
  const hello = firstname ? `Cześć ${firstname},` : 'Cześć,';
  return `${hello}

Dzięki za zaufanie! Twój 7-dniowy trial MasterZone właśnie wystartował.

Jeden krok do dołączenia: kliknij link poniżej i dołącz do społeczności tym samym adresem email, którego użyłeś przy zakupie.

Dołącz do społeczności:
${skoolUrl}

Widzimy się na pierwszym bloku pracy głębokiej.

Pozdrawiam
Mateusz

--
MasterZone - Strefa Skupienia
kontakt@masterzone.edu.pl`;
}

export async function sendSkoolInvite(args: SkoolInviteArgs): Promise<SkoolInviteResult> {
  if (!args.email || !args.email.includes('@')) {
    return { ok: false, error: 'Invalid email' };
  }

  const skoolUrl = process.env.SKOOL_INVITE_URL?.trim() || FALLBACK_SKOOL_URL;

  const result = await sendMail({
    to: args.email,
    subject: 'Witaj w MasterZone - dołącz do społeczności',
    html: buildHtml(skoolUrl, args.firstname),
    text: buildText(skoolUrl, args.firstname),
  });

  return { ok: result.ok, error: result.error };
}
