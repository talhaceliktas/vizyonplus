"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const KategoriSiralama = () => {
  const [siralama, setSiralama] = useState("alfabetikAZ");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (siralama: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("siralama", siralama);
    router.push(`${pathname}?${params.toString()}`);
    setSiralama(params.get("siralama"));
  };

  const Secenek = ({ value, label }) => {
    return (
      <option value={value} className="text-primary-800">
        {label}
      </option>
    );
  };

  return (
    <select
      name="Filtre"
      className="text-primary-50 ml-auto block"
      onChange={(e) => handleFilter(e.target.value)}
      value={siralama}
    >
      <Secenek value="alfabetikAZ" label="Alfabetik (A - Z)" />
      <Secenek value="alfabetikZA" label="Alfabetik (Z - A)" />
      <Secenek value="fiyataGoreArtan" label="Fiyata Göre (Artan)" />
      <Secenek value="fiyataGoreAzalan" label="Fiyata Göre (Azalan)" />
      <Secenek value="puanArtan" label="Puana Gore (Artan)" />
      <Secenek value="puanAzalan" label="Puana Gore (Azalan)" />
    </select>
  );
};

export default KategoriSiralama;
