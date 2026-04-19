import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: number; // percent
  accent?: string; // css color or var
  sparkline?: number[];
}

export function KpiCard({ label, value, sub, delta, accent = "hsl(var(--primary))", sparkline }: KpiCardProps) {
  const dir = delta === undefined ? 0 : delta > 0 ? 1 : delta < 0 ? -1 : 0;
  const Icon = dir > 0 ? TrendingUp : dir < 0 ? TrendingDown : Minus;
  const deltaColor = dir > 0 ? "text-success" : dir < 0 ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="relative bg-surface border border-border rounded-sm h-[72px] px-3 py-2 flex flex-col justify-between overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <span className="text-2xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        {delta !== undefined && (
          <span className={cn("flex items-center gap-0.5 text-2xs font-mono font-medium", deltaColor)}>
            <Icon className="w-3 h-3" />
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xl font-mono font-bold leading-none truncate">{value}</div>
          {sub && <div className="text-2xs text-muted-foreground mt-0.5 truncate">{sub}</div>}
        </div>
        {sparkline && (
          <svg width="48" height="20" viewBox="0 0 48 20" className="shrink-0">
            <polyline
              fill="none"
              stroke={accent}
              strokeWidth="1.5"
              points={sparkline.map((v, i) => {
                const x = (i / (sparkline.length - 1)) * 48;
                const min = Math.min(...sparkline);
                const max = Math.max(...sparkline);
                const y = 18 - ((v - min) / (max - min || 1)) * 16;
                return `${x},${y}`;
              }).join(" ")}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
