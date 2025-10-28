"use client";

import { useEffect, useState } from "react";
import { turleriGetir } from "../../_lib/data-service-client";
import { useSearchParams, useRouter } from "next/navigation";

const IcerikTurFiltre = () => {
  const [icerikTurleri, setIcerikTurleri] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
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
    }
  }, [searchParams]);

  const checkBoxTiklandi = (tur: string) => {
    const yeniTurler = turler.includes(tur)
      ? turler.filter((t) => t !== tur)
      : [...turler, tur];

    setTurler(yeniTurler);

    const query = yeniTurler.length ? `?tur=${yeniTurler.join(",")}` : "";
    router.push(`/icerikler/filmler/${query}`);
  };

  return (
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
  );
};

export default IcerikTurFiltre;
