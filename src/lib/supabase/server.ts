"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// BU DOSYA NE İŞE YARAR?
// Sunucu tarafında (Server Component, Server Action, API Route) çalışan Supabase istemcisidir.
// Kullanıcının oturumunu doğrulamak için tarayıcıdan gelen ÇEREZLERİ (Cookies) okur.

export default async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Çerez Okuma
        get(name) {
          return cookieStore.get(name)?.value;
        },
        // Çerez Yazma (Giriş yapınca)
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component içinde çerez yazılamaz uyarısını yutmak için boş catch.
            // (Çerez yazma işlemi genellikle Middleware veya Server Action'da olur)
          }
        },
        // Çerez Silme (Çıkış yapınca)
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {}
        },
      },
    },
  );
}
