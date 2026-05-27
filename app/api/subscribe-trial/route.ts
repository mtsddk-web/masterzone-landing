import { NextResponse } from "next/server";
import { upsertSubscriber } from "@/lib/sender";

/**
 * Trial subscribe endpoint — landing "rozproszenie.masterzone.edu.pl".
 *
 * MIGRACJA 27.05.2026: MailerLite → Sender.net.
 * Group: env SENDER_TRIAL_GROUP_ID (np. "b8gE9o" Newsletter - Główna).
 *
 * Sender.net obsluguje upsert natywnie — tworzy nowego lub aktualizuje
 * istniejacego subscribera, dolaczajac do grupy. Nie musimy juz robic
 * GET + PUT jak w MailerLite.
 */
export async function POST(request: Request) {
  try {
    const { name, email, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    const groupId = process.env.SENDER_TRIAL_GROUP_ID;
    if (!groupId) {
      console.warn(
        "⚠️ SENDER_TRIAL_GROUP_ID not set — subscriber nie zostanie dodany do żadnej grupy"
      );
    }

    const result = await upsertSubscriber({
      email,
      firstname: name || undefined,
      groups: groupId ? [groupId] : [],
      fields: {
        source: source || "Landing - rozproszenie.masterzone.edu.pl",
        last_interest: new Date().toISOString(),
        signup_date: new Date().toISOString(),
        trial_status: "pending",
      },
    });

    if (!result.success) {
      console.error(
        "❌ Sender.net subscribe-trial error:",
        result.status,
        result.error
      );
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to subscribe",
        },
        { status: result.status || 500 }
      );
    }

    console.log(
      "✅ Trial subscriber added (Sender):",
      email,
      result.already_exists ? "(already_exists)" : ""
    );

    return NextResponse.json({
      success: true,
      message: result.already_exists
        ? "Email already subscribed"
        : "Successfully subscribed",
      existing: result.already_exists || false,
      subscriber_id: result.data?.id,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
