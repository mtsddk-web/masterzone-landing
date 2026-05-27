import { NextRequest, NextResponse } from "next/server";
import { upsertSubscriber } from "@/lib/sender";

/**
 * Subscribe endpoint — FB Landing "Rozproszenie".
 *
 * MIGRACJA 27.05.2026: MailerLite → Sender.net.
 * Default group: SENDER_FB_LANDING_GROUP_ID (Sender ID "epn2z6" =
 * "Z reklam FB przez Landing Page Rozproszenie", 36 subs po imporcie).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, source, utm } = body;

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "Imię i email są wymagane" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format email" },
        { status: 400 }
      );
    }

    const groupId =
      process.env.SENDER_FB_LANDING_GROUP_ID || "epn2z6";

    const result = await upsertSubscriber({
      email,
      firstname: firstName,
      groups: [groupId],
      fields: {
        source: source || "contact_form",
        utm_source: utm?.source || null,
        utm_medium: utm?.medium || null,
        utm_campaign: utm?.campaign || null,
        signup_date: new Date().toISOString(),
      },
    });

    if (!result.success) {
      console.error("Sender.net subscribe error:", result.status, result.error);
      return NextResponse.json(
        {
          error: "Wystąpił błąd podczas zapisywania. Spróbuj ponownie.",
          details: result.error,
        },
        { status: 500 }
      );
    }

    console.log(
      "✅ Subscriber added (Sender):",
      email,
      "Source:",
      source,
      result.already_exists ? "(already_exists)" : ""
    );

    return NextResponse.json({
      success: true,
      message: result.already_exists
        ? "Ten email jest już zapisany do naszej listy"
        : "Zapisano pomyślnie",
      data: {
        email: result.data?.email || email,
        id: result.data?.id,
      },
    });
  } catch (error) {
    console.error("Error in subscribe API:", error);
    return NextResponse.json(
      {
        error: "Wystąpił błąd podczas zapisywania. Spróbuj ponownie.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
