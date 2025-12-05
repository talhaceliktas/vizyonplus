import Link from "next/link";
import { NAV_LINKS } from "./constants";

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
  mobile?: boolean;
}

export const NavLinks = ({ className, onClick, mobile }: NavLinksProps) => {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={`hover:text-primary-400 dark:hover:text-primary-200 duration-300 ${mobile ? "text-primary-50 text-2xl font-semibold" : "text-primary-200 dark:text-primary-50 font-semibold"}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
