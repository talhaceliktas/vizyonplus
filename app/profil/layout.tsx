import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="h-screen px-4 pt-48 pb-20">
      <div className="mx-auto flex h-full w-full max-w-[1360px]">
        {children}
      </div>
    </div>
  );
};

export default Layout;
