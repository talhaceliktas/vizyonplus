interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`focus:ring-primary-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none ${
        checked ? "bg-green-500" : "bg-neutral-700"
      }`}
    >
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
      />
    </button>
  );
}
