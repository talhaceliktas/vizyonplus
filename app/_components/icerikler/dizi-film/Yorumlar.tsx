import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineLogin } from "react-icons/hi";
import YorumYap from "./YorumYap";
import { icerikYorumlariniGetir } from "../../../_lib/data-service-server";
import type { YorumTipi } from "../../../types";
import Yorum from "./Yorum";
import SpoilerYorum from "./SpoilerYorum";
import supabaseServerClient from "../../../_lib/supabase/server";
import {
  getCachedSettings,
  SiteSettings,
} from "../../../_lib/supabase/get-settings";
import YorumYapama from "./YorumYapama";
import Link from "next/link";

type YorumlarProps = {
  icerikId: number;
  variant?: "default" | "compact";
};

const Yorumlar = async ({ icerikId, variant = "default" }: YorumlarProps) => {
  const supabase = await supabaseServerClient();
  const user = (await supabase.auth.getUser()).data.user;
  const yorumlar = await icerikYorumlariniGetir(icerikId);
  const settings: SiteSettings = await getCachedSettings();

  const isCompact = variant === "compact";

  return (
    <div className={`flex flex-col ${isCompact ? "gap-4" : "gap-8"}`}>
      {/* --- YORUM YAPMA ALANI --- */}
      {/* Compact modda (Chat) input alanı sayfanın altında sabit olduğu için
          burada tekrar göstermiyoruz (Duplicate olmasın diye). 
          Sadece Default modda gösteriyoruz. */}
      {!isCompact && (
        <div
          className={`${!user ? "pointer-events-none opacity-50 blur-[1px]" : ""}`}
        >
          {settings.yorumlar_kilitli ? (
            <YorumYapama />
          ) : (
            <YorumYap icerikId={icerikId} />
          )}
        </div>
      )}

      {/* --- GİRİŞ UYARISI (User yoksa) --- */}
      {!user && (
        <div
          className={`relative z-10 flex flex-col items-center justify-center rounded-xl border border-yellow-500/20 bg-black/80 text-center backdrop-blur-md ${
            isCompact ? "p-4 text-xs" : "p-8"
          }`}
        >
          <HiOutlineLogin
            className={`${isCompact ? "text-2xl" : "text-4xl"} mb-2 text-yellow-500`}
          />
          <h3
            className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-white`}
          >
            Sohbete Katıl
          </h3>
          {!isCompact && (
            <p className="mb-4 text-sm text-gray-400">
              Yorum yapmak ve toplulukla etkileşime geçmek için giriş
              yapmalısın.
            </p>
          )}
          <Link
            href="/login"
            className={`mt-2 rounded-full bg-yellow-500 font-bold text-black transition hover:bg-yellow-400 ${
              isCompact ? "px-4 py-1.5 text-xs" : "px-6 py-2 text-sm"
            }`}
          >
            Giriş Yap
          </Link>
        </div>
      )}

      {/* --- YORUM LİSTESİ --- */}
      <div
        className={`flex flex-col ${isCompact ? "gap-2 pb-2" : "gap-6 pb-10"}`}
      >
        {yorumlar.length > 0 ? (
          yorumlar.map((yorum: YorumTipi) =>
            yorum.spoiler_mi ? (
              <SpoilerYorum key={yorum.id} yorum={yorum} variant={variant} />
            ) : (
              <Yorum key={yorum.id} yorum={yorum} variant={variant} />
            ),
          )
        ) : (
          <div
            className={`text-center text-gray-500 ${isCompact ? "py-10" : "py-20"}`}
          >
            <BiCommentDetail
              className={`mx-auto mb-2 opacity-20 ${isCompact ? "text-3xl" : "text-5xl"}`}
            />
            <p className={isCompact ? "text-xs" : "text-base"}>
              Henüz yorum yapılmamış. <br /> İlk yorumu sen yap!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Yorumlar;
