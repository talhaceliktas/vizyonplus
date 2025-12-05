import { SyncLoader } from "react-spinners";
import vizyonPlusLogo from "@public/logo.png";
import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="mt-52 mb-80 flex justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <Image
          src={vizyonPlusLogo}
          alt="Vizyon Plus logosu"
          className="w-32 sm:w-44"
        />
        <SyncLoader size={30} color="var(--color-secondary-2)" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
