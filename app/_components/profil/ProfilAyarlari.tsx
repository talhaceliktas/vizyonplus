import { User } from "@supabase/supabase-js";

const ProfilAyarlari = ({ user }: { user: User }) => {
  const {
    user_metadata: { display_name },
    email,
  } = user;

  return (
    <div className="w-full max-w-lg text-base md:text-lg">
      <div className="text-primary-50 grid grid-cols-1 items-start gap-x-0 gap-y-2 md:grid-cols-[150px_1fr] md:items-center md:gap-x-6 md:gap-y-4">
        <label htmlFor="adSoyad">Ad Soyad:</label>
        <input
          id="adSoyad"
          type="text"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-base outline-none disabled:opacity-60 md:text-lg"
          defaultValue={display_name}
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-base outline-none disabled:opacity-60 md:text-lg"
          defaultValue={email}
          disabled
        />

        <label htmlFor="cinsiyet">Cinsiyet:</label>
        <select
          id="cinsiyet"
          className="dark:bg-primary-700 bg-primary-800 w-full rounded-md px-3 py-2 text-base outline-none md:text-lg"
        >
          <option>Belirtmemeyi tercih ediyorum</option>
          <option>Erkek</option>
          <option>Kadın</option>
        </select>
      </div>
      <button className="dark:bg-secondary-1 dark:hover:bg-secondary-2 hover:bg-secondary-1-2 bg-secondary-2 mt-6 block w-full cursor-pointer rounded-md px-4 py-2 text-base text-black duration-300 md:mt-4 md:ml-auto md:w-auto md:px-2 md:py-1 md:text-lg">
        Kaydet
      </button>
    </div>
  );
};

export default ProfilAyarlari;
