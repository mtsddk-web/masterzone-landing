import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, source, utm } = body;

    // Validate required fields
    if (!firstName || !email) {
      return NextResponse.json(
        { error: "Imię i email są wymagane" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format email" },
        { status: 400 }
      );
    }

    // Get MailerLite API key from environment
    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error("❌ MAILERLITE_API_KEY not configured");
      return NextResponse.json(
        { error: "Konfiguracja API nie jest dostępna" },
        { status: 500 }
      );
    }

    // Prepare subscriber data for MailerLite
    const subscriberData = {
      email: email,
      fields: {
        name: firstName,
        source: source || "contact_form",
        utm_source: utm?.source || null,
        utm_medium: utm?.medium || null,
        utm_campaign: utm?.campaign || null,
        signup_date: new Date().toISOString()
      }
    };

    // Call MailerLite API
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      },
      body: JSON.stringify(subscriberData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("MailerLite API Error:", response.status, errorData);

      // Check if subscriber already exists
      if (response.status === 422 || response.status === 409) {
        return NextResponse.json(
          { message: "Ten email jest już zapisany do naszej listy" },
          { status: 200 } // Still return 200 to allow redirect to Skool
        );
      }

      throw new Error(`MailerLite API error: ${response.status}`);
    }

    const result = await response.json();

    console.log("✅ Subscriber added:", email, "Source:", source);

    return NextResponse.json({
      success: true,
      message: "Zapisano pomyślnie",
      data: {
        email: result.data?.email,
        id: result.data?.id
      }
    });

  } catch (error) {
    console.error("Error in subscribe API:", error);
    return NextResponse.json(
      {
        error: "Wystąpił błąd podczas zapisywania. Spróbuj ponownie.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
