interface SectionBoxProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionBox({ title, children }: SectionBoxProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      <div className="border-b border-neutral-800 bg-neutral-900/50 px-6 py-4">
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
