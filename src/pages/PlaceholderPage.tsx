import { useLocation, Link } from "react-router-dom";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Panel, ActivityFeed } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { getModuleByPath } from "@/lib/modules";
import { PEOPLE, COMPANIES, inr, pick, daysFromNow, timeAgo } from "@/lib/mockData";
import { Plus, Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/**
 * Smart placeholder that auto-renders a functional, data-rich page for any
 * unhandled L2 menu item. KPIs + chart + table + activity, themed by module accent.
 */
export default function PlaceholderPage() {
  const location = useLocation();
  const mod = getModuleByPath(location.pathname);
  const sub = mod.submenu.find(s => s.path === location.pathname);
  const label = sub?.label ?? mod.name;
  const seed = label.length;
  const accent = `hsl(var(${mod.colorVar}))`;

  // Derive KPIs deterministically from page name
  const kpis = [
    { label: "Total", value: `${(seed * 47 + 128).toLocaleString("en-IN")}`, delta: 12.4 },
    { label: "Active", value: `${seed * 12 + 18}`, delta: 4.2 },
    { label: "This Week", value: `${seed * 3 + 7}`, delta: 8.1 },
    { label: "Pending", value: `${seed + 5}`, delta: -2.4 },
    { label: "Completed %", value: `${68 + (seed % 20)}%`, delta: 3.6 },
    { label: "Avg Value", value: inr((seed + 5) * 18000), delta: 5.7 },
    { label: "Trend", value: "↑ 14%", delta: 14 },
  ];

  // Auto chart data
  const chartData = Array.from({ length: 8 }).map((_, i) => ({
    label: ["W1","W2","W3","W4","W5","W6","W7","W8"][i],
    primary: 40 + Math.round(Math.sin(i + seed) * 25 + 30),
    secondary: 30 + Math.round(Math.cos(i + seed) * 20 + 25),
  }));

  const donutData = [
    { name: "Active", value: 45 + (seed % 20), fill: accent },
    { name: "Pending", value: 22 + (seed % 10), fill: "hsl(var(--warning))" },
    { name: "Completed", value: 28 + (seed % 15), fill: "hsl(var(--success))" },
    { name: "Other", value: 5 + (seed % 5), fill: "hsl(var(--muted-foreground))" },
  ];

  // Auto table rows
  const rows = Array.from({ length: 10 }).map((_, i) => ({
    id: `${mod.short}-${(1000 + seed * 17 + i).toString()}`,
    title: `${label} item ${i + 1}`,
    owner: pick(PEOPLE, i + seed),
    company: pick(COMPANIES, i + seed),
    value: (seed + i + 1) * 14500,
    date: daysFromNow(-(i * 3 + (seed % 7))),
    status: ["info","success","warning","neutral","danger"][((i + seed) % 5)] as any,
    statusLabel: ["Active","Completed","Pending","Draft","Blocked"][((i + seed) % 5)],
  }));

  const activity = Array.from({ length: 6 }).map((_, i) => {
    const p = pick(PEOPLE, i + seed);
    return {
      who: p.initials,
      text: `${p.name} ${["created","updated","commented on","approved","assigned"][i % 5]} ${label.toLowerCase()} #${1000 + i + seed}`,
      when: timeAgo((i + 1) * 23 + seed),
    };
  });

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title={label}
        subtitle={`${mod.name} · ${rows.length} of ${seed * 47 + 128} records`}
        accentVar={mod.colorVar}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3.5 h-3.5" /> Export</Button>
            <Button size="sm" className="h-7 text-xs gap-1" style={{ background: accent, color: "white" }}>
              <Plus className="w-3.5 h-3.5" /> New {label.split(" ")[0]}
            </Button>
          </>
        }
      />
      <FilterBar />

      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} accent={accent} />
        ))}
      </div>

      <div className="px-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">{label} Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
              <Area type="monotone" dataKey="primary" stroke={accent} strokeWidth={2} fill={`url(#grad-${seed})`} />
              <Area type="monotone" dataKey="secondary" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="3 3" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        <Panel title={`${label} List`} className="lg:col-span-2 min-h-[400px]" action={<span className="text-2xs text-muted-foreground font-mono">10 of {seed * 47}</span>}>
          <DataTable
            rowKey={(r) => r.id}
            rows={rows}
            columns={[
              { key: "id", label: "ID", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.id}</span> },
              { key: "title", label: "Title", render: (r) => <div className="font-medium truncate max-w-[200px]">{r.title}</div> },
              { key: "owner", label: "Owner", render: (r) => r.owner.name },
              { key: "company", label: "Company", render: (r) => <span className="text-muted-foreground">{r.company}</span> },
              { key: "value", label: "Value", align: "right", render: (r) => <span className="font-mono tabular-nums">{inr(r.value)}</span> },
              { key: "date", label: "Date", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.date}</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill variant={r.status}>{r.statusLabel}</StatusPill> },
            ]}
          />
        </Panel>

        <Panel title="Recent Activity" className="min-h-[400px]" action={<Link to="#" className="text-2xs text-primary hover:underline">View all</Link>}>
          <ActivityFeed items={activity} />
        </Panel>
      </div>
    </div>
  );
}
