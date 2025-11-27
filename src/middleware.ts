import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token");
  const pathname = req.nextUrl.pathname;
    // const isPublicRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/verify-otp") || pathname.startsWith("/create-password");
if(!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
}

if(!token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
}    

  return NextResponse.next();
}
