import { getUserProfile } from "@users/services/userService";
import ProfileDetailsForm from "./ProfileDetailsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import AvatarUpload from "./AvatarUpload";
import supabaseServer from "@lib/supabase/server";

export default async function ProfileSettings() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const userProfile = await getUserProfile(user.id);

  const {
    user_metadata: { display_name },
  } = user;

  return (
    <div className="flex-1 space-y-10">
      {/* --- KART 1: PROFİL BİLGİLERİ --- */}
      {/* bg-primary-900: Açık modda açık gri, Koyu modda koyu gri olur */}
      {/* border-primary-800: Her iki modda da silik bir sınır çizgisi sağlar */}
      <div className="bg-primary-900 border-primary-800 rounded-2xl border p-6 shadow-xl transition-colors duration-300 md:p-10">
        <h2 className="border-primary-800 text-primary-50 mb-8 border-b pb-4 text-2xl font-bold">
          Kullanıcı Bilgilerim
        </h2>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex flex-col items-center gap-4">
            {/* Resim Çerçevesi: border-primary-800 */}
            {/* Hover: Senin tanımladığın secondary renk */}
            <div className="border-primary-800 hover:border-secondary-1/50 relative h-32 w-32 overflow-hidden rounded-full border-4 shadow-2xl transition-all md:h-40 md:w-40">
              <AvatarUpload
                user={user}
                displayName={display_name}
                currentSrc={userProfile?.profil_fotografi}
              />
            </div>
            {/* text-primary-500: Orta ton gri, her iki modda da okunur */}
            <p className="text-primary-500 text-xs">
              Değiştirmek için resme tıkla
            </p>
          </div>

          <div className="w-full flex-1">
            <ProfileDetailsForm user={user} profile={userProfile} />
          </div>
        </div>
      </div>

      {/* --- KART 2: GÜVENLİK --- */}
      <div className="bg-primary-900 border-primary-800 rounded-2xl border p-6 shadow-xl transition-colors duration-300 md:p-10">
        <h2 className="border-primary-800 text-primary-50 mb-8 border-b pb-4 text-2xl font-bold">
          Güvenlik ve Şifre
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
