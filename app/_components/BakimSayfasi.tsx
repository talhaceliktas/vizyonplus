import React from "react";
import { FaTools } from "react-icons/fa";

const BakimSayfasi = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800/20 blur-[120px]" />
      <div className="absolute top-0 -z-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] backdrop-blur-sm transition-transform duration-700 hover:scale-105">
          <div className="animate-[pulse_3s_ease-in-out_infinite]">
            <FaTools className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          </div>
        </div>

        <h1 className="mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text pb-4 text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          Sahne Arkasındayız
        </h1>

        <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          Vizyon+ deneyimini kusursuz hale getirmek için kısa bir mola verdik.
          <span className="mt-2 block text-base text-gray-500">
            Sistem güncellemeleri yapılıyor, birazdan yayındayız.
          </span>
        </p>

        <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-sm text-gray-500 backdrop-blur-md">
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
          </span>
          <span>Vizyon+ Development Team</span>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
        <div className="h-[100px] w-full bg-gradient-to-t from-red-900/5 to-transparent" />
      </div>
    </div>
  );
};

export default BakimSayfasi;
