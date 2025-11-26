import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reason, timestamp, url } = await request.json();

    // Construct webhook URL - będziemy używać Google Apps Script Web App
    const webhookUrl = process.env.EXIT_SURVEY_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('EXIT_SURVEY_WEBHOOK_URL not configured');
      return NextResponse.json({
        success: false,
        error: 'Webhook not configured'
      }, { status: 500 });
    }

    // Send to Google Sheets via webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date(timestamp).toISOString(),
        reason: reason,
        url: url || 'Unknown',
        date: new Date().toLocaleDateString('pl-PL'),
        time: new Date().toLocaleTimeString('pl-PL'),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Exit survey error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
