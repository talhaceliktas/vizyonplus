import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Giriş Yap | Vizyon+",
  description: "Hesabınıza giriş yapın ve izlemeye devam edin.",
};

export default function GirisPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-movies-background.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/80 opacity-90"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
}
