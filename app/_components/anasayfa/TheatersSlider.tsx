"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Movie } from "../../types";
import Link from "next/link";

interface TheatersSliderProps {
  movies: Movie[];
}

const TheatersSlider = ({ movies }: TheatersSliderProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "ease-in",
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full p-10">
      <div className="mb-4 flex justify-between">
        <h3 className="text-2xl">Vizyondaki Filmler</h3>
        <Link
          className="hover:text-secondary-1 text-lg duration-300"
          href="/icerikler/filmler"
        >
          Tümünü Gör
        </Link>
      </div>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id} className="p-2">
            <div className="relative aspect-[619/919] w-full">
              <Image
                src={movie.big_image}
                alt={`${movie.title} filmi`}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-2 text-center text-sm sm:text-base md:text-lg">
              {movie.title}
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TheatersSlider;
