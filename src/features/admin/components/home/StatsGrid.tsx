"use client";

import { FaUsers, FaFilm, FaComments, FaUserSlash } from "react-icons/fa";

interface StatsGridProps {
  counts: {
    users: number;
    content: number;
    comments: number;
    banned: number;
  };
}

export default function StatsGrid({ counts }: StatsGridProps) {
  const stats = [
    {
      title: "Toplam Kullanıcı",
      value: counts.users,
      icon: <FaUsers className="h-6 w-6 text-blue-500" />,
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Toplam İçerik",
      value: counts.content,
      icon: <FaFilm className="h-6 w-6 text-purple-500" />,
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Yorumlar",
      value: counts.comments,
      icon: <FaComments className="h-6 w-6 text-emerald-500" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Yasaklı Hesaplar",
      value: counts.banned,
      icon: <FaUserSlash className="h-6 w-6 text-red-500" />,
      bg: "bg-red-500/10 border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${stat.bg} border-opacity-50 bg-opacity-50 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-400">
                {stat.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 shadow-inner">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
