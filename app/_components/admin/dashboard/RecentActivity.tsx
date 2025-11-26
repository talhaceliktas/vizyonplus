import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

// Tarih formatlama fonksiyonu
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RecentActivity({ users, comments }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Son Üyeler Listesi */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">
          Son Katılan Üyeler
        </h3>
        <div className="space-y-4">
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border-b border-neutral-800 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-x-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-800">
                  {user.profil_fotografi ? (
                    <Image
                      src={user.profil_fotografi}
                      alt={user.isim || "User"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-full w-full text-neutral-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.isim || "İsimsiz Kullanıcı"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(user.olusturulma_zamani)}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500">
                Yeni
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Son Yorumlar Listesi */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Son Yorumlar</h3>
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-x-3 border-b border-neutral-800 pb-4 last:border-0 last:pb-0"
            >
              <div className="mt-1 min-w-[32px]">
                {comment.profiller?.profil_fotografi ? (
                  <Image
                    src={comment.profiller.profil_fotografi}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-neutral-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-white">
                    {comment.profiller?.isim || "Kullanıcı"}
                  </p>
                  <span className="text-xs text-neutral-500">
                    {formatDate(comment.olusturulma_zamani)}
                  </span>
                </div>
                <p className="text-primary-400 mb-1 text-xs">
                  {comment.icerikler?.isim}
                </p>
                <p className="line-clamp-2 text-sm text-neutral-400">
                  {comment.yorum}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
