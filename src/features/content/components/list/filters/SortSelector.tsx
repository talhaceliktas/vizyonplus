import { FaSort } from "react-icons/fa6";

interface SortSelectorProps {
  currentSort: string | null;
  onSortChange: (sort: string) => void;
}

export default function SortSelector({
  currentSort,
  onSortChange,
}: SortSelectorProps) {
  return (
    <div className="relative self-start md:self-auto">
      <FaSort className="text-primary-400 absolute top-1/2 left-3 -translate-y-1/2" />
      <select
        value={currentSort || "yeni"}
        onChange={(e) => onSortChange(e.target.value)}
        className="focus:border-secondary-1 text-primary-100 h-10 cursor-pointer appearance-none rounded-full border border-white/10 bg-black/20 pr-8 pl-9 text-sm font-medium transition-colors hover:border-white/20 focus:outline-none"
      >
        <option value="ortalama_puan_azalan" className="bg-primary-900">
          Puana Göre Azalan
        </option>
        <option value="ortalama_puan_artan" className="bg-primary-900">
          Puana Göre Artan
        </option>
        <option value="yeni" className="bg-primary-900">
          En Yeni Eklenen
        </option>
        <option value="eski" className="bg-primary-900">
          En Eski Eklenen
        </option>
        <option value="a-z" className="bg-primary-900">
          İsim (A-Z)
        </option>
        <option value="z-a" className="bg-primary-900">
          İsim (Z-A)
        </option>
      </select>
    </div>
  );
}
