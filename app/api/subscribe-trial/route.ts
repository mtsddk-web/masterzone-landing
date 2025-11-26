import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address'
      }, { status: 400 });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error('MAILERLITE_API_KEY not configured');
      return NextResponse.json({
        success: false,
        error: 'API not configured'
      }, { status: 500 });
    }

    // Add subscriber to MailerLite
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        fields: {
          source: source || 'Landing - rozproszenie.masterzone.edu.pl',
          last_interest: new Date().toISOString(),
        },
        // Automatycznie przypisz do grupy jeśli istnieje
        // groups: ['group_id_here'], // Opcjonalnie dodaj grupę
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // MailerLite zwraca już użytkownika jako sukces jeśli email istnieje
      if (response.status === 422 && data.message?.includes('already exists')) {
        // User już istnieje - to też sukces
        return NextResponse.json({
          success: true,
          message: 'Email already subscribed',
          existing: true
        });
      }

      console.error('MailerLite error:', data);
      return NextResponse.json({
        success: false,
        error: data.message || 'Failed to subscribe'
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      subscriber_id: data.data?.id
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
