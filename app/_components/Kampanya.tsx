import Image from "next/image";
import { diplomata } from "../_lib/fonts";

const Kampanya = ({
  kampanyaDetaylari,
}: {
  kampanyaDetaylari: { fotograf: string };
}) => {
  const { fotograf } = kampanyaDetaylari;

  return (
    <div className="flex overflow-hidden rounded-l-lg">
      <div className="relative aspect-video w-[70%]">
        <Image src={fotograf} alt="foto" fill />
      </div>
      <div
        className="bg-primary-800 relative flex-1 border border-l-[4px] border-l-gray-500"
        style={{ borderLeftStyle: "dashed" }}
      >
        <div className="bg-primary-900 absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-b-[1px]"></div>
        <div className="bg-primary-900 absolute bottom-0 h-8 w-8 -translate-x-1/2 translate-y-1/2 rounded-full border-t-[1px]"></div>
        <div className="bg-primary-900 absolute right-0 h-10 w-10 translate-x-1/2 -translate-y-1/2 rounded-full border-l-[2px]"></div>
        <div className="bg-primary-900 absolute right-0 bottom-0 h-10 w-10 translate-x-1/2 translate-y-1/2 rounded-full border-l-[2px]"></div>
        <div className={`p-4 text-center text-2xl ${diplomata.className}`}>
          BILETCIM
        </div>
      </div>
    </div>
  );
};

export default Kampanya;
