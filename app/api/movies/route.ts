import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = await fetch("https://imdb-top-100-movies.p.rapidapi.com/", {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 });
  }

  const movies = await res.json();
  const topTenMovies = movies.slice(0, 10);

  return NextResponse.json(topTenMovies);
}
