import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isFamilyArea = pathname.startsWith("/user");
  const isCaregiverArea = pathname.startsWith("/nurse");

  // Allow unauthenticated access to signup pages for both roles
  const isPublicFamilyPath = pathname === "/user/signup";
  const isPublicCaregiverPath = pathname === "/nurse/signup";

  if (isPublicFamilyPath || isPublicCaregiverPath) {
    return NextResponse.next();
  }

  if (!isFamilyArea && !isCaregiverArea) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL("/signin", req.url);
    return NextResponse.redirect(url);
  }

  const role = token.role as "FAMILY" | "CAREGIVER" | undefined;

  if (isFamilyArea && role !== "FAMILY") {
    return NextResponse.redirect(new URL("/nurse/dashboard", req.url));
  }

  if (isCaregiverArea && role !== "CAREGIVER") {
    return NextResponse.redirect(new URL("/user/intake", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/nurse/:path*"],
};


