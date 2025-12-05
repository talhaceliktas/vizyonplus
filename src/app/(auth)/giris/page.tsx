import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Giriş Yap | Vizyon+",
  description: "Hesabınıza giriş yapın ve izlemeye devam edin.",
};

export default function GirisPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="h-full w-full overflow-hidden rounded-none md:shadow-2xl">
        <LoginForm />
      </div>
    </div>
  );
}
