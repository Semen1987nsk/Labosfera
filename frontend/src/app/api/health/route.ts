import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Проверка основных переменных окружения
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      api_url: apiUrl,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Internal server error'
      },
      { status: 503 }
    );
  }
}