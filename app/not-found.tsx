"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <p className="text-primary-300">Bu sayfa bulunamadı!</p>
        <Link
          href="/"
          className="text-primary-50 hover:text-primary-500 w-full underline"
        >
          Ana Sayfaya dön.
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
