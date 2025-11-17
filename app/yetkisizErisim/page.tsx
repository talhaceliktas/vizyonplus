import Link from "next/link";

const Page = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-2">
      <h1 className="text-primary-50 text-2xl">Bu sayfaya erişiminiz yok!</h1>
      <Link
        className="text-secondary-1-2 hover:text-secondary-2 duration-300"
        href="/"
      >
        Anasayfa&apos;ya dön
      </Link>
    </div>
  );
};

export default Page;
