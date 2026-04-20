import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "md" | "lg" | "xl";
}

export function SlideOver({ open, onClose, title, subtitle, children, footer, width = "lg" }: SlideOverProps) {
  if (!open) return null;
  const w = width === "md" ? "max-w-md" : width === "xl" ? "max-w-3xl" : "max-w-xl";
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative bg-surface border-l border-border w-full shadow-xl flex flex-col animate-in slide-in-from-right duration-200", w)}>
        <div className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate">{title}</h2>
            {subtitle && <p className="text-2xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-surface-hover flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-border flex justify-end gap-2 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
