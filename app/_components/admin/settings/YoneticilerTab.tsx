import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import SectionBox from "../ui/SectionBox";
import InputGroup from "../ui/InputGroup";

export default function YoneticilerTab() {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminList, setAdminList] = useState([
    { id: 1, email: "admin@vizyonplus.com", role: "Süper Admin" },
    { id: 2, email: "editor@vizyonplus.com", role: "İçerik Editörü" },
  ]);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setAdminList([
      ...adminList,
      { id: Date.now(), email: newAdminEmail, role: "Moderatör" },
    ]);
    setNewAdminEmail("");
    alert("Davet gönderildi!");
  };

  const handleDeleteAdmin = (id: number) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      setAdminList(adminList.filter((admin) => admin.id !== id));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      <SectionBox title="Yeni Yönetici Davet Et">
        <form
          onSubmit={handleAddAdmin}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <div className="w-full flex-1">
            <InputGroup
              label="E-posta Adresi"
              placeholder="ornek@vizyonplus.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              desc="Davet linki bu adrese gönderilecektir."
            />
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 mt-4 w-full rounded-lg px-6 py-2.5 font-medium text-white transition-all sm:mt-0 sm:w-auto"
          >
            Davet Gönder
          </button>
        </form>
      </SectionBox>

      <SectionBox title="Mevcut Yöneticiler">
        {/* Tablo kodları buraya... */}
        <table className="w-full text-left text-sm text-neutral-400">
          {/* ... Tablo gövdesi ... */}
          <tbody>
            {adminList.map((admin) => (
              <tr key={admin.id} className="hover:bg-neutral-800/50">
                <td className="px-6 py-4">{admin.email}</td>
                <td className="px-6 py-4">{admin.role}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="text-red-400"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionBox>
    </div>
  );
}
