import { userAuthState } from "@/states/auth";
import { NextRequest, NextResponse } from "next/server";
import { useRecoilValue } from "recoil";

export function middleware(req: NextRequest) {
  // const auth = useRecoilValue(userAuthState);
  const { pathname } = req.nextUrl;

  // Example: Redirect users away from `/admin` if they are not authenticated
  const isAuthenticated = false;

  if (pathname.startsWith("/admin") && !isAuthenticated) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to continue if not going to `/admin`
  return NextResponse.next();
}
