"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Movie } from "../types";

interface TheatersSliderProps {
  movies: Movie[];
}

const TheatersSlider = ({ movies }: TheatersSliderProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
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
      <h3 className="mb-4 pl-2 text-2xl">Vizyondaki Filmler</h3>
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
