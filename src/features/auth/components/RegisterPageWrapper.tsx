"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import RegisterSuccess from "./RegisterSuccess";
import { openSans } from "@public/fonts/fonts";

export default function RegisterPageWrapper() {
  const [kayitTamamlandi, setKayitTamamlandi] = useState(false);
  const [gonderilenEmail, setGonderilenEmail] = useState("");

  return (
    <div
      className={`relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950 ${
        openSans?.className || ""
      }`}
    >
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-movies-background.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/80 opacity-90"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        {kayitTamamlandi ? (
          <RegisterSuccess gonderilenEmail={gonderilenEmail} />
        ) : (
          <RegisterForm
            setKayitTamamlandi={setKayitTamamlandi}
            setGonderilenEmail={setGonderilenEmail}
          />
        )}
      </div>
    </div>
  );
}
