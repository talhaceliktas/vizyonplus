import { createClient } from "@supabase/supabase-js";

// Bu fonksiyon COOKIE KULLANMAZ.
// Sadece veritabanından public verileri çekmek içindir.
// Next.js bunu gördüğünde sayfayı statik (SSG) yapabilir.
export const supabaseStatic = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
