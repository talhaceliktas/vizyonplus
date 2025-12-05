import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSubscription } from "@auth/services/authServices";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Oturumu al (ve gerekirse yenile)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/profil")) {
    return NextResponse.redirect(new URL("/giris", request.url));
  }

  if (
    user &&
    (request.nextUrl.pathname.startsWith("/giris") ||
      request.nextUrl.pathname.startsWith("/kayitol"))
  ) {
    return NextResponse.redirect(new URL("/profil", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    user?.app_metadata?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/izle")) {
    const aktifAbonelik = await getCurrentSubscription(user?.id ?? "");

    if (!aktifAbonelik || !user)
      return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/profil/:path*",
    "/giris",
    "/kayitol",
    "/admin",
    "/admin/:islem",
    "/izle/:path*",
  ],
};
