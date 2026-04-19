import { Filter, Download, Bookmark, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/StatusPill";

interface ModuleHeaderProps {
  title: string;
  subtitle?: string;
  accentVar: string;
  actions?: React.ReactNode;
}

export function ModuleHeader({ title, subtitle, accentVar, actions }: ModuleHeaderProps) {
  return (
    <div className="px-3 pt-3 pb-2 flex items-end justify-between gap-3 border-b border-border">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-1 h-6 rounded-sm" style={{ background: `hsl(var(${accentVar}))` }} />
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-2xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {actions}
      </div>
    </div>
  );
}

const ACTIVE_FILTERS = [
  { label: "Date", value: "Q1 2025" },
  { label: "Status", value: "Active" },
  { label: "Owner", value: "Me" },
];

export function FilterBar() {
  return (
    <div className="h-9 px-3 flex items-center gap-2 border-b border-border bg-surface/50 text-xs">
      <button className="flex items-center gap-1.5 h-6 px-2 rounded-sm border border-border hover:bg-surface-hover">
        <Filter className="w-3 h-3" />
        <span>Filters</span>
      </button>
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
        {ACTIVE_FILTERS.map((f) => (
          <span key={f.label} className="flex items-center gap-1 h-5 px-1.5 rounded-sm bg-primary/10 text-primary text-2xs font-medium border border-primary/20 shrink-0">
            <span className="text-primary/70">{f.label}:</span>
            <span>{f.value}</span>
            <X className="w-2.5 h-2.5 cursor-pointer hover:text-foreground" />
          </span>
        ))}
        <button className="flex items-center gap-0.5 h-5 px-1.5 text-2xs text-muted-foreground hover:text-foreground shrink-0">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <button className="text-2xs text-muted-foreground hover:text-foreground">Clear all</button>
      <div className="h-4 w-px bg-border" />
      <button className="flex items-center gap-1 h-6 px-2 rounded-sm hover:bg-surface-hover text-muted-foreground hover:text-foreground">
        <Bookmark className="w-3 h-3" />
        <span>Save</span>
      </button>
      <button className="flex items-center gap-1 h-6 px-2 rounded-sm hover:bg-surface-hover text-muted-foreground hover:text-foreground">
        <Download className="w-3 h-3" />
        <span>Export</span>
      </button>
    </div>
  );
}
