import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Yanıtı en başta BİR KEZ oluşturun
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
        // 'get' fonksiyonunuz zaten doğruydu
        get(name) {
          return request.cookies.get(name)?.value;
        },
        // 'set' fonksiyonu SADECE 'response' nesnesini değiştirmeli
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        // 'remove' fonksiyonu SADECE 'response' nesnesini değiştirmeli
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

  // Yönlendirme mantığı (bu kısım doğruydu)
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

  // 4. Değiştirilmiş (veya değiştirilmemiş) yanıtı döndür
  return response;
}

export const config = {
  matcher: ["/profil/:path*", "/giris", "/kayitol"],
};
