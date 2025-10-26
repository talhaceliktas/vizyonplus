"use client"; // Bu modülün kendisi istemci tarafı içindir

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Tarayıcıda çalışacak bir Supabase istemcisi oluştur
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
