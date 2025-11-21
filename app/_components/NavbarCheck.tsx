"use client";

import { usePathname } from "next/navigation";
import NavbarAdmin from "./NavbarAdmin";
import Navbar from "./Navbar";

const NavbarCheck = () => {
  const pathName = usePathname();

  return pathName.split("/")[1] === "admin" ? <NavbarAdmin /> : <Navbar />;
};

export default NavbarCheck;
