/**
 * Sender.net API client (v2)
 * Docs: https://api.sender.net/
 *
 * Migracja MailerLite → Sender.net (27.05.2026).
 * 485 subscriberów + 24 grupy zostały zaimportowane do Sender.net ręcznie
 * przed migracją kodu, więc ten klient TYLKO obsługuje runtime calls.
 *
 * Strategy: parallel mode (Stripe/PayU webhooks) — wysyłamy do OBU usług
 * przez 1-2 tygodnie, potem usuwamy MailerLite call.
 */

const SENDER_API_BASE = "https://api.sender.net/v2";

export interface SenderSubscriberInput {
  email: string;
  firstname?: string;
  lastname?: string;
  /** Sender.net group IDs (short string, np. "epn2z6"), NIE numeric MailerLite ID */
  groups?: string[];
  /** Custom fields. Sender oczekuje array {id, value} lub object {title:value}.
   * Używamy `fields` jak w MailerLite — Sender przyjmuje object i mapuje sam. */
  fields?: Record<string, string | number | null | undefined>;
  /** Tags = string array w Sender (alternatywa do groups; my używamy groups) */
  trigger_automation?: boolean;
}

export interface SenderResponse {
  success: boolean;
  status: number;
  data?: any;
  error?: string;
  already_exists?: boolean;
}

/**
 * Upsert subscriber w Sender.net.
 *
 * Sender.net POST /v2/subscribers działa jak upsert:
 * - jeśli email nowy → create
 * - jeśli email istnieje → return existing (200) bez zmiany grup
 *
 * Żeby DODAĆ do nowej grupy bez nadpisania istniejącej — używamy
 * dodatkowo POST /v2/subscribers/groups/{group_id} (add to group endpoint).
 *
 * Dla naszego use-case (webhooki płatności + landing signups) wystarczy
 * POST /v2/subscribers z `groups: [...]` — Sender SAM dodaje subscribera
 * do podanej grupy (bez usuwania z innych).
 */
export async function upsertSubscriber(
  input: SenderSubscriberInput
): Promise<SenderResponse> {
  const apiKey = process.env.SENDER_API_KEY;

  if (!apiKey) {
    console.error("SENDER_API_KEY not configured");
    return { success: false, status: 500, error: "API not configured" };
  }

  // Sender.net wymaga firstname jako top-level (nie w fields.name jak MailerLite).
  // Jeśli ktoś przekazał fields.name, przemapuj na firstname.
  let firstname = input.firstname;
  const fields = { ...(input.fields || {}) };
  if (!firstname && fields.name) {
    firstname = String(fields.name);
    delete fields.name;
  }

  // Czyść null/undefined z fields (Sender odrzuca)
  const cleanFields: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== null && v !== undefined && v !== "") {
      cleanFields[k] = typeof v === "number" ? v : String(v);
    }
  }

  const body: Record<string, any> = {
    email: input.email,
  };
  if (firstname) body.firstname = firstname;
  if (input.lastname) body.lastname = input.lastname;
  if (input.groups && input.groups.length > 0) body.groups = input.groups;
  if (Object.keys(cleanFields).length > 0) body.fields = cleanFields;
  if (input.trigger_automation !== undefined) {
    body.trigger_automation = input.trigger_automation;
  }

  try {
    const response = await fetch(`${SENDER_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // 422 / 409 — subscriber już istnieje (Sender zwykle traktuje jako sukces,
      // ale na wszelki wypadek obsługujemy)
      const message = data?.message || "";
      const already =
        response.status === 422 ||
        response.status === 409 ||
        /already exists|duplicate/i.test(message);

      if (already) {
        return {
          success: true,
          status: 200,
          already_exists: true,
          data,
        };
      }

      console.error("Sender.net API error:", response.status, data);
      return {
        success: false,
        status: response.status,
        error: message || `Sender.net error ${response.status}`,
        data,
      };
    }

    return { success: true, status: response.status, data: data?.data || data };
  } catch (error) {
    console.error("Sender.net fetch error:", error);
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Dodaj subscribera do konkretnej grupy (bez zmiany innych pól).
 * Używamy gdy chcemy tylko dotagować istniejącego subscribera.
 */
export async function addSubscriberToGroup(
  email: string,
  groupId: string
): Promise<SenderResponse> {
  const apiKey = process.env.SENDER_API_KEY;
  if (!apiKey) {
    return { success: false, status: 500, error: "API not configured" };
  }

  try {
    const response = await fetch(
      `${SENDER_API_BASE}/subscribers/groups/${groupId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ subscribers: [email] }),
      }
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.message || `Sender.net add-to-group error ${response.status}`,
      };
    }
    return { success: true, status: response.status, data };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * LEGACY parallel-mode helper — wysyła do MailerLite (jeśli kluczyk istnieje).
 * Używane tylko dla webhooków Stripe + PayU przez 1-2 tygodnie po migracji.
 *
 * Po potwierdzeniu że Sender łapie 100% — usunąć wszystkie wywołania
 * (TODO ~10.06.2026 ~2 tyg po deploy).
 */
export async function legacyMailerLiteTag(
  email: string,
  fields: Record<string, string | number>,
  groupId?: string
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return { ok: false, error: "no_key" }; // klucz usunięty = już skończyliśmy parallel mode

  try {
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          fields,
          groups: groupId ? [groupId] : [],
          status: "active",
        }),
      }
    );
    if (!response.ok) {
      return { ok: false, error: `mailerlite_${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unknown",
    };
  }
}
