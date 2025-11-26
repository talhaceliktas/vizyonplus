import SectionBox from "../ui/SectionBox";
import Toggle from "../ui/Toggle";
import InputGroup from "../ui/InputGroup";

export default function DuyuruTab({ settings, setSettings }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      <SectionBox title="Global Site Duyurusu">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-neutral-400">
            Site tepesinde şerit bildirim göster.
          </span>
          <Toggle
            checked={settings.duyuruAktif}
            onChange={() =>
              setSettings({ ...settings, duyuruAktif: !settings.duyuruAktif })
            }
          />
        </div>

        {settings.duyuruAktif && (
          <div className="space-y-4">
            <InputGroup
              label="Duyuru Metni"
              value={settings.duyuruMetni}
              onChange={(e) =>
                setSettings({ ...settings, duyuruMetni: e.target.value })
              }
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-200">
                Bildirim Tipi (Renk)
              </label>
              <div className="flex gap-3">
                {["bilgi", "uyari", "kritik"].map((tip) => (
                  <button
                    key={tip}
                    onClick={() =>
                      setSettings({ ...settings, duyuruTipi: tip })
                    }
                    className={`rounded-md border px-4 py-2 text-sm capitalize ${
                      settings.duyuruTipi === tip
                        ? "border-primary-500 bg-primary-500/20 text-white"
                        : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                    }`}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`mt-4 rounded-md p-3 text-center text-sm font-medium ${
                settings.duyuruTipi === "kritik"
                  ? "border border-red-500/30 bg-red-500/20 text-red-200"
                  : settings.duyuruTipi === "uyari"
                    ? "border border-amber-500/30 bg-amber-500/20 text-amber-200"
                    : "border border-blue-500/30 bg-blue-500/20 text-blue-200"
              }`}
            >
              ÖNİZLEME: {settings.duyuruMetni}
            </div>
          </div>
        )}
      </SectionBox>
    </div>
  );
}
