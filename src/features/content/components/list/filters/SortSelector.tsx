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
      <FaSort className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
      <select
        value={currentSort || "yeni"}
        onChange={(e) => onSortChange(e.target.value)}
        className="focus:border-secondary-1 h-10 cursor-pointer appearance-none rounded-full border border-white/10 bg-black/20 pr-8 pl-9 text-sm font-medium text-white transition-colors hover:border-white/20 focus:outline-none"
      >
        <option value="yeni" className="bg-primary-900">
          En Yeni Eklenen
        </option>
        <option value="eski" className="bg-primary-900">
          En Eski Eklenen
        </option>
        <option value="a-z" className="bg-primary-900">
          İsim (A-Z)
        </option>
      </select>
    </div>
  );
}
