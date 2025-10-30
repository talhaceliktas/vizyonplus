import { MoonLoader } from "react-spinners";

const MiniYukleniyor = ({ color }: { color: string }) => {
  return (
    <div className="flex h-full items-center justify-center">
      <MoonLoader size={30} color={color} />
    </div>
  );
};

export default MiniYukleniyor;
