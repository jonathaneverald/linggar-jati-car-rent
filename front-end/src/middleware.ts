import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    if (isAuthPage(request)) {
        return NextResponse.next();
    }

    const token = request.cookies.get("jwtToken")?.value;
    if (!token) {
        return redirectToLogin(request);
    }

    try {
        const userData = await validateToken(token);
        if (!userData) {
            return redirectToLogin(request);
        }

        if (isAdminRoute(request) && !isAdminRole(userData.role_id)) {
            return new NextResponse("Access denied", { status: 403 });
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return redirectToLogin(request);
    }
}

async function validateToken(token: string): Promise<{ role_id: number } | null> {
    const response = await fetch("http://127.0.0.1:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data.message === "Success" ? data.data : null;
}

function isAuthPage(request: NextRequest): boolean {
    return ["/login", "/register"].includes(request.nextUrl.pathname);
}

function isAdminRoute(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith("/admin/");
}

function isAdminRole(role_id: number): boolean {
    return role_id == 1;
}

function redirectToLogin(request: NextRequest): NextResponse {
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
