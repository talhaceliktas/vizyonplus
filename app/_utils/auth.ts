import supabase from "./supabase";

export async function signUp(gelenEmail: string, gelenSifre: string) {
  if (gelenSifre.length < 8) {
    return {
      durum: "basarisiz",
      message: "Girilen şifre 8 karakterden az olamaz",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: gelenEmail,
    password: gelenSifre,
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
      message: "Bilinmeyen bir hata oluştu!",
    };
  }

  if (data) {
    return {
      durum: "basarili",
      message: data.user?.email || "HATA",
    };
  }
}
