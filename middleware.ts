// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // Handler runs after authentication & authorization
  (req: NextRequest) => {
    // You can inspect the decoded token here via req.nextauth.token
    const token = (req as any).nextauth?.token
    console.log('Decoded JWT in middleware:', token)
    return NextResponse.next()
  },
  {
    callbacks: {
      // role-based authorization
      authorized: ({ token }) => {
        console.log('Authorized callback token:', token)
        return token?.role === "LIBRARIAN"
      },
    },
    pages: {
      // Redirect unauthenticated users
      signIn: "/auth/login",
      // Redirect unauthorized users
      error: "/",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
  ],
}
