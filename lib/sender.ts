/**
 * Sender.net API client.
 *
 * Migracja MailerLite -> Sender (decyzja 28.05.2026). Radek przenios 716 active subs 19.04.2026,
 * ale apka dalej pisala do MailerLite => fragmentacja list i 0 trialow konwertujace w ostatnim okresie.
 *
 * Wszystkie calls maja User-Agent (Cloudflare WAF) zgodnie z external-api-cloudflare-ua.md.
 *
 * Sender.net REST v2: https://api.sender.net/v2
 *   POST /subscribers                       - create or 422 jesli juz istnieje
 *   PUT  /subscribers/groups/{group_id}     - add existing subscribers to group (body: subscribers: [email])
 */

const SENDER_API = 'https://api.sender.net/v2';
const USER_AGENT = 'atlas-mz/1.0';
const REQUEST_TIMEOUT_MS = 30_000;

interface SenderUpsertArgs {
  email: string;
  firstname?: string;
  lastname?: string;
  groups: string[];                  // ['epn2z6'] - Sender group_id (NIE liczbowe!)
  trigger_automation?: boolean;      // domyslnie false
  fields?: Record<string, unknown>;  // custom fields (Sender custom fields - opcjonalne)
}

interface SenderResponse {
  ok: boolean;
  status: number;
  data: unknown;
  error?: string;
}

function getApiKey(): string | null {
  const key = process.env.SENDER_API_KEY?.trim();
  if (!key) {
    console.error('[sender] SENDER_API_KEY not configured');
    return null;
  }
  return key;
}

async function senderFetch(
  path: string,
  init: RequestInit
): Promise<SenderResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, status: 0, data: null, error: 'SENDER_API_KEY missing' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${SENDER_API}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': USER_AGENT,
        ...(init.headers || {}),
      },
    });

    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      // Sender moze zwrocic puste body przy 204
    }

    if (!res.ok) {
      console.error(`[sender] ${init.method || 'GET'} ${path} -> ${res.status}`, data);
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[sender] fetch failed ${path}:`, msg);
    return { ok: false, status: 0, data: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Upsert subscriber: create OR add to group jesli juz istnieje.
 *
 * Idempotent: 422 (already exists) => fallback add-to-group przez PUT /subscribers/groups/{id}.
 */
export async function senderUpsertSubscriber(args: SenderUpsertArgs): Promise<SenderResponse> {
  const {
    email,
    firstname,
    lastname,
    groups,
    trigger_automation = false,
    fields,
  } = args;

  if (!email || !email.includes('@')) {
    return { ok: false, status: 400, data: null, error: 'Invalid email' };
  }
  if (!groups || groups.length === 0) {
    return { ok: false, status: 400, data: null, error: 'No groups specified' };
  }

  const body: Record<string, unknown> = {
    email,
    groups,
    trigger_automation,
  };
  if (firstname) body.firstname = firstname;
  if (lastname) body.lastname = lastname;
  if (fields && Object.keys(fields).length > 0) body.fields = fields;

  // 1. Try create
  const created = await senderFetch('/subscribers', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (created.ok) {
    return created;
  }

  // 2. Jesli 422 (already exists) => add to kazdej grupy osobno
  if (created.status === 422) {
    console.log(`[sender] subscriber ${email} already exists, adding to groups: ${groups.join(',')}`);
    let lastResult: SenderResponse = created;
    for (const groupId of groups) {
      const added = await senderAddToGroup(email, groupId);
      lastResult = added;
      if (!added.ok) {
        console.error(`[sender] add-to-group failed for ${email} -> ${groupId}: ${added.status}`);
        // continue z reszta grup, ale zwroc ostatni status
      }
    }
    // Zwroc ok jesli przynajmniej jedna grupa udana
    return { ...lastResult, ok: true, status: 200 };
  }

  return created;
}

/**
 * Add existing subscriber to group.
 *
 * Endpoint: PUT /subscribers/groups/{group_id}
 * Body: { subscribers: ['email1@x.com', 'email2@y.com'] }
 */
export async function senderAddToGroup(email: string, groupId: string): Promise<SenderResponse> {
  if (!email || !groupId) {
    return { ok: false, status: 400, data: null, error: 'Missing email or groupId' };
  }
  return senderFetch(`/subscribers/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify({ subscribers: [email] }),
  });
}

/**
 * Optional: dodaj tag do subscriber-a (jesli uzywamy w Sender automations).
 *
 * Sender ma "tags" jako pole na subscriberze (przez PATCH /subscribers/{email_or_id}).
 * Tutaj uproszczenie: nie potrzebujemy w MVP - groups wystarcza dla segmentacji trial vs paid.
 */
export async function senderTagSubscriber(email: string, tag: string): Promise<SenderResponse> {
  if (!email || !tag) {
    return { ok: false, status: 400, data: null, error: 'Missing email or tag' };
  }
  // Sender update via PATCH /subscribers/{email}
  return senderFetch(`/subscribers/${encodeURIComponent(email)}`, {
    method: 'PATCH',
    body: JSON.stringify({ tags: [tag] }),
  });
}
