"use client";

import { useEffect, useState } from "react";
import { turleriGetir } from "../../_lib/data-service-client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const IcerikTurFiltre = () => {
  const [icerikTurleri, setIcerikTurleri] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [turler, setTurler] = useState<string[]>([]);

  useEffect(() => {
    const icerikTurleriniGetir = async () => {
      setIcerikTurleri(await turleriGetir());
    };

    icerikTurleriniGetir();
  }, []);

  useEffect(() => {
    const turParam = searchParams.get("tur");
    if (turParam) {
      setTurler(turParam.split(","));
    } else {
      setTurler([]);
    }
  }, [searchParams]);

  const checkBoxTiklandi = (tur: string) => {
    const params = new URLSearchParams(searchParams);

    const yeniTurler = turler.includes(tur)
      ? turler.filter((t) => t !== tur)
      : [...turler, tur];

    setTurler(yeniTurler);

    if (yeniTurler.length) {
      params.set("tur", yeniTurler.join(","));
    } else {
      params.set("tur", "");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const filtreleriTemizle = () => {
    const params = new URLSearchParams(searchParams);

    params.set("tur", "");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="custom-scrollbar h-64 w-full overflow-y-auto">
        <table>
          <tbody>
            {icerikTurleri &&
              icerikTurleri.map((tur) => (
                <tr key={tur} className="flex gap-x-2">
                  <td className="flex items-center">
                    <input
                      id={`tur-liste-${tur}`}
                      type="checkbox"
                      checked={turler.includes(tur)}
                      onChange={() => checkBoxTiklandi(tur)}
                      className="text-secondary-3 accent-secondary-1 h-4 w-4 rounded border-white focus:ring-2 focus:outline-none"
                    />
                  </td>
                  <td>
                    <label htmlFor={`tur-liste-${tur}`}>{tur}</label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p
        className="hover:text-secondary-1 text-secondary-2 mt-6 cursor-pointer duration-300"
        onClick={filtreleriTemizle}
      >
        Filtreleri Temizle
      </p>
    </div>
  );
};

export default IcerikTurFiltre;
