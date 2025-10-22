import { redirect } from "next/navigation";
import supabase from "./supabase";

export async function signUp(gelenEmail: string, gelenSifre: string) {
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

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error);
    return;
  }

  redirect("/profile");
}
