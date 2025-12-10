import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface FormInputProps {
  type: string;
  placeholder: string;
  label?: string;
  icon?: React.ElementType;
  registration: UseFormRegisterReturn;
  error?: string;
}

export const FormInput = ({
  type,
  placeholder,
  icon: Icon,
  registration,
  error,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      <div className="group relative">
        {Icon && (
          <div className="text-primary-400 /* Light: Gri */ dark:text-primary-500 /* Dark: Biraz daha açık gri */ group-focus-within:text-secondary-1 /* Focus: Vurgu rengi */ absolute top-0 left-0 flex h-full w-12 items-center justify-center transition-colors duration-300">
            <Icon className="text-lg" />
          </div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          className={`w-full rounded-xl border py-3.5 text-sm font-medium transition-all duration-200 outline-none ${Icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"} text-primary-200 placeholder:text-primary-400 border-primary-200 dark:bg-primary-900/40 dark:placeholder:text-primary-500 dark:border-primary-700/50 /* --- ETKİLEŞİMLER (Focus & Hover) --- */ focus:border-secondary-1 focus:ring-secondary-1/10 dark:focus:border-secondary-1 dark:focus:ring-secondary-1/20 bg-white focus:ring-4 ${
            error
              ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500/50 dark:text-red-400"
              : "hover:border-primary-300 dark:hover:border-primary-600"
          } `}
          {...registration}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-primary-400 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-300 absolute top-0 right-0 flex h-full w-12 cursor-pointer items-center justify-center transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && (
        <span className="/* Light modda koyu kırmızı */ /* Dark modda parlak kırmızı (okunabilirlik için) */ ml-1 animate-pulse text-xs font-bold text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
};
