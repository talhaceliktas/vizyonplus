import { BiCommentDetail } from "react-icons/bi";
import YorumYap from "./YorumYap";
import { icerikYorumlariniGetir } from "../../../_lib/data-service-server";
import type { YorumTipi } from "../../../types";
import Yorum from "./Yorum";
import SpoilerYorum from "./SpoilerYorum";
import supabaseServerClient from "../../../_lib/supabase/server";

const Yorumlar = async ({ icerikId }: { icerikId: number }) => {
  const supabase = await supabaseServerClient();

  const user = (await supabase.auth.getUser()).data.user;

  const yorumlar = await icerikYorumlariniGetir(icerikId);

  return (
    <div className="bg-primary-800/20 relative">
      <div
        className={`border-primary-600 text-primary-100 relative w-full rounded-2xl border-2 p-4 pt-8 ${!user && "pointer-events-none blur-sm"}`}
      >
        <div className="absolute top-0 left-5 flex -translate-y-1/2 items-center gap-x-4 bg-[#f0f0f0] px-4 text-2xl dark:bg-[#151515]">
          <p className="text-4xl">
            <BiCommentDetail />
          </p>
          <h2>Yorumlar</h2>
        </div>
        <YorumYap icerikId={icerikId} />
        <div className="divide-primary-600/30 mt-8 flex flex-col gap-y-4 divide-y-2">
          {yorumlar.map((yorum: YorumTipi) =>
            yorum.spoiler_mi ? (
              <SpoilerYorum key={yorum.id} yorum={yorum} />
            ) : (
              <Yorum key={yorum.id} yorum={yorum} />
            ),
          )}
        </div>
      </div>
      {!user && (
        <h2 className="text-secondary-1 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
          Yorumları görmek için lütfen giriş yapın!
        </h2>
      )}
    </div>
  );
};

export default Yorumlar;
