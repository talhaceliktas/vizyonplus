"use client";

import Link from "next/link";
import supabaseBrowserClient from "../../_lib/supabase/client";

const CikisYapButton = ({ children, icon, className, href }) => {
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
