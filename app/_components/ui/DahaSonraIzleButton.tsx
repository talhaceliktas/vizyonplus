"use client";

import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import {
  dahaSonraIzleIsaretliMi,
  dahaSonraIzleEkle,
} from "../../_lib/data-service-client";
import { useEffect, useState } from "react";
import MiniYukleniyor from "./MiniYukleniyor";

const DahaSonraIzleButton = ({ icerik_id }: { icerik_id: string }) => {
  const [isaretliMi, setIsaretliMi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isaretliMiKontrol = async () => {
      setIsLoading(true);
      setIsaretliMi(await dahaSonraIzleIsaretliMi(icerik_id));
      setIsLoading(false);
    };

    isaretliMiKontrol();
  }, [icerik_id]);

  async function favoriyeEkleTiklandi(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);
    await dahaSonraIzleEkle(icerik_id);
    setIsaretliMi(await dahaSonraIzleIsaretliMi(icerik_id));
    setIsLoading(false);
  }

  return (
    <button
      className={`text-[1.95rem] ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={(e) => favoriyeEkleTiklandi(e)}
      disabled={isLoading}
    >
      {isLoading ? (
        <MiniYukleniyor color="var(--color-secondary-1)" />
      ) : isaretliMi ? (
        <FaBookmark
          fill="var(--color-secondary-1-2)"
          stroke="var(--color-secondary-3)"
          strokeWidth={15}
        />
      ) : (
        <FaRegBookmark
          fill="var(--color-secondary-1-2)"
          stroke="var(--color-secondary-3)"
          strokeWidth={15}
        />
      )}
    </button>
  );
};

export default DahaSonraIzleButton;
