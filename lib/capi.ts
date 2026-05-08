import crypto from "crypto";

export const hashSha256 = (value: string | undefined | null): string | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
};

export const normalizePhone = (raw: string | undefined | null): string | undefined => {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.length === 9) return `48${digits}`;
  return digits;
};

export type CapiEventPayload = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
  externalId?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  customData?: Record<string, unknown>;
};

export type MetaGraphEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: "website";
  user_data: Record<string, string | string[]>;
  custom_data?: Record<string, unknown>;
};

export const buildMetaEvent = (
  payload: CapiEventPayload,
  clientIp?: string,
  userAgent?: string
): MetaGraphEvent => {
  const userData: Record<string, string | string[]> = {};
  const em = hashSha256(payload.email);
  const ph = hashSha256(normalizePhone(payload.phone));
  const fn = hashSha256(payload.firstName);
  const ln = hashSha256(payload.lastName);
  const externalId = hashSha256(payload.externalId);
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];
  if (externalId) userData.external_id = [externalId];
  if (payload.fbp) userData.fbp = payload.fbp;
  if (payload.fbc) userData.fbc = payload.fbc;
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;

  const event: MetaGraphEvent = {
    event_name: payload.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: "website",
    user_data: userData,
  };
  if (payload.eventSourceUrl) event.event_source_url = payload.eventSourceUrl;
  if (payload.customData && Object.keys(payload.customData).length > 0) {
    event.custom_data = payload.customData;
  }
  return event;
};
