import ProfileSidebar from "@/features/users/components/profile/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      <div className="flex min-h-screen w-full flex-col gap-x-10 gap-y-10 pt-40 lg:flex-row">
        <ProfileSidebar />

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
