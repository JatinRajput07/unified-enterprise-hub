import { useMemo } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { useSalesStore, ALL_DEAL_STAGES } from "@/store/salesStore";
import { inr } from "@/lib/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Forecasts() {
  const deals = useSalesStore((s) => s.deals);

  const data = useMemo(() => {
    const months: Record<string, { label: string; commit: number; bestCase: number; pipeline: number }> = {};
    deals.forEach(d => {
      const m = d.expectedCloseDate.slice(0, 7);
      if (!months[m]) months[m] = { label: m, commit: 0, bestCase: 0, pipeline: 0 };
      const v = d.currency === "USD" ? d.value * 83 : d.value;
      const weighted = v * d.probability / 100;
      months[m].pipeline += v;
      months[m].bestCase += weighted;
      if (d.probability >= 70) months[m].commit += v;
    });
    return Object.values(months).sort((a, b) => a.label.localeCompare(b.label));
  }, [deals]);

  const totalPipeline = data.reduce((a, m) => a + m.pipeline, 0);
  const totalBest = data.reduce((a, m) => a + m.bestCase, 0);
  const totalCommit = data.reduce((a, m) => a + m.commit, 0);
  const target = 50000000;

  const stageData = ALL_DEAL_STAGES.map(s => ({
    stage: s,
    value: deals.filter(d => d.stage === s).reduce((a, d) => a + (d.currency === "USD" ? d.value * 83 : d.value), 0),
  }));

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Forecasts" subtitle="Predictive revenue · weighted pipeline" accentVar="--mod-sales" />
      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard label="Quarterly Target" value={inr(target)} sub="FY26 Q1" delta={0} accent="hsl(var(--mod-sales))" />
        <KpiCard label="Total Pipeline" value={inr(totalPipeline)} delta={12.4} accent="hsl(var(--info))" sub={`${deals.length} deals`} />
        <KpiCard label="Best Case" value={inr(totalBest)} delta={8.1} accent="hsl(var(--mod-pms))" sub="Probability-weighted" />
        <KpiCard label="Commit (≥70%)" value={inr(totalCommit)} delta={15.2} accent="hsl(var(--success))" sub={`${Math.round(totalCommit / target * 100)}% of target`} />
      </div>
      <div className="px-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-surface border border-border rounded-sm p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Forecast by Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="fc1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} /></linearGradient>
                <linearGradient id="fc2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--mod-sales))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--mod-sales))" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => inr(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 4, fontSize: 11 }} formatter={(v: number) => inr(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="pipeline" stroke="hsl(var(--mod-sales))" fill="url(#fc2)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="bestCase" stroke="hsl(var(--success))" fill="url(#fc1)" strokeWidth={2} />
              <Area type="monotone" dataKey="commit" stroke="hsl(var(--warning))" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface border border-border rounded-sm p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stageData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="stage" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => inr(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 4, fontSize: 11 }} formatter={(v: number) => inr(v)} />
              <Bar dataKey="value" fill="hsl(var(--mod-sales))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}