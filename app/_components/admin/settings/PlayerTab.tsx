import SectionBox from "../ui/SectionBox";
import Toggle from "../ui/Toggle";
import InputGroup from "../ui/InputGroup";

export default function PlayerTab({ settings, setSettings }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      <SectionBox title="Video Deneyimi">
        <div className="flex items-center justify-between border-b border-neutral-800/50 py-2">
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

        <div className="flex items-center justify-between border-b border-neutral-800/50 py-2">
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

        <div className="pt-2">
          <InputGroup
            type="number"
            label="Intro Atlama Süresi (Saniye)"
            value={settings.introAtlaSuresi}
            desc="Kullanıcı 'Intro Atla' butonuna bastığında kaç saniye ileri atılacak?"
            onChange={(e) =>
              setSettings({
                ...settings,
                introAtlaSuresi: parseInt(e.target.value),
              })
            }
          />
        </div>
      </SectionBox>
    </div>
  );
}
