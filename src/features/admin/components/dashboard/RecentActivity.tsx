"use client";

import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

// Servis dosyasından tipi çekiyoruz (Böylece veri yapısı değişirse burası da haberder olur)
import { DashboardStats } from "@/features/admin/services/dashboardService";

interface RecentActivityProps {
  users: DashboardStats["sonKullanicilar"];
  comments: DashboardStats["sonYorumlar"];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RecentActivity({
  users,
  comments,
}: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* --- Son Üyeler Listesi --- */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
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
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-800">
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
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
                Yeni
              </span>
            </div>
          ))}

          {(!users || users.length === 0) && (
            <p className="text-sm text-neutral-500">Henüz üye yok.</p>
          )}
        </div>
      </div>

      {/* --- Son Yorumlar Listesi --- */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-white">Son Yorumlar</h3>
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-x-3 border-b border-neutral-800 pb-4 last:border-0 last:pb-0"
            >
              <div className="mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-800">
                {comment.profiller?.profil_fotografi ? (
                  <Image
                    src={comment.profiller.profil_fotografi}
                    alt=""
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="h-full w-full text-neutral-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <p className="truncate pr-2 text-sm font-medium text-white">
                    {comment.profiller?.isim || "Kullanıcı"}
                  </p>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {formatDate(comment.olusturulma_zamani)}
                  </span>
                </div>
                <p className="mb-1 truncate text-xs text-blue-400">
                  {comment.icerikler?.isim}
                </p>
                <p className="line-clamp-2 text-sm text-neutral-400">
                  {comment.yorum}
                </p>
              </div>
            </div>
          ))}

          {(!comments || comments.length === 0) && (
            <p className="text-sm text-neutral-500">Henüz yorum yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
