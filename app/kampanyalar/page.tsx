import Kampanya from "../_components/Kampanya";

const Page = () => {
  return (
    <div className="mt-40 w-full">
      <div className="mx-auto w-full max-w-[1360px]">
        <select name="" id="" className="ml-auto block">
          <option value="">Test</option>
          <option value="">Test</option>
        </select>
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-14 p-4 lg:grid-cols-2">
          <Kampanya
            kampanyaDetaylari={{ fotograf: "/kampanyalar/Kampanya1.jpeg" }}
          />
          <Kampanya
            kampanyaDetaylari={{ fotograf: "/kampanyalar/Kampanya2.webp" }}
          />
          <Kampanya
            kampanyaDetaylari={{ fotograf: "/kampanyalar/Kampanya3.webp" }}
          />
          <Kampanya
            kampanyaDetaylari={{ fotograf: "/kampanyalar/Kampanya4.webp" }}
          />
          <Kampanya
            kampanyaDetaylari={{ fotograf: "/kampanyalar/Kampanya5.webp" }}
          />
          <Kampanya
            kampanyaDetaylari={{ fotograf: "/kampanyalar/Kampanya1.jpeg" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
