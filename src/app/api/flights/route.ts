import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bbox = searchParams.toString();

    const username = process.env.OPENSKY_USERNAME;
    const password = process.env.OPENSKY_PASSWORD;

    if (!username || !password) {
      console.error('OpenSky credentials are not set in .env');
    }

    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    const apiUrl = `https://opensky-network.org/api/states/all?${bbox}`;
    
    const res = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      next: { revalidate: 10 } // Cache for 10 seconds (standard for OpenSky)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `OpenSky API error: ${res.status}`, detail: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
