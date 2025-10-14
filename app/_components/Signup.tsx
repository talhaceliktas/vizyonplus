import { openSans } from "../_lib/fonts";

const Signup = () => {
  return (
    <div
      className={`kutu text-primary-900 flex h-full w-full flex-col items-center gap-y-3 p-5 ${openSans.className}`}
    >
      <h3 className="text-3xl font-semibold">Giriş Yap</h3>
      <p className="text-gray-200">
        Hoşgeldiniz! Lütfen gerekli alanları doldurunuz.
      </p>
    </div>
  );
};

export default Signup;
