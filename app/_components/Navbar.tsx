import Link from "next/link";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = () => {
  return (
    <div className="bg-primary-900/30 fixed top-0 z-10 w-full">
      <div className="flex items-center justify-between p-4 md:justify-around">
        <Link
          href="/"
          className="bg-gradient-to-l from-[#9e8704] via-[#cbac05] to-[#FFD700] bg-clip-text text-4xl font-bold text-transparent"
        >
          Biletcim
        </Link>
        <div className="hidden items-center gap-x-5 font-semibold md:flex">
          <Link href="/filmler" className="hover:text-primary-200 duration-300">
            Filmler
          </Link>
          <Link
            href="/kampanyalar"
            className="hover:text-primary-200 duration-300"
          >
            Kampanyalar
          </Link>
          <input
            type="text"
            className="bg-primary-50 placeholder:text-primary-500 text-primary-900 w-[15rem] rounded-full p-1 pl-3 duration-300 focus:w-[20rem]"
            placeholder="Ara..."
          />
        </div>
        <Link href="/profil" className="cursor-pointer">
          <FaCircleUser className="text-3xl" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
