import { redirect } from "next/navigation";
import ProfilYanMenu from "../_components/profil/ProfilYanMenu";

const Page = async () => {
  redirect("/profil/ayarlar");

  return (
    <div>
      <ProfilYanMenu routeHref="/profil" />
      <div></div>
    </div>
  );
};

export default Page;
