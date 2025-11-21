"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { ThemeSwitcher } from "../_lib/next-theme/ThemeSwitcher";

const NavbarThemeChecker = () => {
  const pathName = usePathname();

  return pathName.split("/")[1] === "admin" ? null : (
    <>
      <Navbar />
      <ThemeSwitcher />
    </>
  );
};

export default NavbarThemeChecker;
