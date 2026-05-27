import { NextRequest, NextResponse } from "next/server";
import { upsertSubscriber } from "@/lib/sender";

/**
 * Workshop signup — "Warsztat Sabotażyści Mentalni 19.03.2026".
 *
 * MIGRACJA 27.05.2026: MailerLite → Sender.net.
 * Sender group ID: "enlOzl" (Warsztat Sabotazysci Mentalni 19.03.2026, 18 subs).
 * Override przez env SENDER_WORKSHOP_GROUP_ID.
 */
const WORKSHOP_GROUP_ID_DEFAULT = "enlOzl";

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

    const groupId =
      process.env.SENDER_WORKSHOP_GROUP_ID || WORKSHOP_GROUP_ID_DEFAULT;

    const result = await upsertSubscriber({
      email,
      firstname: name,
      groups: [groupId],
      fields: {
        source: `Warsztat Sabotazysci - ref:${source}`,
        signup_date: new Date().toISOString(),
      },
    });

    if (!result.success) {
      console.error(
        "Sender.net workshop-signup error:",
        result.status,
        result.error
      );
      return NextResponse.json(
        { error: "Wystąpił błąd. Spróbuj ponownie." },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(
      "Workshop signup (Sender):",
      email,
      result.already_exists ? "(re-signup)" : ""
    );

    return NextResponse.json(
      {
        success: true,
        message: "Zapisano pomyślnie",
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in workshop-signup:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd. Spróbuj ponownie." },
      { status: 500, headers: corsHeaders }
    );
  }
}
