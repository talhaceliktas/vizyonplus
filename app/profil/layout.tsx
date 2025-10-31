import { ReactNode, Suspense } from "react";
import Yukleniyor from "../_components/icerikler/Yukleniyor";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="px-4 pt-48 pb-20">
      <div className="mx-auto flex h-full w-full max-w-[1360px]">
        <Suspense fallback={<Yukleniyor />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default Layout;
