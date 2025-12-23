"use server";

/**
 * Bu dosya, kullanıcı profili ve kimlik doğrulama işlemleri için Server Actions içerir.
 * Profil güncelleme, şifre değiştirme gibi hassas işlemler burada güvenli bir şekilde yapılır.
 */

import { revalidatePath } from "next/cache";
import supabaseServer from "@lib/supabase/server";

/**
 * Kullanıcı profil bilgilerini (isim, cinsiyet vb.) günceller.
 * Hem Supabase Auth metadata'sını hem de `profiller` tablosunu senkronize olarak günceller.
 */
export async function updateProfileAction(formData: FormData) {
  const supabase = await supabaseServer();

  // 1. Form verilerini al
  const adSoyad = formData.get("adSoyad") as string;
  const cinsiyet = formData.get("cinsiyet") as string;

  // Basit validasyon
  if (!adSoyad || adSoyad.length < 3) {
    return { success: false, error: "Ad Soyad en az 3 karakter olmalıdır." };
  }

  // 2. Mevcut kullanıcıyı al
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Oturum açmanız gerekiyor." };
  }

  try {
    // 3. Supabase Auth (Meta Data) Güncelleme
    // Bu, `auth.users` tablosundaki raw_user_meta_data alanını günceller.
    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: adSoyad },
    });

    if (authError) {
      throw new Error("Auth güncelleme hatası: " + authError.message);
    }

    // 4. Profil Tablosu (Database) Güncelleme
    // Bu, bizim oluşturduğumuz `profiller` tablosunu günceller.
    const { error: dbError } = await supabase
      .from("profiller")
      .update({
        isim: adSoyad,
        cinsiyet: cinsiyet,
      })
      .eq("id", user.id);

    if (dbError) {
      throw new Error("Veritabanı hatası: " + dbError.message);
    }

    // 5. Cache Temizleme
    revalidatePath("/profil"); // Profil sayfasını yenile
    revalidatePath("/", "layout"); // Navbar'daki ismi tak güncellemek için tüm siteyi etkile

    return {
      success: true,
      message: "Profil bilgileri başarıyla güncellendi.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: (error as any).message || "Bir hata oluştu.",
    };
  }
}

/**
 * Kullanıcının şifresini güvenli bir şekilde değiştirir.
 * Önce mevcut şifreyi doğrular, ardından yenisini atar.
 */
export async function changePasswordAction(formData: FormData) {
  const supabase = await supabaseServer();

  // 1. Form verilerini al (Input name'lerine dikkat!)
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 2. Basit Validasyonlar
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Lütfen tüm alanları doldurun." };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "Yeni şifre en az 8 karakter olmalıdır." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Yeni şifreler birbiriyle eşleşmiyor." };
  }

  // 3. Mevcut Kullanıcıyı Al
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      success: false,
      error: "Oturum hatası. Lütfen tekrar giriş yapın.",
    };
  }

  // 4. Mevcut Şifreyi Doğrula (SignIn Denemesi ile)
  // Supabase'de eski şifreyi doğrulamanın en güvenli yolu, o şifreyle yeniden giriş yapmayı denemektir.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Mevcut şifreniz hatalı." };
  }

  // 5. Yeni Şifreyi Güncelle
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      success: false,
      error: "Güncelleme hatası: " + updateError.message,
    };
  }

  return { success: true, message: "Şifreniz başarıyla güncellendi." };
}
