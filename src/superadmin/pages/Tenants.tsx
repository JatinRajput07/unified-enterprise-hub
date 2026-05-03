import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Download, Upload, Eye } from "lucide-react";
import { SAPage, SACard, Pill, SAButton } from "../components/SAPage";
import { useSuperAdminStore, fmtINR, planLabel, ALL_MODULES } from "@/store/superAdminStore";
import { toast } from "sonner";

const planTone: Record<string, any> = { trial: "neutral", starter: "info", growth: "teal", pro: "purple", enterprise: "info", custom: "amber" };
const statusTone: Record<string, any> = { active: "success", trial: "info", suspended: "danger", cancelled: "neutral", payment_failed: "danger" };

export default function SATenants() {
  const tenants = useSuperAdminStore(s => s.tenants);
  const updateTenant = useSuperAdminStore(s => s.updateTenant);
  const [q, setQ] = useState("");
  const [planF, setPlanF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [sel, setSel] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const PAGE = 10;

  const filtered = useMemo(() => tenants.filter(t =>
    (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.slug.includes(q.toLowerCase())) &&
    (planF === "all" || t.plan === planF) &&
    (statusF === "all" || t.status === statusF)
  ), [tenants, q, planF, statusF]);
  const paged = filtered.slice((page-1)*PAGE, page*PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));

  const counts = {
    active: tenants.filter(t => t.status === "active").length,
    trial: tenants.filter(t => t.status === "trial").length,
    suspended: tenants.filter(t => t.status === "suspended").length,
    failed: tenants.filter(t => t.status === "payment_failed").length,
  };
  const mrr = tenants.filter(t => t.status === "active").reduce((s,t)=>s+t.mrr,0);

  const toggleAll = () => setSel(sel.length === paged.length ? [] : paged.map(t => t.id));
  const toggleOne = (id: string) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const impersonate = (id: string, name: string) => {
    sessionStorage.setItem("impersonate", JSON.stringify({ id, name }));
    window.open("/?impersonate=" + id, "_blank");
    toast.success(`Impersonating ${name} — opened in new tab`);
  };
  const suspend = (id: string) => { updateTenant(id, { status: "suspended" }); toast("Tenant suspended"); };

  return (
    <SAPage
      title="All Tenants"
      subtitle={`Active: ${counts.active} · Trial: ${counts.trial} · Suspended: ${counts.suspended} · Failed: ${counts.failed} · Total: ${tenants.length} · MRR: ${fmtINR(mrr)} · ARR: ${fmtINR(mrr*12)}`}
      actions={
        <>
          <SAButton variant="outline" size="sm"><Upload className="w-3.5 h-3.5" /> Import</SAButton>
          <SAButton variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Export</SAButton>
          <SAButton size="sm" onClick={() => navigate("/super-admin/tenants/new")}><Plus className="w-3.5 h-3.5" /> Add Tenant</SAButton>
        </>
      }
    >
      <SACard>
        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-surface text-xs focus:outline-none" placeholder="Search tenants…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          </div>
          <select className="h-8 px-2 text-xs rounded-md border border-border bg-surface" value={planF} onChange={e => setPlanF(e.target.value)}>
            <option value="all">All Plans</option>
            {["trial","starter","growth","pro","enterprise","custom"].map(p => <option key={p} value={p}>{planLabel(p as any)}</option>)}
          </select>
          <select className="h-8 px-2 text-xs rounded-md border border-border bg-surface" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="payment_failed">Payment Failed</option>
          </select>
          <div className="flex-1" />
          {sel.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">{sel.length} selected</span>
              <SAButton size="sm" variant="outline">Send Email</SAButton>
              <SAButton size="sm" variant="outline" onClick={() => { sel.forEach(suspend); setSel([]); }}>Suspend</SAButton>
              <SAButton size="sm" variant="outline">Send Invoice</SAButton>
            </div>
          )}
        </div>

        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr className="text-2xs uppercase">
              <th className="px-3 h-9 w-8"><input type="checkbox" checked={sel.length === paged.length && paged.length > 0} onChange={toggleAll} /></th>
              <th className="text-left px-3 font-medium">Org</th>
              <th className="text-left px-3 font-medium">Plan</th>
              <th className="text-left px-3 font-medium">Modules</th>
              <th className="text-left px-3 font-medium">Users</th>
              <th className="text-left px-3 font-medium">MRR</th>
              <th className="text-left px-3 font-medium">Status</th>
              <th className="text-left px-3 font-medium">Signup</th>
              <th className="text-left px-3 font-medium">Expires</th>
              <th className="text-right px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(t => (
              <tr key={t.id} className="border-t border-border hover:bg-slate-50">
                <td className="px-3 h-11"><input type="checkbox" checked={sel.includes(t.id)} onChange={() => toggleOne(t.id)} /></td>
                <td className="px-3">
                  <Link to={`/super-admin/tenants/${t.id}`} className="font-medium hover:underline">{t.name}</Link>
                  <div className="text-2xs text-muted-foreground font-mono">{t.slug}</div>
                </td>
                <td className="px-3"><Pill tone={planTone[t.plan]}>{planLabel(t.plan)}</Pill></td>
                <td className="px-3" title={t.modules.map(m => ALL_MODULES.find(x=>x.key===m)?.name).join(", ")}>
                  <span className="font-mono">{t.modules.length}</span> modules
                </td>
                <td className="px-3 font-mono">{t.users}</td>
                <td className="px-3 font-mono">{fmtINR(t.mrr)}</td>
                <td className="px-3"><Pill tone={statusTone[t.status]}>{t.status.replace("_"," ")}</Pill></td>
                <td className="px-3 text-muted-foreground">{t.signup}</td>
                <td className="px-3 text-muted-foreground">{t.expires}</td>
                <td className="px-3 text-right space-x-1 whitespace-nowrap">
                  <button onClick={() => navigate(`/super-admin/tenants/${t.id}`)} className="text-indigo-600 hover:underline">View</button>
                  <span className="text-border">·</span>
                  <button onClick={() => impersonate(t.id, t.name)} className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"><Eye className="w-3 h-3" />Impersonate</button>
                  <span className="text-border">·</span>
                  <button onClick={() => suspend(t.id)} className="text-rose-600 hover:underline">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-2xs text-muted-foreground">
          <div>Showing {(page-1)*PAGE+1}–{Math.min(page*PAGE, filtered.length)} of {filtered.length}</div>
          <div className="flex items-center gap-1">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="h-7 px-2 rounded-md border border-border disabled:opacity-40">Prev</button>
            <span className="px-2">{page} / {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} className="h-7 px-2 rounded-md border border-border disabled:opacity-40">Next</button>
          </div>
        </div>
      </SACard>
    </SAPage>
  );
}
