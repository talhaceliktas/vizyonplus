CREATE TABLE public.abonelik_paketleri (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  paket_adi text NOT NULL,
  aciklama text,
  fiyat numeric NOT NULL,
  sure_gun integer NOT NULL DEFAULT 30,
  aktif_mi boolean DEFAULT true,
  ozellikler jsonb,
  olusturulma_zamani timestamp with time zone DEFAULT now(),
  CONSTRAINT abonelik_paketleri_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ayarlar (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  duyuru_aktif boolean DEFAULT false,
  duyuru_metni text,
  duyuru_tipi text DEFAULT 'bilgi'::text,
  bakim_modu boolean DEFAULT false,
  yeni_uye_alimi boolean DEFAULT true,
  yorumlar_kilitli boolean DEFAULT false,
  CONSTRAINT ayarlar_pkey PRIMARY KEY (id)
);
CREATE TABLE public.begeniler (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  olusturulma_zamani timestamp with time zone DEFAULT now(),
  guncellenme_zamani timestamp with time zone DEFAULT now(),
  kullanici_id uuid NOT NULL,
  icerik_id bigint NOT NULL,
  durum boolean NOT NULL,
  CONSTRAINT begeniler_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES auth.users(id),
  CONSTRAINT begeniler_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.bolum_yorumlari (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  kullanici_id uuid NOT NULL,
  bolum_id bigint NOT NULL,
  yorum text NOT NULL,
  spoiler_mi boolean DEFAULT false,
  olusturulma_zamani timestamp with time zone DEFAULT now(),
  CONSTRAINT bolum_yorumlari_pkey PRIMARY KEY (id),
  CONSTRAINT bolum_yorumlari_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES auth.users(id),
  CONSTRAINT bolum_yorumlari_bolum_id_fkey FOREIGN KEY (bolum_id) REFERENCES public.bolumler(id),
  CONSTRAINT bolum_yorumlari_kullanici_id_fkey1 FOREIGN KEY (kullanici_id) REFERENCES public.profiller(id)
);
CREATE TABLE public.bolumler (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  icerik_id bigint NOT NULL,
  sezon_numarasi integer NOT NULL,
  bolum_numarasi integer NOT NULL,
  baslik character varying NOT NULL,
  aciklama text NOT NULL,
  sure integer NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  yayin_tarihi timestamp with time zone,
  video_url text,
  CONSTRAINT bolumler_pkey PRIMARY KEY (id),
  CONSTRAINT bolumler_sezon_numarasi_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.dizi(icerik_id),
  CONSTRAINT bolumler_sezon_numarasi_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.dizi(sezon_numarasi),
  CONSTRAINT bolumler_sezon_numarasi_icerik_id_fkey FOREIGN KEY (sezon_numarasi) REFERENCES public.dizi(icerik_id),
  CONSTRAINT bolumler_sezon_numarasi_icerik_id_fkey FOREIGN KEY (sezon_numarasi) REFERENCES public.dizi(sezon_numarasi)
);
CREATE TABLE public.daha_sonra_izle (
  kullanici_id uuid NOT NULL DEFAULT auth.uid(),
  icerikler_id bigint NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT daha_sonra_izle_pkey PRIMARY KEY (kullanici_id, icerikler_id),
  CONSTRAINT daha_sonra_izle_icerikler_id_fkey FOREIGN KEY (icerikler_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.dizi (
  icerik_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  sezon_numarasi integer NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT dizi_pkey PRIMARY KEY (icerik_id, sezon_numarasi),
  CONSTRAINT dizi_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.favoriler (
  kullanici_id uuid NOT NULL DEFAULT auth.uid(),
  icerikler_id bigint NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT favoriler_pkey PRIMARY KEY (kullanici_id, icerikler_id),
  CONSTRAINT favoriler_icerikler_id_fkey FOREIGN KEY (icerikler_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.film_ucretleri (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  icerikler_id bigint NOT NULL,
  satin_alma_ucreti real NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  indirim_orani smallint,
  ogrenci_indirim_orani smallint,
  CONSTRAINT film_ucretleri_pkey PRIMARY KEY (id),
  CONSTRAINT film_ucretleri_icerikler_id_fkey FOREIGN KEY (icerikler_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.icerik_puanlari (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  kullanici_id uuid NOT NULL,
  icerik_id bigint NOT NULL,
  puan smallint NOT NULL CHECK (puan >= 1 AND puan <= 10),
  CONSTRAINT icerik_puanlari_pkey PRIMARY KEY (id),
  CONSTRAINT icerik_puanlari_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES auth.users(id),
  CONSTRAINT icerik_puanlari_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.icerikler (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  isim character varying NOT NULL,
  aciklama text,
  yayinlanma_tarihi date NOT NULL,
  tur text NOT NULL,
  sure integer NOT NULL,
  fotograf text NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  turler ARRAY,
  yonetmen text,
  yan_fotograf text,
  video_url text,
  CONSTRAINT icerikler_pkey PRIMARY KEY (id)
);
CREATE TABLE public.izleme_gecmisi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  kullanici_id uuid NOT NULL,
  film_id bigint,
  bolum_id bigint,
  kalinan_saniye double precision NOT NULL DEFAULT 0,
  toplam_saniye double precision NOT NULL DEFAULT 0,
  bitti_mi boolean DEFAULT false,
  CONSTRAINT izleme_gecmisi_pkey PRIMARY KEY (id),
  CONSTRAINT izleme_gecmisi_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.icerikler(id),
  CONSTRAINT izleme_gecmisi_bolum_id_fkey FOREIGN KEY (bolum_id) REFERENCES public.bolumler(id),
  CONSTRAINT izleme_gecmisi_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES auth.users(id)
);
CREATE TABLE public.kullanici_abonelikleri (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  kullanici_id uuid NOT NULL,
  paket_id bigint NOT NULL,
  baslangic_tarihi timestamp with time zone DEFAULT now(),
  bitis_tarihi timestamp with time zone NOT NULL,
  otomatik_yenileme boolean DEFAULT true,
  provider_abonelik_id text,
  CONSTRAINT kullanici_abonelikleri_pkey PRIMARY KEY (id),
  CONSTRAINT kullanici_abonelikleri_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.profiller(id),
  CONSTRAINT kullanici_abonelikleri_paket_id_fkey FOREIGN KEY (paket_id) REFERENCES public.abonelik_paketleri(id)
);
CREATE TABLE public.profiller (
  id uuid NOT NULL,
  profil_fotografi text,
  olusturulma_zamani timestamp without time zone DEFAULT now(),
  cinsiyet text,
  isim text,
  yasakli_mi boolean DEFAULT false,
  CONSTRAINT profiller_pkey PRIMARY KEY (id),
  CONSTRAINT profiller_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.tanitimlar (
  icerik_id bigint NOT NULL,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tanitimlar_pkey PRIMARY KEY (icerik_id),
  CONSTRAINT tanitimlar_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.icerikler(id)
);
CREATE TABLE public.tekil_satin_almalar (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  kullanici_id uuid NOT NULL,
  film_id bigint NOT NULL,
  fiyat numeric NOT NULL,
  durum text NOT NULL DEFAULT 'basarili'::text,
  CONSTRAINT tekil_satin_almalar_pkey PRIMARY KEY (id),
  CONSTRAINT tekil_satin_almalar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES auth.users(id)
);
CREATE TABLE public.yorumlar (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  kullanici_id uuid DEFAULT auth.uid(),
  icerik_id bigint,
  yorum text CHECK (length(yorum) > 3),
  spoiler_mi boolean,
  olusturulma_zamani timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT yorumlar_pkey PRIMARY KEY (id),
  CONSTRAINT yorumlar_icerik_id_fkey FOREIGN KEY (icerik_id) REFERENCES public.icerikler(id),
  CONSTRAINT yorumlar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.profiller(id)
);