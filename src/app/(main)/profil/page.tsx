import { Suspense } from "react";
import ProfileSettings from "@/features/users/components/profile/ProfileSettings";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";

export const metadata = {
  title: "Profil Ayarları | Vizyon+",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileSettings />
    </Suspense>
  );
}
