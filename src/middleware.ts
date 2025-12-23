import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Response ve Request Hazırlığı
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Supabase Client Oluşturma
  // Middleware içinde Supabase kullanmak için createServerClient kullanılır.
  // Bu, çerezleri (cookies) düzgün bir şekilde yönetmemizi sağlar.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Kullanıcı Oturumunu Kontrol Et
  // getUser() fonksiyonu, veritabanına sorgu atar ve güvenli bir şekilde kullanıcıyı doğrular.
  // getSession() yerine getUser() kullanılması önerilir çünkü getSession() manipüle edilebilir.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // --- KURAL 1: GİRİŞ YAPMAMIŞ KULLANICI KORUMASI ---
  // /profil, /izle ve /admin rotaları için giriş şarttır.
  if (
    !user &&
    (path.startsWith("/profil") ||
      path.startsWith("/izle") ||
      path.startsWith("/admin"))
  ) {
    const url = new URL("/giris", request.url);
    url.searchParams.set("next", path); // Kullanıcı giriş yapınca kaldığı yere dönsün
    return NextResponse.redirect(url);
  }

  // --- KURAL 2: GİRİŞ YAPMIŞ KULLANICIYI ENGELLEME ---
  // Zaten giriş yapmışsa /giris veya /kayitol sayfasına girmesine gerek yok, profile yönlendir.
  if (user && (path.startsWith("/giris") || path.startsWith("/kayitol"))) {
    return NextResponse.redirect(new URL("/profil", request.url));
  }

  // --- KURAL 3: ADMIN KORUMASI ---
  // Sadece 'admin' rolüne sahip kullanıcılar admin paneline girebilir.
  if (path.startsWith("/admin")) {
    if (user?.app_metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // --- KURAL 4: İZLEME (WATCH) KORUMASI ---
  // /izle rotasına giren kullanıcının aktif bir aboneliği olup olmadığını kontrol eder.
  if (path.startsWith("/izle")) {
    const { data: abonelik } = await supabase
      .from("kullanici_abonelikleri")
      .select("id")
      .eq("kullanici_id", user?.id)
      .gte("bitis_tarihi", new Date().toISOString()) // Tarihi kontrol et
      .maybeSingle();

    // Eğer aktif aboneliği YOKSA, abonelik sayfasına yönlendir
    if (!abonelik) {
      const url = new URL("/abonelikler", request.url);
      url.searchParams.set("error", "subscription_required"); // UI'da hata mesajı göstermek için
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Middleware'in çalışacağı yollar
  matcher: [
    "/profil/:path*",
    "/giris",
    "/kayitol",
    "/admin/:path*",
    "/izle/:path*",
  ],
};
