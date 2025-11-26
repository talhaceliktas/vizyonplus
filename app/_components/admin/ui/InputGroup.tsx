interface InputGroupProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  desc?: string;
  type?: string;
  placeholder?: string;
}

export default function InputGroup({
  label,
  value,
  onChange,
  desc,
  type = "text",
  placeholder,
}: InputGroupProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-white placeholder-neutral-500 transition-all focus:ring-1 focus:outline-none"
      />
      {desc && <p className="mt-1.5 text-xs text-neutral-500">{desc}</p>}
    </div>
  );
}
