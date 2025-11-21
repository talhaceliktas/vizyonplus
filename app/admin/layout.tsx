import Sidebar from "../_components/admin/layout/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
