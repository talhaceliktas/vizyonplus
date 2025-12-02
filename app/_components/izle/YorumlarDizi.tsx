import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineLogin } from "react-icons/hi";
import YorumYapDizi from "./YorumYapDizi"; // Dizi için Yorum Yap
import { bolumYorumlariniGetir } from "../../_lib/data-service-server";
import type { YorumTipi } from "../../types";
import Yorum from "../icerikler/dizi-film/Yorum";
import SpoilerYorum from "../icerikler/dizi-film/SpoilerYorum";
import supabaseServerClient from "../../_lib/supabase/server";
import {
  getCachedSettings,
  SiteSettings,
} from "../../_lib/supabase/get-settings";
import YorumYapama from "../icerikler/dizi-film/YorumYapama";
import Link from "next/link";

type YorumlarDiziProps = {
  bolumId: number;
  variant?: "default" | "compact";
};

const YorumlarDizi = async ({
  bolumId,
  variant = "default",
}: YorumlarDiziProps) => {
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Dizi bölümü için yorumları çekiyoruz
  const yorumlar = await bolumYorumlariniGetir(bolumId);
  const settings: SiteSettings = await getCachedSettings();

  const isCompact = variant === "compact";

  return (
    <div className={`flex flex-col ${isCompact ? "gap-3" : "gap-8"}`}>
      {/* --- YORUM YAPMA ALANI (Dizi Bölümü İçin) --- */}
      {!isCompact && (
        <div
          className={`${!user ? "pointer-events-none opacity-50 blur-[1px]" : ""}`}
        >
          {settings.yorumlar_kilitli ? (
            <YorumYapama />
          ) : (
            <YorumYapDizi bolumId={bolumId} />
          )}
        </div>
      )}

      {/* --- GİRİŞ UYARISI --- */}
      {!user && (
        <div
          className={`relative z-10 flex flex-col items-center justify-center rounded-xl border border-yellow-500/20 bg-black/80 text-center backdrop-blur-md ${
            isCompact ? "p-3 py-4" : "p-8"
          }`}
        >
          <HiOutlineLogin
            className={`${isCompact ? "mb-1 text-xl" : "mb-2 text-4xl"} text-yellow-500`}
          />
          <div className="flex flex-col items-center gap-1">
            <h3
              className={`${isCompact ? "text-xs" : "text-lg"} font-bold text-white`}
            >
              Sohbete Katıl
            </h3>
            {!isCompact && (
              <p className="mb-2 text-sm text-gray-400">
                Yorum yapmak için giriş yapmalısın.
              </p>
            )}
            <Link
              href="/login"
              className={`rounded-full bg-yellow-500 font-bold text-black transition hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 ${
                isCompact
                  ? "mt-1 px-3 py-1 text-[10px]"
                  : "mt-2 px-6 py-2 text-sm"
              }`}
            >
              Giriş Yap
            </Link>
          </div>
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
            className={`flex flex-col items-center justify-center text-gray-500 ${isCompact ? "py-8 opacity-60" : "py-20"}`}
          >
            <BiCommentDetail
              className={`mb-2 ${isCompact ? "text-3xl" : "text-5xl opacity-20"}`}
            />
            <p className={`font-medium ${isCompact ? "text-xs" : "text-base"}`}>
              Bu bölüme henüz yorum yok.
            </p>
            {!isCompact && (
              <p className="text-sm opacity-60">İlk yorumu sen yap!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YorumlarDizi;
