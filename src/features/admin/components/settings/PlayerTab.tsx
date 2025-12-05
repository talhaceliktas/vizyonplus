"use client";

import SectionBox from "../ui/SectionBox";
import Toggle from "../ui/Toggle";
import InputGroup from "../ui/InputGroup";

interface SettingsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: any;
}

export default function PlayerTab({ settings, setSettings }: SettingsState) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      <SectionBox title="Video Deneyimi">
        {/* Watermark */}
        <div className="flex items-center justify-between border-b border-neutral-800/50 py-4">
          <div>
            <h4 className="font-medium text-white">Player Watermark (Logo)</h4>
            <p className="text-xs text-neutral-500">
              Videoların sağ üstünde Vizyon+ logosu şeffaf olarak görünsün.
            </p>
          </div>
          <Toggle
            checked={settings.playerWatermark}
            onChange={() =>
              setSettings({
                ...settings,
                playerWatermark: !settings.playerWatermark,
              })
            }
          />
        </div>

        {/* Autoplay */}
        <div className="flex items-center justify-between border-b border-neutral-800/50 py-4">
          <div>
            <h4 className="font-medium text-white">
              Otomatik Oynat (Autoplay)
            </h4>
            <p className="text-xs text-neutral-500">
              Bölüm bitince sonraki bölüme otomatik geç.
            </p>
          </div>
          <Toggle
            checked={settings.otomatikOynat}
            onChange={() =>
              setSettings({
                ...settings,
                otomatikOynat: !settings.otomatikOynat,
              })
            }
          />
        </div>

        {/* Intro Süresi */}
        <div className="pt-4">
          <InputGroup
            type="number"
            label="Intro Atlama Süresi (Saniye)"
            value={settings.introAtlaSuresi}
            desc="Kullanıcı 'Intro Atla' butonuna bastığında kaç saniye ileri atılacak?"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSettings({
                ...settings,
                introAtlaSuresi: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
      </SectionBox>
    </div>
  );
}
