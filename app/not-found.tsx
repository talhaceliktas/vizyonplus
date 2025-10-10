"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <p>Bu sayfa bulunamadi!</p>
        <Link
          href="/"
          className="text-primary-400 hover:text-primary-500 w-full underline"
        >
          Ana Sayfaya don.
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
