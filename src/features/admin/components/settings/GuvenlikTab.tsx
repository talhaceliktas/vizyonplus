"use client";

import { FaBroadcastTower } from "react-icons/fa";
import SectionBox from "../ui/SectionBox";
import Toggle from "../ui/Toggle";

interface SettingsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: any;
}

export default function GuvenlikTab({ settings, setSettings }: SettingsState) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      <SectionBox title="Erişim Kontrolü">
        {/* Bakım Modu */}
        <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 p-4 transition-colors">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-red-200">
              <FaBroadcastTower /> Bakım Modu
            </h4>
            <p className="text-xs text-red-200/70">
              Aktif edilirse adminler hariç kimse siteye giremez.
            </p>
          </div>
          <Toggle
            checked={settings.bakimModu}
            onChange={() =>
              setSettings({
                ...settings,
                bakimModu: !settings.bakimModu,
              })
            }
          />
        </div>

        {/* Yeni Üye Alımı */}
        <div className="flex items-center justify-between border-b border-neutral-800 py-4">
          <div>
            <h4 className="font-medium text-white">Yeni Üye Alımı</h4>
            <p className="text-xs text-neutral-500">
              Kapatılırsa &quot;Kayıt Ol&quot; butonları devre dışı kalır.
            </p>
          </div>
          <Toggle
            checked={settings.yeniUyeAlimi}
            onChange={() =>
              setSettings({
                ...settings,
                yeniUyeAlimi: !settings.yeniUyeAlimi,
              })
            }
          />
        </div>

        {/* Yorum Kilidi */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="font-medium text-white">Global Yorum Kilidi</h4>
            <p className="text-xs text-neutral-500">
              Spam saldırısı durumunda tüm yorumları anında kapatın.
            </p>
          </div>
          <Toggle
            checked={settings.yorumlarKilitli}
            onChange={() =>
              setSettings({
                ...settings,
                yorumlarKilitli: !settings.yorumlarKilitli,
              })
            }
          />
        </div>
      </SectionBox>
    </div>
  );
}
