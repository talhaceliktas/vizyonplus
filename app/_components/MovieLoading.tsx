import { SyncLoader } from "react-spinners";
import { macondo } from "../_lib/fonts";

const MovieLoading = () => {
  return (
    <div className="mt-52 flex justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <p className={`text-4xl ${macondo.className} `}>Biletcim</p>
        <SyncLoader size={30} color="var(--color-secondary-2)" />
      </div>
    </div>
  );
};

export default MovieLoading;
