import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, FunnelChart, Funnel, LabelList, Cell,
} from "recharts";

const revenueData = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: 120 + Math.round(Math.sin(i / 2) * 40 + Math.random() * 60),
  forecast: 140 + Math.round(Math.sin(i / 2 + 1) * 30 + Math.random() * 40),
}));

const funnelData = [
  { name: "Leads", value: 1240, fill: "hsl(var(--mod-sales))" },
  { name: "Qualified", value: 720, fill: "hsl(var(--mod-finance))" },
  { name: "Proposal", value: 380, fill: "hsl(var(--mod-pms))" },
  { name: "Negotiation", value: 180, fill: "hsl(var(--mod-portfolio))" },
  { name: "Won", value: 92, fill: "hsl(var(--success))" },
];

const deals = [
  { id: "DL-2401", name: "TechCorp Enterprise License", company: "TechCorp Inc.", owner: "Rahul S.", value: 184000, stage: "Negotiation", prob: 75, close: "2025-04-30", status: "warning" as const },
  { id: "DL-2402", name: "Acme Cloud Migration", company: "Acme Industries", owner: "Priya S.", value: 92500, stage: "Proposal", prob: 60, close: "2025-05-12", status: "info" as const },
  { id: "DL-2403", name: "Globex CRM Renewal", company: "Globex Corp.", owner: "Neha K.", value: 56000, stage: "Won", prob: 100, close: "2025-04-08", status: "success" as const },
  { id: "DL-2404", name: "Initech Security Audit", company: "Initech LLC", owner: "Rahul S.", value: 38400, stage: "Qualified", prob: 40, close: "2025-06-01", status: "neutral" as const },
  { id: "DL-2405", name: "Umbrella Data Platform", company: "Umbrella Co.", owner: "Aarav M.", value: 240000, stage: "Negotiation", prob: 80, close: "2025-04-25", status: "warning" as const },
  { id: "DL-2406", name: "Stark Mobile Rollout", company: "Stark Industries", owner: "Priya S.", value: 128000, stage: "Proposal", prob: 55, close: "2025-05-28", status: "info" as const },
  { id: "DL-2407", name: "Wayne Infra Upgrade", company: "Wayne Enterprises", owner: "Neha K.", value: 412000, stage: "Negotiation", prob: 70, close: "2025-05-15", status: "warning" as const },
  { id: "DL-2408", name: "Cyberdyne ML Pilot", company: "Cyberdyne Systems", owner: "Rahul S.", value: 67000, stage: "Lost", prob: 0, close: "2025-04-02", status: "danger" as const },
];

const activity = [
  { who: "RS", what: "moved", target: "TechCorp Enterprise License", to: "Negotiation", when: "2m ago" },
  { who: "PS", what: "added a note on", target: "Acme Cloud Migration", when: "14m ago" },
  { who: "NK", what: "closed", target: "Globex CRM Renewal", to: "Won", when: "1h ago" },
  { who: "RS", what: "scheduled call with", target: "Initech LLC", when: "2h ago" },
  { who: "AM", what: "created lead", target: "Umbrella Co. - Q2 expansion", when: "3h ago" },
  { who: "PS", what: "uploaded proposal to", target: "Stark Mobile Rollout", when: "5h ago" },
  { who: "NK", what: "qualified", target: "Wayne Enterprises", when: "yesterday" },
];

const performers = [
  { name: "Rahul Singh", initials: "RS", value: 624000, deals: 8, pct: 100 },
  { name: "Priya Shah", initials: "PS", value: 480000, deals: 6, pct: 77 },
  { name: "Neha Kapoor", initials: "NK", value: 312000, deals: 5, pct: 50 },
  { name: "Aarav Mehta", initials: "AM", value: 240000, deals: 3, pct: 38 },
];

export default function SalesDashboard() {
  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Sales Dashboard"
        subtitle="Pipeline overview · 248 active deals · $2.4M MTD"
        accentVar="--mod-sales"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
            <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3.5 h-3.5" /> New Deal</Button>
          </>
        }
      />
      <FilterBar />

      {/* KPIs */}
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2">
        <KpiCard label="Total Leads" value="1,240" sub="vs 1,108 last mo" delta={11.9} accent="hsl(var(--mod-sales))" sparkline={[8,12,9,15,18,14,22,28]} />
        <KpiCard label="Active Deals" value="248" sub="42 closing this mo" delta={6.4} accent="hsl(var(--mod-finance))" sparkline={[20,22,19,24,23,28,26,30]} />
        <KpiCard label="Revenue MTD" value="$2.41M" sub="of $3.2M target" delta={18.2} accent="hsl(var(--success))" sparkline={[10,15,18,22,28,32,30,38]} />
        <KpiCard label="Win Rate" value="34.2%" sub="92 won / 269 closed" delta={-2.1} accent="hsl(var(--mod-portfolio))" sparkline={[40,38,36,34,33,35,34,34]} />
        <KpiCard label="Avg Deal" value="$48.2K" sub="trailing 90d" delta={4.8} accent="hsl(var(--mod-pms))" sparkline={[42,44,43,46,45,47,48,48]} />
        <KpiCard label="Open Tasks" value="86" sub="14 due today" delta={0} accent="hsl(var(--mod-staffing))" />
        <KpiCard label="Overdue" value="9" sub="across 6 owners" delta={-25} accent="hsl(var(--destructive))" />
        <KpiCard label="New This Wk" value="38" sub="+12 from last wk" delta={46.2} accent="hsl(var(--mod-frd))" sparkline={[5,8,6,10,12,15,14,18]} />
      </div>

      {/* Charts row */}
      <div className="px-3 grid grid-cols-1 lg:grid-cols-5 gap-2">
        <div className="lg:col-span-3 bg-surface border border-border rounded-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider">Revenue vs Forecast</h3>
              <p className="text-2xs text-muted-foreground">Trailing 12 months · USD thousands</p>
            </div>
            <div className="flex gap-1 text-2xs">
              {["MTD","QTD","YTD"].map((p, i) => (
                <button key={p} className={`px-2 h-5 rounded-sm font-mono ${i===2?"bg-primary text-primary-foreground":"text-muted-foreground hover:bg-surface-hover"}`}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--mod-finance))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--mod-finance))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 4, fontSize: 11 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area type="monotone" dataKey="forecast" stroke="hsl(var(--mod-finance))" strokeWidth={1.5} strokeDasharray="3 3" fill="url(#fcGrad)" />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-surface border border-border rounded-sm p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Pipeline Funnel</h3>
          <div className="space-y-1.5">
            {funnelData.map((f) => {
              const max = funnelData[0].value;
              const pct = (f.value / max) * 100;
              return (
                <div key={f.name}>
                  <div className="flex items-center justify-between text-2xs mb-0.5">
                    <span className="text-muted-foreground">{f.name}</span>
                    <span className="font-mono font-medium">{f.value.toLocaleString()}</span>
                  </div>
                  <div className="h-5 bg-surface-hover rounded-sm overflow-hidden relative">
                    <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, background: f.fill }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3 text-2xs">
            <div>
              <div className="text-muted-foreground uppercase">Conversion</div>
              <div className="font-mono text-base font-bold">7.4%</div>
            </div>
            <div>
              <div className="text-muted-foreground uppercase">Avg Cycle</div>
              <div className="font-mono text-base font-bold">42d</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals table + side widgets */}
      <div className="p-3 grid grid-cols-1 lg:grid-cols-5 gap-2 flex-1">
        <div className="lg:col-span-3 bg-surface border border-border rounded-sm flex flex-col min-h-[400px]">
          <div className="h-9 px-3 flex items-center justify-between border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Top Deals</h3>
            <div className="text-2xs text-muted-foreground font-mono">Showing 8 of 248</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-hover sticky top-0">
                <tr className="text-2xs uppercase text-muted-foreground">
                  {["ID","Deal","Owner","Value","Stage","Prob","Close"].map(h => (
                    <th key={h} className="text-left px-3 h-7 font-medium tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => (
                  <tr key={d.id} className="border-t border-border hover:bg-surface-hover group">
                    <td className="px-3 h-8 font-mono text-2xs text-muted-foreground">{d.id}</td>
                    <td className="px-3 h-8">
                      <div className="font-medium truncate max-w-[200px]">{d.name}</div>
                      <div className="text-3xs text-muted-foreground truncate">{d.company}</div>
                    </td>
                    <td className="px-3 h-8">{d.owner}</td>
                    <td className="px-3 h-8 font-mono font-medium text-right tabular-nums">${d.value.toLocaleString()}</td>
                    <td className="px-3 h-8"><StatusPill variant={d.status}>{d.stage}</StatusPill></td>
                    <td className="px-3 h-8">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1 bg-surface-hover rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${d.prob}%` }} />
                        </div>
                        <span className="font-mono text-2xs">{d.prob}%</span>
                      </div>
                    </td>
                    <td className="px-3 h-8 font-mono text-2xs text-muted-foreground">{d.close}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-rows-2 gap-2">
          {/* Top performers */}
          <div className="bg-surface border border-border rounded-sm flex flex-col">
            <div className="h-9 px-3 flex items-center justify-between border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider">Top Performers</h3>
              <button className="text-2xs text-primary hover:underline">View all</button>
            </div>
            <div className="p-2 space-y-1">
              {performers.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-surface-hover">
                  <span className="text-2xs font-mono text-muted-foreground w-3">{i + 1}</span>
                  <div className="w-6 h-6 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-2xs font-bold">{p.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="h-1 bg-surface-hover rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-primary" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold tabular-nums">${(p.value/1000).toFixed(0)}K</div>
                    <div className="text-3xs text-muted-foreground font-mono">{p.deals} deals</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-surface border border-border rounded-sm flex flex-col min-h-0">
            <div className="h-9 px-3 flex items-center justify-between border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider">Recent Activity</h3>
              <div className="flex gap-1 text-2xs">
                {["All","Updated","Created"].map((t, i) => (
                  <button key={t} className={`px-1.5 h-4 rounded-sm ${i===0?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-surface-hover"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-1">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2 px-2 py-1.5 hover:bg-surface-hover rounded-sm">
                  <div className="w-5 h-5 rounded-sm bg-muted text-muted-foreground flex items-center justify-center font-mono text-3xs font-bold mt-0.5">{a.who}</div>
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="leading-tight">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                      {a.to && <> <span className="text-muted-foreground">→</span> <StatusPill variant="info">{a.to}</StatusPill></>}
                    </div>
                    <div className="text-3xs text-muted-foreground font-mono mt-0.5">{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
