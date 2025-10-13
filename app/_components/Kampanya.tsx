import Image from "next/image";

const Kampanya = ({ kampanyaDetaylari }) => {
  const { fotograf } = kampanyaDetaylari;

  console.log(fotograf);

  return (
    <div className="flex overflow-hidden rounded-l-lg">
      <div className="relative aspect-video w-[70%]">
        <Image src={fotograf} alt="foto" fill />
      </div>
      <div
        className="bg-primary-800 relative flex-1 rounded-r-4xl border border-l-[4px] border-l-gray-500"
        style={{ borderLeftStyle: "dashed" }}
      >
        <div className="bg-primary-900 absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-b-[1px]"></div>
        <div className="bg-primary-900 absolute bottom-0 h-8 w-8 -translate-x-1/2 translate-y-1/2 rounded-full border-t-[1px]"></div>
      </div>
    </div>
  );
};

export default Kampanya;
