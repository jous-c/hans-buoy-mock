import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

const TOAST_DURATION = 3000;

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const value = React.useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-100 flex flex-col items-center gap-2 p-(--spacing-16)">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} message={toast.message} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({ message }: { message: string }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-2 rounded-(--radius-10) border border-stroke bg-green-600 px-(--spacing-16) py-(--spacing-12) shadow-lg transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      )}
    >
      <CheckCircle2 className="size-5 shrink-0 text-(--color-state-success-dark)" />
      <span className="text-sm leading-5 text-foreground">{message}</span>
    </div>
  );
}

export { ToastProvider, useToast };
