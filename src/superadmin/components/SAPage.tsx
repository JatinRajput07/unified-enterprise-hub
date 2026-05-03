import { ReactNode } from "react";

export function SAPage({
  title, subtitle, actions, children,
}: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-5 pb-3 flex items-end justify-between gap-3 border-b border-border bg-surface">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1 h-7 rounded-sm" style={{ background: "hsl(var(--sa-accent))" }} />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="p-5 flex-1">{children}</div>
    </div>
  );
}

export function SACard({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {title && (
        <div className="h-10 px-4 flex items-center justify-between border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider">{title}</h3>
          {action}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function SAKpi({ label, value, sub, trend, danger }: { label: string; value: string; sub?: string; trend?: string; danger?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="text-2xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${danger ? "text-destructive" : ""}`} style={!danger ? { color: "hsl(var(--sa-accent))" } : undefined}>{value}</div>
      {(sub || trend) && (
        <div className="text-2xs text-muted-foreground mt-1 flex items-center gap-1.5">
          {trend && <span className="text-success font-medium">{trend}</span>}
          {sub && <span>{sub}</span>}
        </div>
      )}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "success"|"warning"|"danger"|"info"|"neutral"|"purple"|"amber"|"teal" }) {
  const map: Record<string,string> = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    amber:   "bg-amber-100 text-amber-700 border-amber-200",
    danger:  "bg-rose-100 text-rose-700 border-rose-200",
    info:    "bg-indigo-100 text-indigo-700 border-indigo-200",
    purple:  "bg-violet-100 text-violet-700 border-violet-200",
    teal:    "bg-teal-100 text-teal-700 border-teal-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return <span className={`inline-flex items-center px-2 h-5 rounded-full text-[10px] font-medium border ${map[tone]}`}>{children}</span>;
}

export function SAButton({ children, onClick, variant = "primary", size = "md", type = "button" }: {
  children: ReactNode; onClick?: () => void; variant?: "primary"|"outline"|"ghost"|"danger"; size?: "sm"|"md"; type?: "button"|"submit";
}) {
  const sz = size === "sm" ? "h-7 px-2.5 text-xs" : "h-9 px-3.5 text-xs";
  const styles: Record<string,string> = {
    primary: "text-white hover:opacity-90",
    outline: "border border-border bg-surface hover:bg-surface-hover text-foreground",
    ghost:   "hover:bg-surface-hover text-foreground",
    danger:  "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition ${sz} ${styles[variant]}`}
      style={variant === "primary" ? { background: "hsl(var(--sa-accent))" } : undefined}>
      {children}
    </button>
  );
}
