import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('user_session_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('user_id', '', { path: '/', maxAge: 0 });
  return response;
} 