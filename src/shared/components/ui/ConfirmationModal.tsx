import { forwardRef } from "react";
import { AlertTriangle, Info, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "success"; // Tasarım rengi için
  loading?: boolean;
}

const ConfirmationModal = forwardRef<HTMLDivElement, ConfirmationModalProps>(
  (
    {
      isOpen,
      onClose,
      onConfirm,
      title,
      message,
      confirmText = "Onayla",
      cancelText = "Vazgeç",
      variant = "danger",
      loading = false,
    },
    ref,
  ) => {
    if (!isOpen) return null;

    return (
      <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
        <div
          ref={ref}
          className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl duration-200"
        >
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-white/5 p-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                variant === "danger"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-green-500/10 text-green-500"
              }`}
            >
              {variant === "danger" ? (
                <AlertTriangle size={24} />
              ) : (
                <Info size={24} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm leading-relaxed text-gray-400">{message}</p>
          </div>

          {/* Footer (Butonlar) */}
          <div className="flex items-center justify-end gap-3 bg-white/5 p-4 px-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-lg px-6 py-2 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                variant === "danger"
                  ? "bg-red-600 shadow-red-500/20 hover:bg-red-500"
                  : "bg-green-600 shadow-green-500/20 hover:bg-green-500"
              }`}
            >
              {loading ? "İşleniyor..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

ConfirmationModal.displayName = "ConfirmationModal";

export default ConfirmationModal;
