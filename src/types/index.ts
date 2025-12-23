import { Database } from "./database.types";

export * from "./database.types";

// 1. Tablo Okuma Tipi (Senin yazdığın)
export type Table<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

// 2. Veri Ekleme Tipi (Insert) - ID ve created_at zorunlu değildir
export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

// 3. Veri Güncelleme Tipi (Update) - Tüm alanlar opsiyoneldir
export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// 4. Enum Tipi (Eğer veritabanında enum varsa)
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export interface Ozellik {
  text: string;
  included: boolean;
}

export interface AbonelikPaketi {
  id: number;
  paket_adi: string;
  aciklama: string | null;
  fiyat: number;
  sure_gun: number;
  aktif_mi: boolean;
  ozellikler: Ozellik[];
}

