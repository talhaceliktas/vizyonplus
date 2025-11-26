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
      icon: <FaFilm className="text-primary-500 h-6 w-6" />,
      bg: "bg-primary-500/10 border-primary-500/20",
    },
    {
      title: "Yorumlar",
      value: counts.comments,
      icon: <FaComments className="h-6 w-6 text-green-500" />,
      bg: "bg-green-500/10 border-green-500/20",
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
          className={`rounded-xl border p-6 transition-all hover:shadow-lg ${stat.bg} border-opacity-50 bg-opacity-50 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-400">
                {stat.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
