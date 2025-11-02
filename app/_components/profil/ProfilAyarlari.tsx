import { User } from "@supabase/supabase-js";

const ProfilAyarlari = ({ user }: { user: User }) => {
  const {
    user_metadata: { display_name },
    email,
  } = user;

  return (
    <div className="w-full max-w-lg text-lg md:text-2xl">
      <div className="text-primary-50 grid grid-cols-[150px_1fr] items-center gap-x-6 gap-y-4">
        <label htmlFor="adSoyad">Ad Soyad:</label>
        <input
          id="adSoyad"
          type="text"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-xl outline-none disabled:opacity-60"
          defaultValue={display_name}
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-xl outline-none disabled:opacity-60"
          defaultValue={email}
          disabled
        />

        <label htmlFor="cinsiyet">Cinsiyet:</label>
        <select
          id="cinsiyet"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-lg outline-none"
        >
          <option>Belirtmemeyi tercih ediyorum</option>
          <option>Erkek</option>
          <option>Kadın</option>
        </select>
      </div>
      <button className="dark:bg-secondary-1 dark:hover:bg-secondary-2 hover:bg-secondary-1-2 bg-secondary-2 mt-4 ml-auto block cursor-pointer rounded-md px-2 py-1 text-lg text-black duration-300">
        Kaydet
      </button>
    </div>
  );
};

export default ProfilAyarlari;
