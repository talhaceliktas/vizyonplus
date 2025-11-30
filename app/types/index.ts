declare module "@supabase/supabase-js" {
  interface User {
    display_name?: string;
  }
}

export interface Movie {
  big_image: string;
  description: string;
  genre: string[];
  id: string;
  image: string;
  imdb_link: string;
  imdbid: string;
  rank: number;
  rating: string;
  thumbnail: string;
  title: string;
  year: number;
}

export interface FilmUcretleri {
  indirim_orani: number;
  ogrenci_indirim_orani: number;
  satin_alma_ucreti: number;
}

export type IcerikTipi = {
  id: number;
  isim: string;
  aciklama: string;
  fotograf: string;
  yayinlanma_tarihi: string;
  tur: string;
  sure: number;
  yonetmen?: string;
  olusturulma_zamani?: string;
  turler: string[];
  yan_fotograf?: string;
  video_url?: string;
};

export type FilmDetay = IcerikTipi & {
  film_ucretleri: FilmUcretleri[];
};

export type DiziDetay = IcerikTipi & {
  dizi: {
    sezon_numarasi: number;
    bolumler: Bolumler[];
  }[];
};

export type DiziSezon = IcerikTipi & {
  dizi: {
    sezon_numarasi: number;
    bolumler: Bolumler[];
  }[];
};

export type Bolumler = {
  aciklama: string;
  baslik: string;
  bolum_numarasi: string;
  icerik_id: number;
  id: number;
  olusturulma_zamani: string;
  sezon_numarasi: number;
  sure: number;
  yayin_tarihi: string;
  video_url: string;
};

export type YorumTipi = {
  id: number;
  icerik_id: number;
  yorum: string;
  spoiler_mi: boolean;
  olusturulma_zamani: string;
  profiller: { profil_fotografi: string | null; isim: string };
};

export type TanitimSlideTipi = {
  id: number | string;
  isim: string;
  aciklama: string;
  kategoriler: string;
  sure: string;
  poster: string;
  link: string;
  tur: string;
};

export type GirisProps = {
  tanitimVerileri: TanitimSlideTipi[];
};

export type PlanOzelligi = {
  text: string;
  included: boolean;
};

export type AbonelikPlani = {
  id: number;
  paket_adi: string;
  fiyat: number;
  ozellikler: PlanOzelligi[];
  aktif_mi: boolean;
};
