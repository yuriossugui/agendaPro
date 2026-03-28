import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const baseStyles =
    "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in-0 duration-200 z-50";

  const typeStyles = {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800",
  };

  const icons = {
    success: <Check className="w-5 h-5 text-green-600 shrink-0" />,
    error: <X className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Check className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  return (
    <div className={cn(baseStyles, typeStyles[type])}>
      {icons[type]}
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          onClick={() => onRemoveToast(toast.id)}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Hook para gerenciar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clear = () => {
    setToasts([]);
  };

  return { toasts, addToast, removeToast, clear };
}
