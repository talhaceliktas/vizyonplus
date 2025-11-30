"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { ThemeSwitcher } from "../_lib/next-theme/ThemeSwitcher";

const NavbarThemeChecker = ({ settings }) => {
  const pathName = usePathname();

  return pathName.split("/")[1] === "admin" ||
    pathName.split("/")[1] === "izle" ? null : (
    <>
      <Navbar settings={settings} />
      <ThemeSwitcher />
    </>
  );
};

export default NavbarThemeChecker;
