import supabaseServerClient from "../../_lib/supabase/server";

const Ayarlar = async () => {
  const supabase = await supabaseServerClient();

  const user = await (await supabase.auth.getUser()).data.user;

  const {
    user_metadata: { display_name },
    email,
  } = user;

  return (
    <form className="flex flex-1 flex-col items-center justify-center gap-y-4 bg-red-500">
      <input type="text" className="bg-amber-500" defaultValue={display_name} />
      <input type="email" className="bg-amber-500" defaultValue={email} />
      <input type="password" className="bg-amber-500" />
      <input type="password" className="bg-amber-500" />
    </form>
  );
};

export default Ayarlar;
