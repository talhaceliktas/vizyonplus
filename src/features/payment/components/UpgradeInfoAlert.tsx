import { ArrowUpCircle } from "lucide-react";

interface Props {
  currentPlanName: string;
  newPlanName: string;
}

export default function UpgradeInfoAlert({
  currentPlanName,
  newPlanName,
}: Props) {
  return (
    <div className="mb-8 flex items-center gap-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-200">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
        <ArrowUpCircle size={20} />
      </div>
      <div>
        <h3 className="font-bold text-white">Paket Yükseltiliyor</h3>
        <p className="text-sm opacity-80">
          <span className="font-bold">{currentPlanName}</span> paketinden{" "}
          <span className="font-bold text-yellow-400">{newPlanName}</span>{" "}
          paketine geçiş yapıyorsunuz.
        </p>
      </div>
    </div>
  );
}
