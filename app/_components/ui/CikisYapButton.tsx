"use client";

import Link from "next/link";
import supabaseBrowserClient from "../../_lib/supabase/client";
import type { ReactNode } from "react";

type CikisYap = {
  children: ReactNode;
  icon: ReactNode;
  className: string;
  href: string;
};

const CikisYapButton = ({ children, icon, className, href }: CikisYap) => {
  return (
    <Link
      className={className}
      href={href}
      onClick={() => supabaseBrowserClient.auth.signOut()}
    >
      <span>{children}</span>
      <span className="text-xl">{icon}</span>
    </Link>
  );
};

export default CikisYapButton;
