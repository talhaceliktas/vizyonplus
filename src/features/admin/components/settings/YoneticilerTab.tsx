"use client";

import { useState } from "react";
import { FaTrash, FaUserShield } from "react-icons/fa";
import toast from "react-hot-toast";

import SectionBox from "../ui/SectionBox";
import InputGroup from "../ui/InputGroup";

interface Admin {
  id: number;
  email: string;
  role: string;
}

export default function YoneticilerTab() {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminList, setAdminList] = useState<Admin[]>([
    { id: 1, email: "admin@vizyonplus.com", role: "Süper Admin" },
    { id: 2, email: "editor@vizyonplus.com", role: "İçerik Editörü" },
  ]);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    // Simülasyon: Listeye ekle
    setAdminList([
      ...adminList,
      { id: Date.now(), email: newAdminEmail, role: "Moderatör" },
    ]);

    setNewAdminEmail("");
    toast.success("Davet bağlantısı gönderildi!");
  };

  const handleDeleteAdmin = (id: number) => {
    if (confirm("Bu yöneticiyi silmek istediğinize emin misiniz?")) {
      setAdminList(adminList.filter((admin) => admin.id !== id));
      toast.success("Yönetici yetkileri alındı.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      {/* --- Davet Formu --- */}
      <SectionBox title="Yeni Yönetici Davet Et">
        <form
          onSubmit={handleAddAdmin}
          className="flex flex-col items-start gap-4 sm:flex-row sm:items-end"
        >
          <div className="w-full flex-1">
            <InputGroup
              label="E-posta Adresi"
              placeholder="ornek@vizyonplus.com"
              value={newAdminEmail}
              onChange={(e: any) => setNewAdminEmail(e.target.value)}
              desc="Davet linki bu adrese gönderilecektir."
            />
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 mb-0.5 w-full rounded-lg px-6 py-2.5 font-medium text-white transition-all hover:shadow-lg sm:w-auto"
          >
            Davet Gönder
          </button>
        </form>
      </SectionBox>

      {/* --- Yönetici Listesi --- */}
      <SectionBox title="Mevcut Yöneticiler">
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-800 text-xs text-neutral-300 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  E-posta
                </th>
                <th scope="col" className="px-6 py-3">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {adminList.map((admin) => (
                <tr
                  key={admin.id}
                  className="transition-colors hover:bg-neutral-800/50"
                >
                  <td className="flex items-center gap-2 px-6 py-4 font-medium text-white">
                    <FaUserShield className="text-primary-500" />
                    {admin.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-500/10 px-2 text-xs leading-5 font-semibold text-blue-400">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-neutral-500 transition-colors hover:text-red-500"
                      title="Sil"
                      type="button"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {adminList.length === 0 && (
            <div className="p-6 text-center text-neutral-500">
              Hiç yönetici bulunamadı.
            </div>
          )}
        </div>
      </SectionBox>
    </div>
  );
}
