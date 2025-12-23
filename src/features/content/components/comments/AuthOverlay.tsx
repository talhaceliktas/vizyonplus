/**
 * Bu bileşen, yorum yapmaya çalışan ancak GİRİŞ YAPMAMIŞ kullanıcılara gösterilen uyarı kutusudur.
 * Kullanıcıyı giriş sayfasına (`/giris`) yönlendiren bir buton içerir.
 */

import Link from "next/link";
import { HiOutlineLogin } from "react-icons/hi";

export default function AuthOverlay() {
  return (
    <div className="relative z-10 mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-yellow-500/20 bg-black/80 p-8 text-center backdrop-blur-md">
      <HiOutlineLogin className="mb-2 text-4xl text-yellow-500" />
      <h3 className="text-lg font-bold text-white">Sohbete Katıl</h3>
      <p className="mb-4 text-sm text-gray-400">
        Yorum yapmak ve toplulukla etkileşime geçmek için giriş yapmalısın.
      </p>
      <Link
        href="/giris"
        className="mt-2 rounded-full bg-yellow-500 px-6 py-2 text-sm font-bold text-black transition hover:bg-yellow-400"
      >
        Giriş Yap
      </Link>
    </div>
  );
}
