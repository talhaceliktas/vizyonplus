"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaSave,
  FaPlayCircle,
  FaShieldAlt,
  FaBullhorn,
  FaUserPlus,
} from "react-icons/fa";

import { Table } from "@/types";
import { updateSettings } from "../../actions/settings-actions";

// Path düzeltildi
import TabButton from "../ui/TabButton";
import DuyuruTab from "./DuyuruTab";
import PlayerTab from "./PlayerTab";
import GuvenlikTab from "./GuvenlikTab";
import YoneticilerTab from "./YoneticilerTab";

interface SettingsClientProps {
  // initialData null gelebilir, kontrolü sağlamalıyız
  initialData: Table<"ayarlar"> | null;
}

export default function SettingsClient({ initialData }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("duyuru");
  const [isLoading, setIsLoading] = useState(false);

  // EKSİK STATE'LER EKLENDİ (Player Ayarları)
  // Bu değerler veritabanında yoksa bile state içinde varsayılan olarak durmalı
  const [settings, setSettings] = useState({
    duyuruAktif: initialData?.duyuru_aktif ?? true,
    duyuruMetni: initialData?.duyuru_metni ?? "",
    duyuru_tipi: initialData?.duyuru_tipi ?? "bilgi", // Küçük harf hatasını önlemek için snake_case tutabiliriz veya aşağıda mapleyebiliriz. Burada tutarlılık için camelCase'e çeviriyorum:
    duyuruTipi: initialData?.duyuru_tipi ?? "bilgi",

    bakimModu: initialData?.bakim_modu ?? false,
    yeniUyeAlimi: initialData?.yeni_uye_alimi ?? true,
    yorumlarKilitli: initialData?.yorumlar_kilitli ?? false,

    // Player Ayarları (Veritabanında henüz kolon yoksa default değerler çalışır)
    playerWatermark: true,
    introAtlaSuresi: 85,
    otomatikOynat: true,
  });

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // DÜZELTME: Burada manuel 'dbFormat' dönüşümü YAPMIYORUZ.
      // Çünkü Server Action zaten camelCase bekliyor.
      // Direkt state'i gönderiyoruz.
      const result = await updateSettings(settings);

      if (result.success) {
        toast.success("Sistem ayarları başarıyla kaydedildi!");
      } else {
        toast.error("Hata: " + result.error);
      }
    } catch (error) {
      toast.error("Beklenmedik bir hata oluştu.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
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
          className="bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/20 flex items-center gap-x-2 rounded-lg px-6 py-2.5 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? <span className="animate-spin">⏳</span> : <FaSave />}
          <span>Kaydet</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <nav className="flex gap-x-2 overflow-x-auto pb-1" aria-label="Tabs">
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
          <div className="sticky top-6 rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Admin İpuçları
            </h3>
            <p className="mb-4 text-sm text-neutral-400">
              Bu ayarlar veritabanında saklanır ve tüm kullanıcıları anında
              etkiler. Önbellek (Cache) süresi dolana kadar değişiklikler son
              kullanıcıda görünmeyebilir.
            </p>
            <div className="rounded border border-yellow-500/20 bg-yellow-500/10 p-3">
              <p className="text-xs font-medium text-yellow-500">
                ⚠️ Bakım modunu açtığınızda sadece Adminler siteye erişebilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
