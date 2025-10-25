import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// let calistiMi = false;

export async function veritabaninaEkle() {
  const { data, error } = await supabase.from("icerikler").select();

  console.log(data);

  // if (calistiMi) return;
  // const url =
  //   "https://movie-database-api1.p.rapidapi.com/list_movies.json?limit=20&page=&quality=all&genre=all&minimum_rating=0&query_term=0&sort_by=date_added&order_by=desc&with_rt_ratings=false";
  // const options = {
  //   method: "GET",
  //   headers: {
  //     "x-rapidapi-key": "b8e9b19f11msh795b95a86cbdd11p1bec82jsn79e995ae5921",
  //     "x-rapidapi-host": "movie-database-api1.p.rapidapi.com",
  //   },
  // };
  // try {
  //   const response = await fetch(url, options);
  //   const result = await response.json();
  //   const movies = result.data.movies;
  //   const duzenlenmisFilmler = movies.map((movie) => {
  //     return {
  //       isim: movie.title,
  //       aciklama: "",
  //       yayinlanma_tarihi: `01-01-${movie.year}`,
  //       tur: "film",
  //       sure: movie.runtime,
  //       fotograf: movie.large_cover_image,
  //     };
  //   });
  //   console.log(duzenlenmisFilmler);
  //   let { data, error } = await supabase
  //     .from("icerikler")
  //     .insert(duzenlenmisFilmler);
  // } catch (error) {
  //   console.error(error);
  // }
  // calistiMi = true;
}

veritabaninaEkle();

export default supabase;
