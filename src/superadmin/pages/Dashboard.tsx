import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { AlertTriangle, ArrowUpRight, Bell, ChevronRight } from "lucide-react";
import { SAPage, SACard, SAKpi, Pill, SAButton } from "../components/SAPage";
import { useSuperAdminStore, fmtINR, planLabel, ALL_MODULES } from "@/store/superAdminStore";

const mrrSeries = [
  { m: "May", mrr: 320000, new: 22000, churn: -5000 },
  { m: "Jun", mrr: 345000, new: 28000, churn: -3000 },
  { m: "Jul", mrr: 362000, new: 24000, churn: -7000 },
  { m: "Aug", mrr: 388000, new: 32000, churn: -6000 },
  { m: "Sep", mrr: 410000, new: 30000, churn: -8000 },
  { m: "Oct", mrr: 422000, new: 18000, churn: -6000 },
  { m: "Nov", mrr: 438000, new: 22000, churn: -6000 },
  { m: "Dec", mrr: 446000, new: 14000, churn: -6000 },
  { m: "Jan", mrr: 458000, new: 18000, churn: -6000 },
  { m: "Feb", mrr: 466000, new: 14000, churn: -6000 },
  { m: "Mar", mrr: 472000, new: 12000, churn: -6000 },
  { m: "Apr", mrr: 482000, new: 16000, churn: -6000 },
];

const PLAN_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#94A3B8"];

export default function SADashboard() {
  const tenants = useSuperAdminStore(s => s.tenants);
  const activity = useSuperAdminStore(s => s.activity);
  const demo = useSuperAdminStore(s => s.demoRequests);

  const active = tenants.filter(t => t.status === "active");
  const mrr = active.reduce((s, t) => s + t.mrr, 0);
  const failed = tenants.filter(t => t.status === "payment_failed");
  const trials = tenants.filter(t => t.status === "trial");
  const newDemo = demo.filter(d => d.status === "new").length;

  const planAgg = ["starter","growth","pro","enterprise","trial","custom"].map((k, i) => ({
    name: planLabel(k as any),
    value: tenants.filter(t => t.plan === k).length,
    fill: PLAN_COLORS[i % PLAN_COLORS.length],
  })).filter(p => p.value > 0);

  const moduleAgg = ALL_MODULES.map(m => ({
    name: m.name,
    count: tenants.filter(t => t.modules.includes(m.key)).length,
  })).sort((a,b) => b.count - a.count).slice(0, 6);

  const top = [...active].sort((a,b) => b.mrr - a.mrr).slice(0, 5);

  return (
    <SAPage
      title="Command Center"
      subtitle="Live snapshot of tenants, revenue & operations"
      actions={<SAButton variant="outline" size="sm"><Bell className="w-3.5 h-3.5" /> Mark all read</SAButton>}
    >
      {/* Alert banner */}
      <div className="mb-4 space-y-2">
        {failed.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-200">
            <div className="flex items-center gap-2 text-sm text-rose-700">
              <AlertTriangle className="w-4 h-4" />
              <span><strong>{failed.length}</strong> tenants with failed payments — action required</span>
            </div>
            <Link to="/super-admin/billing" className="text-xs text-rose-700 font-medium hover:underline flex items-center gap-1">Review <ChevronRight className="w-3 h-3" /></Link>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4" /> Wipro plan expires in 3 days — no renewal yet
          </div>
          <Link to="/super-admin/tenants/t3" className="text-xs text-amber-800 font-medium hover:underline">Contact →</Link>
        </div>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-3">
        <SAKpi label="Total Tenants" value={String(tenants.length)} sub="across all plans" trend="↑ 3 this month" />
        <SAKpi label="Active Tenants" value={String(active.length)} sub={`${((active.length/tenants.length)*100).toFixed(1)}% active`} />
        <SAKpi label="MRR" value={fmtINR(mrr)} trend="↑ 8.2%" sub="vs last month" />
        <SAKpi label="ARR (Run Rate)" value={fmtINR(mrr * 12)} trend="↑ 8.2%" />
        <SAKpi label="Pending Payments" value={fmtINR(124000)} sub={`${failed.length} tenants`} danger />
        <SAKpi label="Demo Requests" value={String(newDemo)} sub="new today" trend="↑ 2 new" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <SAKpi label="Free Trials" value={String(trials.length)} sub="active" />
        <SAKpi label="Plans Expiring (30d)" value="4" sub="needs reminder" />
        <SAKpi label="Custom Deals Active" value="8" />
        <SAKpi label="Avg Revenue / Tenant" value={fmtINR(Math.round(mrr / Math.max(active.length,1)))} sub="per month" />
        <SAKpi label="Churn This Month" value="1" sub="tenant" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 mb-5">
        <SACard title="MRR Trend (12 months)" className="lg:col-span-4">
          <div className="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrrSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => fmtINR(Math.abs(v))} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="mrr" stroke="#6366F1" strokeWidth={2} dot={false} name="MRR" />
                <Line type="monotone" dataKey="new" stroke="#10B981" strokeWidth={1.5} dot={false} name="New MRR" />
                <Line type="monotone" dataKey="churn" stroke="#EF4444" strokeWidth={1.5} dot={false} name="Churned" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SACard>
        <SACard title="Tenants by Plan" className="lg:col-span-3">
          <div className="h-64 p-3 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planAgg} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {planAgg.map((p, i) => <Cell key={i} fill={p.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold">{tenants.length}</div>
              <div className="text-2xs text-muted-foreground">tenants</div>
            </div>
          </div>
          <div className="px-4 pb-3 grid grid-cols-2 gap-1 text-2xs">
            {planAgg.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />{p.name}: <strong>{p.value}</strong></div>
            ))}
          </div>
        </SACard>
        <SACard title="Module Adoption" className="lg:col-span-3">
          <div className="p-3 space-y-2">
            {moduleAgg.map(m => {
              const pct = (m.count / tenants.length) * 100;
              return (
                <div key={m.name}>
                  <div className="flex justify-between text-2xs mb-0.5"><span>{m.name}</span><span className="font-mono text-muted-foreground">{m.count} ({pct.toFixed(0)}%)</span></div>
                  <div className="h-2 rounded-sm bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${pct}%`, background: "hsl(var(--sa-accent))" }} /></div>
                </div>
              );
            })}
          </div>
        </SACard>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <SACard title="Action Required">
          <div className="p-3 space-y-3 text-xs">
            <div>
              <div className="text-2xs uppercase tracking-wider text-rose-600 font-semibold mb-1.5">🔴 Critical</div>
              {failed.map(t => (
                <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span>{t.name} — Payment failed ({fmtINR(t.mrr)})</span>
                  <div className="flex gap-1"><SAButton size="sm" variant="outline">Contact</SAButton><SAButton size="sm">Retry</SAButton></div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-2xs uppercase tracking-wider text-amber-600 font-semibold mb-1.5">🟡 Attention</div>
              <div className="py-1.5 border-b border-border flex justify-between"><span>Wipro — Plan expires Apr 30</span><SAButton size="sm" variant="outline">Reminder</SAButton></div>
              <div className="py-1.5 border-b border-border flex justify-between"><span>Razorpay — Trial ends tomorrow</span><SAButton size="sm">Convert</SAButton></div>
              <div className="py-1.5 flex justify-between"><span>StartupXYZ — No login in 15 days</span><SAButton size="sm" variant="outline">Check In</SAButton></div>
            </div>
            <div>
              <div className="text-2xs uppercase tracking-wider text-indigo-600 font-semibold mb-1.5">🔵 New</div>
              <Link to="/super-admin/demo-requests" className="block py-1.5 border-b border-border hover:underline">{newDemo} demo requests today →</Link>
              <Link to="/super-admin/custom-deals" className="block py-1.5 hover:underline">1 new custom deal inquiry →</Link>
            </div>
          </div>
        </SACard>

        <SACard title="Recent Activity">
          <div className="p-3 space-y-2 text-xs max-h-80 overflow-auto">
            {activity.map(a => (
              <div key={a.id} className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: "hsl(var(--sa-accent))" }} />
                <div className="flex-1">
                  <div>{a.text}</div>
                  <div className="text-2xs text-muted-foreground">{a.at}</div>
                </div>
              </div>
            ))}
          </div>
        </SACard>

        <SACard title="Top Tenants by Revenue" action={<Link to="/super-admin/tenants" className="text-2xs text-indigo-600 hover:underline">View all →</Link>}>
          <table className="w-full text-xs">
            <tbody>
              {top.map((t, i) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 w-6 text-muted-foreground font-mono">{i+1}</td>
                  <td className="px-3 py-2 font-medium">{t.name}</td>
                  <td className="px-3 py-2 font-mono">{fmtINR(t.mrr)}</td>
                  <td className="px-3 py-2 text-right"><Pill tone="info">{planLabel(t.plan)}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SACard>
      </div>

      {/* Expiring plans */}
      <SACard title="Plans Expiring in Next 30 Days" action={<SAButton size="sm" variant="outline">Send All Reminders</SAButton>}>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr className="text-2xs uppercase">
              <th className="text-left px-4 h-9 font-medium">Tenant</th>
              <th className="text-left px-4 font-medium">Plan</th>
              <th className="text-left px-4 font-medium">Expires</th>
              <th className="text-left px-4 font-medium">MRR</th>
              <th className="text-left px-4 font-medium">Status</th>
              <th className="text-right px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { t: "Wipro", plan: "Enterprise Custom", e: "Apr 30", mrr: 45000, s: "Reminder not sent", tone: "warning" as const },
              { t: "Nykaa", plan: "Growth", e: "May 5", mrr: 14999, s: "Renewed", tone: "success" as const },
              { t: "StartupABC", plan: "Starter", e: "May 8", mrr: 999, s: "No contact", tone: "danger" as const },
              { t: "DesignHub", plan: "Trial", e: "May 3", mrr: 0, s: "Convert?", tone: "info" as const },
            ].map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-slate-50">
                <td className="px-4 h-10 font-medium">{r.t}</td>
                <td className="px-4">{r.plan}</td>
                <td className="px-4 font-mono text-muted-foreground">{r.e}</td>
                <td className="px-4 font-mono">{fmtINR(r.mrr)}</td>
                <td className="px-4"><Pill tone={r.tone}>{r.s}</Pill></td>
                <td className="px-4 text-right space-x-1">
                  <SAButton size="sm" variant="outline">Contact</SAButton>
                  <SAButton size="sm">Extend</SAButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SACard>
    </SAPage>
  );
}
