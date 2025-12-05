import Link from "next/link";
import { FaDoorClosed } from "react-icons/fa";

export default function RegistrationClosed() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-950 p-4 text-center">
      <div className="mb-6 rounded-full bg-neutral-800 p-6">
        <FaDoorClosed className="h-16 w-16 text-neutral-500" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-white">Kayıtlar Kapalı</h1>
      <p className="mb-8 max-w-md text-neutral-400">
        Şu anda yeni üye alımını geçici olarak durdurduk. Lütfen daha sonra
        tekrar deneyin veya sosyal medya hesaplarımızı takip edin.
      </p>

      <Link
        href="/"
        className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
