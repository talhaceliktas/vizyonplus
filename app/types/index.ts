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

export interface FilmTipi {
  aciklama: string;
  fotograf: string;
  id: number;
  isim: string;
  olusturulma_zamani: string;
  sure: number;
  turler: string[];
  yonetmen: string;
  yayinlanma_tarihi: string;
}
