import { NextRequest, NextResponse } from "next/server";
import { senderUpsertSubscriber } from "@/lib/sender";

/**
 * /api/workshop-signup - zapis na warsztat (np. "Sabotazysci Mentalni").
 *
 * Sender.net (primary). Wczesniej POSTowal do MailerLite (grupa 181727205492000257),
 * ale MailerLite ma WSZYSTKIE automatyzacje wylaczone => leady szly w prozne.
 * Migracja MailerLite -> Sender (decyzja 28.05.2026), zgodnie z subscribe-trial.
 *
 * Idempotencja: senderUpsertSubscriber robi create OR add-to-group (422 fallback).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://masterzone.edu.pl",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, ref } = body;
    const source = ref || "direct";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Imię i email są wymagane" },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format email" },
        { status: 400, headers: corsHeaders }
      );
    }

    const workshopGroupId = process.env.SENDER_WORKSHOP_GROUP_ID?.trim();
    if (!workshopGroupId) {
      console.error("[workshop-signup] SENDER_WORKSHOP_GROUP_ID not configured");
      return NextResponse.json(
        { error: "Konfiguracja API nie jest dostępna" },
        { status: 500, headers: corsHeaders }
      );
    }

    const result = await senderUpsertSubscriber({
      email,
      firstname: name?.trim() || undefined,
      groups: [workshopGroupId],
      trigger_automation: true, // pal automation Sender (potwierdzenie zapisu / link Zoom)
      fields: {
        source: `Warsztat Sabotazysci - ref:${source}`,
        signup_date: new Date().toISOString(),
      },
    });

    if (!result.ok) {
      console.error(
        "[workshop-signup] Sender upsert failed:",
        result.status,
        result.error
      );
      return NextResponse.json(
        { error: result.error || "Nie udało się zapisać. Spróbuj ponownie." },
        { status: result.status || 500, headers: corsHeaders }
      );
    }

    console.log("[workshop-signup] signup ok:", email);

    return NextResponse.json(
      { success: true, message: "Zapisano pomyślnie" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[workshop-signup] error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd. Spróbuj ponownie." },
      { status: 500, headers: corsHeaders }
    );
  }
}
