import { NextRequest, NextResponse } from "next/server";

const WORKSHOP_GROUP_ID = "181727205492000257";

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
    const { name, email } = body;

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

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.error("MAILERLITE_API_KEY not configured");
      return NextResponse.json(
        { error: "Konfiguracja API nie jest dostępna" },
        { status: 500, headers: corsHeaders }
      );
    }

    const subscriberData = {
      email: email,
      groups: [WORKSHOP_GROUP_ID],
      fields: {
        name: name,
        source: "Landing - Warsztat Sabotazysci Mentalni",
        signup_date: new Date().toISOString(),
      },
    };

    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        body: JSON.stringify(subscriberData),
      }
    );

    if (!response.ok) {
      if (response.status === 422 || response.status === 409) {
        return NextResponse.json(
          { success: true, message: "Ten email jest już zapisany" },
          { status: 200, headers: corsHeaders }
        );
      }
      const errorData = await response.json().catch(() => null);
      console.error("MailerLite API Error:", response.status, errorData);
      throw new Error(`MailerLite API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Workshop signup:", email);

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
