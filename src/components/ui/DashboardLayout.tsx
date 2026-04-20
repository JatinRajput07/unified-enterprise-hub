import { ReactNode } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";

interface Kpi {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  accent?: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  accentVar: string;
  actions?: ReactNode;
  kpis: Kpi[];
  children: ReactNode;
}

export function DashboardLayout({ title, subtitle, accentVar, actions, kpis, children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title={title} subtitle={subtitle} accentVar={accentVar} actions={actions} />
      <FilterBar />
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {kpis.map((k) => (
          <KpiCard key={k.label} label={k.label} value={k.value} sub={k.sub} delta={k.delta} accent={k.accent ?? `hsl(var(${accentVar}))`} />
        ))}
      </div>
      <div className="p-3 pt-0 flex-1 flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-lg flex flex-col ${className}`}>
      <div className="h-9 px-3 flex items-center justify-between border-b border-border shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider">{title}</h3>
        {action}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export function ActivityFeed({ items }: { items: { who: string; text: string; when: string }[] }) {
  return (
    <div className="p-1 overflow-auto">
      {items.map((a, i) => (
        <div key={i} className="flex items-start gap-2 px-2 py-1.5 hover:bg-surface-hover rounded-md">
          <div className="w-5 h-5 rounded-md bg-muted text-muted-foreground flex items-center justify-center font-mono text-3xs font-bold mt-0.5">{a.who}</div>
          <div className="flex-1 min-w-0 text-xs leading-tight">
            <div>{a.text}</div>
            <div className="text-3xs text-muted-foreground font-mono mt-0.5">{a.when}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
