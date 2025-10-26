import supabaseServerClient from "../_lib/supabase/server";

const Page = async () => {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <div>Profil {user?.user_metadata.display_name}</div>;
};

export default Page;
