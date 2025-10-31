import { BiCommentDetail } from "react-icons/bi";
import YorumYap from "./YorumYap";
import Yorum from "./Yorum";

const Yorumlar = () => {
  return (
    <div className="border-primary-600 relative w-full rounded-2xl border-2 p-4 pt-8">
      <div className="absolute top-0 left-5 flex -translate-y-1/2 items-center gap-x-4 bg-[#151515] px-4 text-2xl">
        <p className="text-4xl">
          <BiCommentDetail />
        </p>
        <h2>Yorumlar</h2>
      </div>
      <YorumYap />
      <div className="divide-primary-600/30 flex flex-col divide-y-2">
        <Yorum />
        <Yorum />
        <Yorum />
        <Yorum />
      </div>
    </div>
  );
};

export default Yorumlar;
