"use client";

import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@shared/components/ui/ThemeSwitcher";
import Navbar from "@layout/Navbar";
import { Table } from "../../../types";

export default function NavbarWrapper({
  settings,
}: {
  settings: Table<"ayarlar">;
}) {
  const pathName = usePathname();

  return pathName.split("/")[1] === "admin" ||
    pathName.split("/")[1] === "izle" ? null : (
    <>
      <Navbar settings={settings} />
      <ThemeSwitcher />
    </>
  );
}
