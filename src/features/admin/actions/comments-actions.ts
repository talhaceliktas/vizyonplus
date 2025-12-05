"use server";

import supabaseServer from "@lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCommentAction(commentId: number) {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("yorumlar") // Silme işlemi asıl tablodan yapılır
    .delete()
    .eq("id", commentId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Admin yorumlar sayfasını yenile (Taze veriyi getir)
  revalidatePath("/admin/yorumlar");

  return { success: true };
}
