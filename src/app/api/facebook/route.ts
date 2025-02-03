import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { eventName, eventData } = await request.json();
    
    const response = await fetch(`https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          ...eventData
        }]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Facebook API Error:', error);
    return NextResponse.json({ error: 'Error tracking event' }, { status: 500 });
  }
} 