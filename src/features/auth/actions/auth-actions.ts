"use server";

import supabaseServer from "@lib/supabase/server";

// Formdan gelen verinin tipi
interface LoginActionData {
  email: string;
  sifre: string;
}

export async function loginAction(data: LoginActionData) {
  const supabase = await supabaseServer();

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

  return { success: true };
}

export async function registerAction(
  gelenIsim: string,
  gelenEmail: string,
  gelenSifre: string,
) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.auth.signUp({
    email: gelenEmail,
    password: gelenSifre,
    options: {
      data: {
        display_name: gelenIsim,
      },
    },
  });

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

  if (data) {
    return {
      durum: "basarili",
      message: data.user?.email || "Email gönderildi",
    };
  }

  return { durum: "basarisiz", message: "Beklenmedik hata" };
}
