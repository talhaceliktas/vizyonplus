"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const KategoriSiralama = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (filtre: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filtre", filtre);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      name="Filtre"
      className="text-primary-50 ml-auto block"
      onChange={(e) => handleFilter(e.target.value)}
    >
      <option value="vizyonArtan" className="text-primary-800">
        Vizyon Tarihi (Artan)
      </option>
      <option value="vizyonAzalan" className="text-primary-800">
        Vizyon Tarihi (Azalan)
      </option>
      <option value="puanArtan" className="text-primary-800">
        Puana Gore (Artan)
      </option>
      <option value="puanAzalan" className="text-primary-800">
        Puana Gore (Azalan)
      </option>
      <option value="alfabetikAZ" className="text-primary-800">
        A-Z
      </option>
      <option value="alfabetikZA" className="text-primary-800">
        Z-A
      </option>
    </select>
  );
};

export default KategoriSiralama;
