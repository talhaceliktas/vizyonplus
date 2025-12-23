"use server";

import supabaseServer from "@lib/supabase/server";

// BU DOSYA NE İŞE YARAR?
// "Server Actions" dosyasıdır.
// Buradaki fonksiyonlar sunucuda çalışır ama doğrudan Client bileşenlerden (LoginForm vb.) çağrılabilir.
// API endpoint yazmadan sunucu ile haberleşmeyi sağlar.

// Formdan gelen verinin tipi
interface LoginActionData {
  email: string;
  sifre: string;
}

// GİRİŞ İŞLEMİ (Server Action)
export async function loginAction(data: LoginActionData) {
  // Sunucu tarafında çalışan Supabase istemcisini oluştur.
  const supabase = await supabaseServer();

  // Supabase Auth ile giriş yapmayı dene
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.sifre,
  });

  if (error) {
    return {
      success: false,
      error: "Giriş başarısız. E-posta veya şifre hatalı.",
    };
  }

  // Başarılı dönerse, istemci tarafı yönlendirme yapar.
  return { success: true };
}

// KAYIT İŞLEMİ (Server Action)
export async function registerAction(
  gelenIsim: string,
  gelenEmail: string,
  gelenSifre: string,
) {
  const supabase = await supabaseServer();

  // Yeni kullanıcı oluştur (Sign Up)
  // options.data: Kullanıcının profil bilgilerini (isim vb.) meta veri olarak ekler.
  const { data, error } = await supabase.auth.signUp({
    email: gelenEmail,
    password: gelenSifre,
    options: {
      data: {
        display_name: gelenIsim,
      },
    },
  });

  // HATA YÖNETİMİ
  // Ortalama bir kullanıcı için okunabilir hata mesajları.

  // 429: Rate Limit (Çok fazla istek)
  if (error?.status === 429) {
    return {
      durum: "basarisiz",
      message: "Çok sayıda istekte bulundunuz! Bir süre bekleyin.",
    };
  }

  if (error) {
    return {
      durum: "basarisiz",
      message: "Bilinmeyen bir hata oluştu: " + error.message,
    };
  }

  // BAŞARILI
  if (data) {
    return {
      durum: "basarili",
      message: data.user?.email || "Email gönderildi",
    };
  }

  return { durum: "basarisiz", message: "Beklenmedik hata" };
}
