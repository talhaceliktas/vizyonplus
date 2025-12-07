export interface FeaturedContent {
  id: number | string;
  isim: string;
  aciklama: string;
  kategoriler: string;
  sure: string;
  poster: string;
  link: string;
  tur: "film" | "dizi" | string;
  slug: string;
}

export interface Content {
  id: number | string;
  isim: string;
  fotograf: string;
  tur: "film" | "dizi" | string;
  slug: string;
}
