import { useMemo } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { useSalesStore } from "@/store/salesStore";
import { PEOPLE, inr } from "@/lib/mockData";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Reports() {
  const leads = useSalesStore((s) => s.leads);
  const deals = useSalesStore((s) => s.deals);
  const sources = useSalesStore((s) => s.sources);

  const conversion = leads.length ? (leads.filter(l => l.status === "Won").length / leads.length * 100) : 0;
  const lost = leads.filter(l => l.status === "Lost").length;
  const totalRev = deals.filter(d => d.stage === "Won").reduce((a, d) => a + (d.currency === "USD" ? d.value * 83 : d.value), 0);
  const avgDeal = deals.length ? totalRev / Math.max(1, deals.filter(d => d.stage === "Won").length) : 0;

  const sourceData = useMemo(() => {
    const m: Record<string, number> = {};
    leads.forEach(l => { m[l.sourcePlatform] = (m[l.sourcePlatform] ?? 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const ownerData = useMemo(() => {
    const m: Record<string, { name: string; deals: number; revenue: number }> = {};
    deals.forEach(d => {
      const p = PEOPLE.find(x => x.id === d.ownerId);
      if (!p) return;
      if (!m[p.id]) m[p.id] = { name: p.name.split(" ")[0], deals: 0, revenue: 0 };
      m[p.id].deals++;
      m[p.id].revenue += (d.currency === "USD" ? d.value * 83 : d.value);
    });
    return Object.values(m).sort((a, b) => b.revenue - a.revenue);
  }, [deals]);

  const COLORS = ["hsl(var(--mod-sales))","hsl(var(--mod-finance))","hsl(var(--mod-pms))","hsl(var(--mod-portfolio))","hsl(var(--success))","hsl(var(--warning))","hsl(var(--info))","hsl(var(--destructive))"];

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Sales Reports" subtitle="Performance analytics across leads, deals & sources" accentVar="--mod-sales" />
      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard label="Total Revenue" value={inr(totalRev)} delta={18.2} accent="hsl(var(--success))" />
        <KpiCard label="Conversion Rate" value={`${conversion.toFixed(1)}%`} delta={2.4} accent="hsl(var(--mod-sales))" />
        <KpiCard label="Avg Deal Size" value={inr(avgDeal || 0)} delta={5.7} accent="hsl(var(--mod-pms))" />
        <KpiCard label="Lost Leads" value={String(lost)} delta={-12} accent="hsl(var(--destructive))" />
      </div>
      <div className="px-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-surface border border-border rounded-sm p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Revenue by Owner</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ownerData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => inr(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 4, fontSize: 11 }} formatter={(v: number) => inr(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--mod-sales))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface border border-border rounded-sm p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 4, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-3">
        <div className="bg-surface border border-border rounded-sm p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Source Account Performance</h3>
          <table className="w-full text-xs">
            <thead className="text-2xs uppercase text-muted-foreground tracking-wider">
              <tr><th className="text-left h-7">Source</th><th className="text-left h-7">Platform</th><th className="text-right h-7">Leads</th><th className="text-right h-7">Won</th><th className="text-right h-7">Conversion</th></tr>
            </thead>
            <tbody>
              {sources.map(s => {
                const l = leads.filter(x => x.sourceAccountId === s.id);
                const won = l.filter(x => x.status === "Won").length;
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="h-9 font-medium">{s.displayName}</td>
                    <td className="h-9 text-muted-foreground">{s.platform}</td>
                    <td className="h-9 text-right font-mono">{l.length}</td>
                    <td className="h-9 text-right font-mono">{won}</td>
                    <td className="h-9 text-right font-mono">{l.length ? `${(won / l.length * 100).toFixed(1)}%` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}