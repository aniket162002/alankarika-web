import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Check if the route is admin-related
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth check for login page
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for admin session token in cookies
    const sessionToken = req.cookies.get('admin_session_token')?.value

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // For development: Allow mock sessions
    if (sessionToken.startsWith('mock_session_')) {
      return NextResponse.next()
    }

    // For production: Add real session validation here if needed
    // Currently allowing all non-mock sessions to pass through
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}