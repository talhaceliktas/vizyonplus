interface TabButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeTab: string;
  onClick: (id: string) => void;
}

export default function TabButton({
  id,
  label,
  icon,
  activeTab,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`group flex min-w-max items-center gap-x-2 border-b-2 px-2 py-4 text-sm font-medium transition-colors ${
        activeTab === id
          ? "border-primary-500 text-primary-500"
          : "border-transparent text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
