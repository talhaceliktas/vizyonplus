"use client";

import Link from "next/link";
import supabaseBrowserClient from "../../_lib/supabase/client";
import toast from "react-hot-toast";

const CikisYapButton = ({ children, icon, className, href }) => {
  return (
    <Link
      className={className}
      href={href}
      onClick={() => {
        supabaseBrowserClient.auth.signOut();
        toast.success("Başarıyla çıkış yapıldı");
      }}
    >
      <span>{children}</span>
      <span className="">{icon}</span>
    </Link>
  );
};

export default CikisYapButton;
