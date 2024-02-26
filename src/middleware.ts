import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login";
    const token = request.cookies.get("token")?.value || null;
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL(`${path}`, request.nextUrl));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    return null;
}

export const config = {
    matcher: ["/((?!api|images|_next/static|_next/image|favicon.ico|login).*)"],
};
