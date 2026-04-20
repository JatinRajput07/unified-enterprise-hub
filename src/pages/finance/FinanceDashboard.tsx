import { useMemo } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Panel, ActivityFeed } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { useFinanceStore, type InvoiceStatus } from "@/store/financeStore";
import { inr, daysFromNow } from "@/lib/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";

const variant: Record<InvoiceStatus, any> = { Draft: "neutral", Sent: "info", Paid: "success", Overdue: "danger", Cancelled: "neutral" };

export default function FinanceDashboard() {
  const { invoices, expenses, budgets } = useFinanceStore();

  const totals = useMemo(() => {
    const revenue = invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
    const expense = expenses.filter(e => e.status !== "Rejected").reduce((a, e) => a + e.amount, 0);
    const pending = invoices.filter(i => i.status === "Sent").reduce((a, i) => a + i.amount, 0);
    const overdue = invoices.filter(i => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);
    const allocated = budgets.reduce((a, b) => a + b.allocated, 0);
    const spent = budgets.reduce((a, b) => a + b.spent, 0);
    return { revenue, expense, pending, overdue, util: Math.round((spent / allocated) * 100), net: revenue - expense };
  }, [invoices, expenses, budgets]);

  const trend = Array.from({ length: 12 }).map((_, i) => ({
    month: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"][i],
    revenue: 800 + Math.round(Math.sin(i / 2) * 200 + Math.random() * 300),
    expenses: 600 + Math.round(Math.cos(i / 2) * 150 + Math.random() * 200),
  }));

  const breakdown = [
    { name: "Cloud", value: 1180000, fill: "hsl(var(--mod-finance))" },
    { name: "Travel", value: 650000, fill: "hsl(var(--mod-sales))" },
    { name: "Marketing", value: 1320000, fill: "hsl(var(--mod-portfolio))" },
    { name: "Tools", value: 420000, fill: "hsl(var(--mod-pms))" },
    { name: "Office", value: 290000, fill: "hsl(var(--mod-canteen))" },
  ];

  const recent = invoices.slice(0, 8);
  const activity = [
    { who: "TC", text: "Invoice INV-2405 paid by TechCorp India", when: "5m ago" },
    { who: "PM", text: "Priya Mehta submitted expense ₹8,200", when: "32m ago" },
    { who: "AK", text: "Anita Kapoor approved travel reimbursement", when: "1h ago" },
    { who: "ZM", text: "Invoice INV-2410 sent to Zomato", when: "3h ago" },
    { who: "NK", text: "Marketing budget exceeded by 10%", when: "5h ago" },
  ];

  const kpis = [
    { label: "Revenue MTD", value: inr(totals.revenue), delta: 14.2 },
    { label: "Expenses MTD", value: inr(totals.expense), delta: 7.8 },
    { label: "Net P&L", value: inr(totals.net), delta: 22.4 },
    { label: "Pending", value: inr(totals.pending), delta: -4.1 },
    { label: "Overdue", value: inr(totals.overdue), delta: 8.0 },
    { label: "Budget Used", value: `${totals.util}%`, delta: 3.2 },
    { label: "Invoices", value: String(invoices.length), delta: 0 },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Finance Dashboard" subtitle="Q1 2025 · INR" accentVar="--mod-finance" />
      <FilterBar />
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {kpis.map(k => <KpiCard key={k.label} {...k} accent="hsl(var(--mod-finance))" />)}
      </div>
      <div className="px-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Revenue vs Expenses (12 mo, ₹K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {breakdown.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} formatter={(v: any) => inr(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        <Panel title="Recent Invoices" className="lg:col-span-2 min-h-[300px]">
          <DataTable
            rowKey={(r) => r.id} rows={recent}
            columns={[
              { key: "number", label: "#", render: (r) => <span className="font-mono text-2xs">{r.number}</span> },
              { key: "client", label: "Client", render: (r) => <span className="font-medium">{r.client}</span> },
              { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-mono tabular-nums">{inr(r.amount)}</span> },
              { key: "dueDate", label: "Due", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.dueDate}</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill variant={variant[r.status]}>{r.status}</StatusPill> },
            ]}
          />
        </Panel>
        <Panel title="Activity" className="min-h-[300px]"><ActivityFeed items={activity} /></Panel>
      </div>
    </div>
  );
}
