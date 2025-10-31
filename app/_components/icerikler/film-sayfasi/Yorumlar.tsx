import { BiCommentDetail } from "react-icons/bi";
import YorumYap from "./YorumYap";
import { icerikYorumlariniGetir } from "../../../_lib/data-service-server";
import type { YorumTipi } from "../../../types";
import Yorum from "./Yorum";
import SpoilerYorum from "./SpoilerYorum";

const Yorumlar = async ({ icerikId }: { icerikId: number }) => {
  const yorumlar = await icerikYorumlariniGetir(icerikId);

  console.log(yorumlar);

  return (
    <div className="border-primary-600 relative w-full rounded-2xl border-2 p-4 pt-8">
      <div className="absolute top-0 left-5 flex -translate-y-1/2 items-center gap-x-4 bg-[#151515] px-4 text-2xl">
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
  );
};

export default Yorumlar;
