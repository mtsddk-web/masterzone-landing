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

    // Pobierz group_id z env (jeśli skonfigurowane)
    const groupId = process.env.MAILERLITE_TRIAL_GROUP_ID;
    console.log('🔍 DEBUG - Group ID from env:', groupId);

    // Add subscriber to MailerLite
    const requestBody: any = {
      email: email,
      fields: {
        source: source || 'Landing - rozproszenie.masterzone.edu.pl',
        last_interest: new Date().toISOString(),
        signup_date: new Date().toISOString(),
        trial_status: 'pending', // pending → active → paid
      },
      status: 'active', // active subscriber
    };

    // Dodaj do grupy jeśli group_id jest skonfigurowane
    if (groupId) {
      requestBody.groups = [groupId];
      console.log('✅ Adding to group:', groupId);
    } else {
      console.log('⚠️ No group ID configured - subscriber will not be added to any group');
    }

    console.log('📤 Request body to MailerLite:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('📥 MailerLite API response status:', response.status);
    console.log('📥 MailerLite API response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      // MailerLite zwraca już użytkownika jako sukces jeśli email istnieje
      if (response.status === 422 && data.message?.includes('already exists')) {
        // User już istnieje - musimy go zaktualizować i dodać do grupy
        console.log('ℹ️ Email already exists in MailerLite, updating subscriber...');

        // Najpierw znajdź subskrybenta po emailu
        const searchResponse = await fetch(
          `https://connect.mailerlite.com/api/subscribers?filter[email]=${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Accept': 'application/json',
            },
          }
        );

        const searchData = await searchResponse.json();
        console.log('🔍 Search response:', JSON.stringify(searchData, null, 2));

        if (searchData.data && searchData.data.length > 0) {
          const subscriberId = searchData.data[0].id;
          console.log('📝 Found subscriber ID:', subscriberId);

          // Teraz zaktualizuj subskrybenta i dodaj do grupy
          const updateResponse = await fetch(
            `https://connect.mailerlite.com/api/subscribers/${subscriberId}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                fields: {
                  source: source || 'Landing - rozproszenie.masterzone.edu.pl',
                  last_interest: new Date().toISOString(),
                  trial_status: 'pending',
                },
                groups: [groupId],
              }),
            }
          );

          const updateData = await updateResponse.json();
          console.log('✅ Updated existing subscriber:', JSON.stringify(updateData, null, 2));

          return NextResponse.json({
            success: true,
            message: 'Email updated and added to group',
            existing: true,
            subscriber_id: subscriberId
          });
        }

        // Jeśli nie znaleziono subskrybenta, zwróć sukces (może być delay w API)
        console.log('⚠️ Could not find subscriber, but email exists');
        return NextResponse.json({
          success: true,
          message: 'Email already subscribed',
          existing: true
        });
      }

      console.error('❌ MailerLite error:', data);
      return NextResponse.json({
        success: false,
        error: data.message || 'Failed to subscribe'
      }, { status: response.status });
    }

    console.log('✅ Successfully added subscriber to MailerLite');
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
