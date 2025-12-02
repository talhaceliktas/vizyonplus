import Link from "next/link";
import DahaSonraIzleButton from "../../ui/DahaSonraIzleButton";
import FavorilereEkleButton from "../../ui/FavorilereEkleButton";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa6";
import { User } from "@supabase/supabase-js";

const IcerikButonlari = ({ user, id }: { user: User | null; id: number }) => {
  return (
    <div className="flex justify-end gap-x-2">
      {user ? (
        <>
          <FavorilereEkleButton icerik_id={id} />
          <DahaSonraIzleButton icerik_id={id} />
        </>
      ) : (
        <>
          <Link href="/giris" className="text-4xl">
            <FaRegHeart
              fill="var(--color-secondary-1)"
              stroke="var(--color-secondary-3)"
              strokeWidth={15}
            />
          </Link>
          <Link href="/giris" className="text-4xl">
            <FaRegBookmark
              fill="var(--color-secondary-1)"
              stroke="var(--color-secondary-3)"
              strokeWidth={15}
            />
          </Link>
        </>
      )}
    </div>
  );
};

export default IcerikButonlari;
