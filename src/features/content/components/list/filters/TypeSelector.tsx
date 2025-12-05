interface TypeSelectorProps {
  currentType: string | null;
  onTypeChange: (type: string | null) => void;
}

export default function TypeSelector({
  currentType,
  onTypeChange,
}: TypeSelectorProps) {
  const options = [
    { id: null, label: "Tümü" },
    { id: "film", label: "Filmler" },
    { id: "dizi", label: "Diziler" },
  ];

  return (
    <div className="flex flex-col items-center gap-1 self-start rounded-full bg-black/20 p-1 sm:flex-row">
      {options.map((item) => (
        <button
          key={item.label}
          onClick={() => onTypeChange(item.id)}
          className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
            currentType === item.id
              ? "bg-secondary-1 text-black shadow-lg shadow-yellow-500/10"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
