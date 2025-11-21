import NavbarAdmin from "../_components/NavbarAdmin";
import Sidebar from "../_components/admin/layout/Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-950">
      <Sidebar />

      <div className="ml-64 flex flex-1 flex-col transition-all duration-300">
        <NavbarAdmin />

        <main className="flex-1 overflow-y-auto bg-neutral-950 p-8 text-neutral-200">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
