"use client";

import { useState } from "react";
import { updateSettings } from "../../../actions/settings-actions"; // Action importu
import {
  FaSave,
  FaPlayCircle,
  FaShieldAlt,
  FaBullhorn,
  FaUserPlus,
} from "react-icons/fa";

// Component importları
import TabButton from "../../../_components/admin/ui/TabButton";
import DuyuruTab from "../../../_components/admin/settings/DuyuruTab";
import PlayerTab from "../../../_components/admin/settings/PlayerTab";
import GuvenlikTab from "../../../_components/admin/settings/GuvenlikTab";
import YoneticilerTab from "../../../_components/admin/settings/YoneticilerTab";

export default function AyarlarClient({ initialData }: { initialData }) {
  const [activeTab, setActiveTab] = useState("duyuru");
  const [isLoading, setIsLoading] = useState(false);

  // Başlangıç değerlerini veritabanından gelen (initialData) ile dolduruyoruz
  // Eğer veritabanı boşsa varsayılan değerleri kullanır
  const [settings, setSettings] = useState({
    duyuruAktif: initialData?.duyuru_aktif ?? true,
    duyuruMetni: initialData?.duyuru_metni ?? "",
    duyuruTipi: initialData?.duyuru_tipi ?? "bilgi",
    playerWatermark: initialData?.player_watermark ?? true,
    introAtlaSuresi: initialData?.intro_atla_suresi ?? 85,
    otomatikOynat: initialData?.otomatik_oynat ?? true,
    bakimModu: initialData?.bakim_modu ?? false,
    yeniUyeAlimi: initialData?.yeni_uye_alimi ?? true,
    yorumlarKilitli: initialData?.yorumlar_kilitli ?? false,
  });

  const handleSave = async () => {
    setIsLoading(true);

    // Server Action'ı çağırıyoruz
    const result = await updateSettings(settings);

    setIsLoading(false);

    if (result.success) {
      alert("Sistem ayarları başarıyla kaydedildi!");
    } else {
      alert("Hata oluştu: " + result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Sistem Ayarları</h2>
          <p className="text-neutral-400">
            Platformun operasyonel ayarlarını yönetin.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary-600 hover:bg-primary-700 flex items-center gap-x-2 rounded-lg px-6 py-2.5 font-medium text-white transition-all disabled:opacity-50"
        >
          {isLoading ? <span className="animate-spin">⏳</span> : <FaSave />}
          <span>Kaydet</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <nav className="flex gap-x-8 overflow-x-auto" aria-label="Tabs">
          <TabButton
            id="duyuru"
            label="Duyuru & Bildirim"
            icon={<FaBullhorn />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="player"
            label="Oynatıcı (Player)"
            icon={<FaPlayCircle />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="guvenlik"
            label="Erişim & Güvenlik"
            icon={<FaShieldAlt />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="yoneticiler"
            label="Yöneticiler"
            icon={<FaUserPlus />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </nav>
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {activeTab === "duyuru" && (
            <DuyuruTab settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "player" && (
            <PlayerTab settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "guvenlik" && (
            <GuvenlikTab settings={settings} setSettings={setSettings} />
          )}
          {activeTab === "yoneticiler" && <YoneticilerTab />}
        </div>

        {/* Sidebar Info */}
        <div className="hidden lg:block">
          <div className="sticky top-6 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Admin İpuçları
            </h3>
            <p className="mb-4 text-sm text-neutral-400">
              Bu ayarlar veritabanında saklanır ve tüm kullanıcıları anında
              etkiler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
