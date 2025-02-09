import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // List of public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  // If the route is public, allow access regardless of auth status
  if (isPublicRoute) {
    return res
  }

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If we're not on a public route and there's no session, redirect to login
  if (!session) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

