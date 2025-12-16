import {
  FaHome,
  FaFilm,
  FaPlusCircle,
  FaComments,
  FaUsers,
  FaCog,
} from "react-icons/fa";

export const ADMIN_MENU_ITEMS = [
  {
    name: "Genel Bakış",
    href: "/admin",
    icon: FaHome,
  },
  // {
  //   name: "İçerik Listesi",
  //   href: "/admin/icerikler",
  //   icon: FaFilm,
  // },
  // {
  //   name: "İçerik Ekle",
  //   href: "/admin/icerikEkle",
  //   icon: FaPlusCircle,
  // },
  {
    name: "Yorum Yönetimi",
    href: "/admin/yorumlar",
    icon: FaComments,
  },
  {
    name: "Kullanıcılar",
    href: "/admin/kullanicilar",
    icon: FaUsers,
  },
  {
    name: "Ayarlar",
    href: "/admin/ayarlar",
    icon: FaCog,
  },
];
