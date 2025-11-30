import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const authHeader = request.headers.get("Authorization");

    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Oturum token'ı bulunamadı" },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş oturum" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID eksik" }, { status: 400 });
    }

    const { data: paket, error: paketError } = await supabase
      .from("abonelik_paketleri")
      .select("*")
      .eq("id", planId)
      .single();

    if (paketError || !paket) {
      return NextResponse.json({ error: "Paket bulunamadı" }, { status: 404 });
    }

    const simdi = new Date();
    const bitisTarihi = new Date();
    bitisTarihi.setDate(simdi.getDate() + (paket.sure_gun || 30));

    const { data: yeniAbonelik, error: abonelikError } = await supabase
      .from("kullanici_abonelikleri")
      .insert({
        kullanici_id: user.id,
        paket_id: paket.id,
        baslangic_tarihi: simdi.toISOString(),
        bitis_tarihi: bitisTarihi.toISOString(),
        durum: "aktif",
        otomatik_yenileme: true,
        provider_abonelik_id: `mock_sub_${Math.random().toString(36).substr(2, 9)}`,
      })
      .select()
      .single();

    if (abonelikError) {
      console.error("Abonelik hatası:", abonelikError);
      return NextResponse.json(
        { error: "Abonelik oluşturulamadı" },
        { status: 500 },
      );
    }

    const { error: odemeError } = await supabase.from("odemeler").insert({
      kullanici_id: user.id,
      abonelik_id: yeniAbonelik.id,
      tutar: paket.fiyat,
      durum: "basarili",
      provider_odeme_id: `mock_pay_${Math.random().toString(36).substr(2, 9)}`,
      odeme_yontemi: {
        type: "credit_card",
        last4: "4242",
        brand: "Visa",
      },
    });

    if (odemeError) {
      console.error("Ödeme logu hatası:", odemeError);
    }

    return NextResponse.json({
      success: true,
      message: "Abonelik başarıyla başlatıldı",
      abonelik: yeniAbonelik,
    });
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
