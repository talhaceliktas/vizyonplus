import { User } from "@supabase/supabase-js";

const ProfilAyarlari = ({ user }: { user: User }) => {
  const {
    user_metadata: { display_name },
    email,
  } = user;

  return (
    <div className="w-full max-w-lg text-lg md:text-2xl">
      <div className="grid grid-cols-[150px_1fr] items-center gap-x-6 gap-y-4">
        <label htmlFor="adSoyad" className="text-gray-300">
          Ad Soyad:
        </label>
        <input
          id="adSoyad"
          type="text"
          className="bg-primary-700 w-full rounded-md px-3 py-2 text-xl text-white outline-none disabled:opacity-60"
          defaultValue={display_name}
        />

        <label htmlFor="email" className="text-gray-300">
          Email:
        </label>
        <input
          id="email"
          type="email"
          className="bg-primary-700 w-full rounded-md px-3 py-2 text-xl text-white outline-none disabled:opacity-60"
          defaultValue={email}
          disabled
        />

        <label htmlFor="cinsiyet" className="text-gray-300">
          Cinsiyet:
        </label>
        <select
          id="cinsiyet"
          className="bg-primary-700 w-full rounded-md px-3 py-2 text-lg text-white outline-none"
        >
          <option>Belirtmemeyi tercih ediyorum</option>
          <option>Erkek</option>
          <option>Kadın</option>
        </select>
      </div>
      <button className="bg-secondary-1 hover:bg-secondary-1-2 mt-4 ml-auto block cursor-pointer rounded-md px-2 py-1 text-lg text-black duration-300">
        Kaydet
      </button>
    </div>
  );
};

export default ProfilAyarlari;
