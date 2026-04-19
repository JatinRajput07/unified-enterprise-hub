import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "info" | "neutral" | "purple";

const styles: Record<Variant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-primary/15 text-primary border-primary/30",
  neutral: "bg-muted text-muted-foreground border-border",
  purple: "bg-module-pms/15 text-module-pms border-module-pms/30",
};

export function StatusPill({ children, variant = "neutral", className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-1.5 h-[18px] rounded-sm text-2xs font-medium border", styles[variant], className)}>
      {children}
    </span>
  );
}
