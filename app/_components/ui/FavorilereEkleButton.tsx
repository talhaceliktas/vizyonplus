"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  favoriIsaretliMi,
  favorilereEkle,
} from "../../_lib/data-service-client";
import { useEffect, useState } from "react";
import MiniYukleniyor from "./MiniYukleniyor";

const FavorilereEkleButton = ({ icerik_id }: { icerik_id: number }) => {
  const [isaretliMi, setIsaretliMi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isaretliMiKontrol = async () => {
      setIsLoading(true);
      setIsaretliMi(await favoriIsaretliMi(icerik_id));
      setIsLoading(false);
    };

    isaretliMiKontrol();
  }, [icerik_id]);

  async function favoriyeEkleTiklandi(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);
    await favorilereEkle(icerik_id);
    setIsaretliMi(await favoriIsaretliMi(icerik_id));
    setIsLoading(false);
  }

  return (
    <button
      className={`text-4xl ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={(e) => favoriyeEkleTiklandi(e)}
      disabled={isLoading}
    >
      {isLoading ? (
        <MiniYukleniyor color="var(--color-secondary-1)" />
      ) : isaretliMi ? (
        <FaHeart
          fill="var(--color-secondary-1-2)"
          stroke="var(--color-secondary-3)"
          strokeWidth={15}
        />
      ) : (
        <FaRegHeart
          fill="var(--color-secondary-1-2)"
          stroke="var(--color-secondary-3)"
          strokeWidth={15}
        />
      )}
    </button>
  );
};

export default FavorilereEkleButton;
