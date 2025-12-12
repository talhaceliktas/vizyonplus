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

  const hiddenPaths = ["/admin", "/izle", "/odeme"];

  if (!pathName) return null;

  const shouldHideNavbar = hiddenPaths.some((path) => pathName.startsWith(path));

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar settings={settings} />;
}