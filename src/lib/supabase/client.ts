"use client";

import { createBrowserClient } from "@supabase/ssr";

// BU DOSYA NE İŞE YARAR?
// Tarayıcı tarafında (Client Component) çalışan Supabase istemcisidir.
// Oturumu tarayıcının çerezlerinde (cookies) veya LocalStorage'da saklar.
// "use client" bileşenlerinde veritabanına bağlanmak için bu kullanılır.

const supabaseBrowserClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default supabaseBrowserClient;
