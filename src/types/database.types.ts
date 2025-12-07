export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      abonelik_paketleri: {
        Row: {
          aciklama: string | null
          aktif_mi: boolean | null
          fiyat: number
          id: number
          olusturulma_zamani: string | null
          ozellikler: Json | null
          paket_adi: string
          sure_gun: number
        }
        Insert: {
          aciklama?: string | null
          aktif_mi?: boolean | null
          fiyat: number
          id?: never
          olusturulma_zamani?: string | null
          ozellikler?: Json | null
          paket_adi: string
          sure_gun?: number
        }
        Update: {
          aciklama?: string | null
          aktif_mi?: boolean | null
          fiyat?: number
          id?: never
          olusturulma_zamani?: string | null
          ozellikler?: Json | null
          paket_adi?: string
          sure_gun?: number
        }
        Relationships: []
      }
      ayarlar: {
        Row: {
          bakim_modu: boolean | null
          duyuru_aktif: boolean | null
          duyuru_metni: string | null
          duyuru_tipi: string | null
          id: number
          yeni_uye_alimi: boolean | null
          yorumlar_kilitli: boolean | null
        }
        Insert: {
          bakim_modu?: boolean | null
          duyuru_aktif?: boolean | null
          duyuru_metni?: string | null
          duyuru_tipi?: string | null
          id?: number
          yeni_uye_alimi?: boolean | null
          yorumlar_kilitli?: boolean | null
        }
        Update: {
          bakim_modu?: boolean | null
          duyuru_aktif?: boolean | null
          duyuru_metni?: string | null
          duyuru_tipi?: string | null
          id?: number
          yeni_uye_alimi?: boolean | null
          yorumlar_kilitli?: boolean | null
        }
        Relationships: []
      }
      begeniler: {
        Row: {
          durum: boolean
          guncellenme_zamani: string | null
          icerik_id: number
          id: string
          kullanici_id: string
          olusturulma_zamani: string | null
        }
        Insert: {
          durum: boolean
          guncellenme_zamani?: string | null
          icerik_id: number
          id?: string
          kullanici_id: string
          olusturulma_zamani?: string | null
        }
        Update: {
          durum?: boolean
          guncellenme_zamani?: string | null
          icerik_id?: number
          id?: string
          kullanici_id?: string
          olusturulma_zamani?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "begeniler_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      bolum_yorumlari: {
        Row: {
          bolum_id: number
          created_at: string | null
          id: number
          kullanici_id: string
          olusturulma_zamani: string | null
          spoiler_mi: boolean | null
          yorum: string
        }
        Insert: {
          bolum_id: number
          created_at?: string | null
          id?: number
          kullanici_id: string
          olusturulma_zamani?: string | null
          spoiler_mi?: boolean | null
          yorum: string
        }
        Update: {
          bolum_id?: number
          created_at?: string | null
          id?: number
          kullanici_id?: string
          olusturulma_zamani?: string | null
          spoiler_mi?: boolean | null
          yorum?: string
        }
        Relationships: [
          {
            foreignKeyName: "bolum_yorumlari_bolum_id_fkey"
            columns: ["bolum_id"]
            isOneToOne: false
            referencedRelation: "bolumler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bolum_yorumlari_kullanici_id_fkey1"
            columns: ["kullanici_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
      bolumler: {
        Row: {
          aciklama: string
          baslik: string
          bolum_numarasi: number
          fotograf: string | null
          icerik_id: number
          id: number
          olusturulma_zamani: string
          sezon_numarasi: number
          sure: number
          video_url: string | null
          yayin_tarihi: string | null
        }
        Insert: {
          aciklama: string
          baslik: string
          bolum_numarasi: number
          fotograf?: string | null
          icerik_id: number
          id?: number
          olusturulma_zamani?: string
          sezon_numarasi: number
          sure: number
          video_url?: string | null
          yayin_tarihi?: string | null
        }
        Update: {
          aciklama?: string
          baslik?: string
          bolum_numarasi?: number
          fotograf?: string | null
          icerik_id?: number
          id?: number
          olusturulma_zamani?: string
          sezon_numarasi?: number
          sure?: number
          video_url?: string | null
          yayin_tarihi?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bolumler_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bolumler_dizi_sezon"
            columns: ["icerik_id", "sezon_numarasi"]
            isOneToOne: false
            referencedRelation: "dizi"
            referencedColumns: ["icerik_id", "sezon_numarasi"]
          },
        ]
      }
      daha_sonra_izle: {
        Row: {
          icerikler_id: number
          kullanici_id: string
          olusturulma_zamani: string
        }
        Insert: {
          icerikler_id: number
          kullanici_id?: string
          olusturulma_zamani?: string
        }
        Update: {
          icerikler_id?: number
          kullanici_id?: string
          olusturulma_zamani?: string
        }
        Relationships: [
          {
            foreignKeyName: "daha_sonra_izle_icerikler_id_fkey"
            columns: ["icerikler_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      dizi: {
        Row: {
          icerik_id: number
          olusturulma_zamani: string
          sezon_numarasi: number
        }
        Insert: {
          icerik_id?: number
          olusturulma_zamani?: string
          sezon_numarasi: number
        }
        Update: {
          icerik_id?: number
          olusturulma_zamani?: string
          sezon_numarasi?: number
        }
        Relationships: [
          {
            foreignKeyName: "dizi_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      favoriler: {
        Row: {
          icerikler_id: number
          kullanici_id: string
          olusturulma_zamani: string
        }
        Insert: {
          icerikler_id: number
          kullanici_id?: string
          olusturulma_zamani?: string
        }
        Update: {
          icerikler_id?: number
          kullanici_id?: string
          olusturulma_zamani?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoriler_icerikler_id_fkey"
            columns: ["icerikler_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      film_ucretleri: {
        Row: {
          icerikler_id: number
          id: number
          indirim_orani: number | null
          ogrenci_indirim_orani: number | null
          olusturulma_zamani: string
          satin_alma_ucreti: number
        }
        Insert: {
          icerikler_id: number
          id?: number
          indirim_orani?: number | null
          ogrenci_indirim_orani?: number | null
          olusturulma_zamani?: string
          satin_alma_ucreti: number
        }
        Update: {
          icerikler_id?: number
          id?: number
          indirim_orani?: number | null
          ogrenci_indirim_orani?: number | null
          olusturulma_zamani?: string
          satin_alma_ucreti?: number
        }
        Relationships: [
          {
            foreignKeyName: "film_ucretleri_icerikler_id_fkey"
            columns: ["icerikler_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      icerik_puan_istatistikleri: {
        Row: {
          created_at: string
          icerik_id: number
          id: number
          toplam_kullanici: number
          toplam_puan: number
        }
        Insert: {
          created_at?: string
          icerik_id: number
          id?: never
          toplam_kullanici?: number
          toplam_puan?: number
        }
        Update: {
          created_at?: string
          icerik_id?: number
          id?: never
          toplam_kullanici?: number
          toplam_puan?: number
        }
        Relationships: [
          {
            foreignKeyName: "icerik_puan_istatistikleri_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: true
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      icerik_puanlari: {
        Row: {
          created_at: string
          icerik_id: number
          id: number
          kullanici_id: string
          puan: number
        }
        Insert: {
          created_at?: string
          icerik_id: number
          id?: never
          kullanici_id: string
          puan: number
        }
        Update: {
          created_at?: string
          icerik_id?: number
          id?: never
          kullanici_id?: string
          puan?: number
        }
        Relationships: [
          {
            foreignKeyName: "icerik_puanlari_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      icerikler: {
        Row: {
          aciklama: string | null
          fotograf: string
          id: number
          isim: string
          olusturulma_zamani: string
          slug: string
          sure: number
          tur: string
          turler: string[] | null
          video_url: string | null
          yan_fotograf: string | null
          yayinlanma_tarihi: string
          yonetmen: string | null
        }
        Insert: {
          aciklama?: string | null
          fotograf: string
          id?: number
          isim: string
          olusturulma_zamani?: string
          slug: string
          sure: number
          tur: string
          turler?: string[] | null
          video_url?: string | null
          yan_fotograf?: string | null
          yayinlanma_tarihi: string
          yonetmen?: string | null
        }
        Update: {
          aciklama?: string | null
          fotograf?: string
          id?: number
          isim?: string
          olusturulma_zamani?: string
          slug?: string
          sure?: number
          tur?: string
          turler?: string[] | null
          video_url?: string | null
          yan_fotograf?: string | null
          yayinlanma_tarihi?: string
          yonetmen?: string | null
        }
        Relationships: []
      }
      izleme_gecmisi: {
        Row: {
          bitti_mi: boolean | null
          bolum_id: number | null
          created_at: string | null
          film_id: number | null
          id: string
          kalinan_saniye: number
          kullanici_id: string
          toplam_saniye: number
          updated_at: string | null
        }
        Insert: {
          bitti_mi?: boolean | null
          bolum_id?: number | null
          created_at?: string | null
          film_id?: number | null
          id?: string
          kalinan_saniye?: number
          kullanici_id: string
          toplam_saniye?: number
          updated_at?: string | null
        }
        Update: {
          bitti_mi?: boolean | null
          bolum_id?: number | null
          created_at?: string | null
          film_id?: number | null
          id?: string
          kalinan_saniye?: number
          kullanici_id?: string
          toplam_saniye?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "izleme_gecmisi_bolum_id_fkey"
            columns: ["bolum_id"]
            isOneToOne: false
            referencedRelation: "bolumler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "izleme_gecmisi_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      kullanici_abonelikleri: {
        Row: {
          baslangic_tarihi: string | null
          bitis_tarihi: string
          id: string
          kullanici_id: string
          otomatik_yenileme: boolean | null
          paket_id: number
          provider_abonelik_id: string | null
        }
        Insert: {
          baslangic_tarihi?: string | null
          bitis_tarihi: string
          id?: string
          kullanici_id: string
          otomatik_yenileme?: boolean | null
          paket_id: number
          provider_abonelik_id?: string | null
        }
        Update: {
          baslangic_tarihi?: string | null
          bitis_tarihi?: string
          id?: string
          kullanici_id?: string
          otomatik_yenileme?: boolean | null
          paket_id?: number
          provider_abonelik_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kullanici_abonelikleri_kullanici_id_fkey"
            columns: ["kullanici_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kullanici_abonelikleri_paket_id_fkey"
            columns: ["paket_id"]
            isOneToOne: false
            referencedRelation: "abonelik_paketleri"
            referencedColumns: ["id"]
          },
        ]
      }
      profiller: {
        Row: {
          cinsiyet: string | null
          id: string
          isim: string | null
          olusturulma_zamani: string | null
          profil_fotografi: string | null
          yasakli_mi: boolean | null
        }
        Insert: {
          cinsiyet?: string | null
          id: string
          isim?: string | null
          olusturulma_zamani?: string | null
          profil_fotografi?: string | null
          yasakli_mi?: boolean | null
        }
        Update: {
          cinsiyet?: string | null
          id?: string
          isim?: string | null
          olusturulma_zamani?: string | null
          profil_fotografi?: string | null
          yasakli_mi?: boolean | null
        }
        Relationships: []
      }
      tanitimlar: {
        Row: {
          icerik_id: number
          olusturulma_zamani: string
        }
        Insert: {
          icerik_id: number
          olusturulma_zamani?: string
        }
        Update: {
          icerik_id?: number
          olusturulma_zamani?: string
        }
        Relationships: [
          {
            foreignKeyName: "tanitimlar_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: true
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
        ]
      }
      tekil_satin_almalar: {
        Row: {
          created_at: string
          durum: string
          film_id: number
          fiyat: number
          id: string
          kullanici_id: string
        }
        Insert: {
          created_at?: string
          durum?: string
          film_id: number
          fiyat: number
          id?: string
          kullanici_id: string
        }
        Update: {
          created_at?: string
          durum?: string
          film_id?: number
          fiyat?: number
          id?: string
          kullanici_id?: string
        }
        Relationships: []
      }
      yorumlar: {
        Row: {
          icerik_id: number | null
          id: number
          kullanici_id: string | null
          olusturulma_zamani: string
          spoiler_mi: boolean | null
          yorum: string | null
        }
        Insert: {
          icerik_id?: number | null
          id?: number
          kullanici_id?: string | null
          olusturulma_zamani?: string
          spoiler_mi?: boolean | null
          yorum?: string | null
        }
        Update: {
          icerik_id?: number | null
          id?: number
          kullanici_id?: string | null
          olusturulma_zamani?: string
          spoiler_mi?: boolean | null
          yorum?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "yorumlar_icerik_id_fkey"
            columns: ["icerik_id"]
            isOneToOne: false
            referencedRelation: "icerikler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yorumlar_kullanici_id_fkey"
            columns: ["kullanici_id"]
            isOneToOne: false
            referencedRelation: "profiller"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_yorum_listesi: {
        Row: {
          icerik_adi: string | null
          id: number | null
          kullanici_adi: string | null
          olusturulma_zamani: string | null
          profil_fotografi: string | null
          spoiler_mi: boolean | null
          yorum: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_turler: {
        Args: never
        Returns: {
          tur: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
