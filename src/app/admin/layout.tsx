import React from "react";
import AdminSidebar from "@admin/components/AdminSidebar";
import AdminNavbar from "@admin/components/AdminNavbar";

export const metadata = {
  title: "Admin Paneli | Vizyon+",
  description: "İçerik yönetim sistemi",
  robots: "noindex, nofollow",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-950">
      <AdminSidebar />

      <div className="ml-64 flex flex-1 flex-col transition-all duration-300">
        <AdminNavbar />

        <main className="scrollbar-thin scrollbar-thumb-neutral-800 flex-1 overflow-y-auto bg-neutral-950 p-8 text-neutral-200">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
