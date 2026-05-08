import { NextRequest, NextResponse } from "next/server";
import { buildMetaEvent, CapiEventPayload } from "@/lib/capi";

export const runtime = "nodejs";

const PIXEL_ID = process.env.META_PIXEL_ID || "1203345207633415";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    console.error("[CAPI] META_CAPI_ACCESS_TOKEN missing");
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }

  let body: CapiEventPayload;
  try {
    body = (await req.json()) as CapiEventPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body?.eventName || !body?.eventId) {
    return NextResponse.json({ ok: false, error: "missing_event_fields" }, { status: 400 });
  }

  const xff = req.headers.get("x-forwarded-for");
  const clientIp = xff ? xff.split(",")[0].trim() : req.headers.get("x-real-ip") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  const event = buildMetaEvent(body, clientIp, userAgent);

  const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  const requestBody: Record<string, unknown> = { data: [event] };
  if (TEST_EVENT_CODE) requestBody.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("[CAPI] Meta API error", res.status, json);
      return NextResponse.json({ ok: false, status: res.status, meta: json }, { status: 502 });
    }
    return NextResponse.json({ ok: true, meta: json });
  } catch (err) {
    console.error("[CAPI] fetch failed", err);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 502 });
  }
}
