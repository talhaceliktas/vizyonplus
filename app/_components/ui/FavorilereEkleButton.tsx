"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  favoriIsaretliMi,
  favorilereEkle,
} from "../../_lib/data-service-client";
import { useEffect, useState } from "react";
import MiniYukleniyor from "./MiniYukleniyor";

const FavorilereEkleButton = ({ icerik_id }) => {
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

  async function favoriyeEkleTiklandi() {
    setIsLoading(true);
    await favorilereEkle(icerik_id);
    setIsaretliMi(await favoriIsaretliMi(icerik_id));
    setIsLoading(false);
  }

  return (
    <button
      className={`text-4xl ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={favoriyeEkleTiklandi}
      disabled={isLoading}
    >
      {isLoading ? (
        <MiniYukleniyor />
      ) : isaretliMi ? (
        <FaHeart fill="var(--color-secondary-1)" opacity={70} />
      ) : (
        <FaRegHeart fill="var(--color-secondary-3)" opacity={70} />
      )}
    </button>
  );
};

export default FavorilereEkleButton;
