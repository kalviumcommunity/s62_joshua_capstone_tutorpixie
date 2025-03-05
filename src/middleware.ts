// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Optional: Add custom logic for specific routes
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Example: Additional role-based access control
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null
    },
    pages: {
      signIn: '/login',
      error: '/auth/error'
    }
  }
)

export const config = {
  matcher: [
    // Protect specific routes
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*'
  ]
}