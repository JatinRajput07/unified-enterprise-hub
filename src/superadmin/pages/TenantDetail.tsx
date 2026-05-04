import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { SAPage, SACard, SAButton, Pill } from "../components/SAPage";
import { useSuperAdminStore, fmtINR, planLabel, ALL_MODULES, type ModuleKey } from "@/store/superAdminStore";

const TABS = ["Overview", "Users", "Modules", "Billing", "Activity", "Support"] as const;

export default function SATenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tenant = useSuperAdminStore(s => s.tenants.find(t => t.id === id));
  const updateTenant = useSuperAdminStore(s => s.updateTenant);
  const invoices = useSuperAdminStore(s => s.invoices.filter(i => i.tenantId === id));
  const tickets = useSuperAdminStore(s => s.tickets.filter(t => t.tenantId === id));
  const activity = useSuperAdminStore(s => s.activity.filter(a => a.tenantId === id));
  const [tab, setTab] = useState<typeof TABS[number]>("Overview");
  const [modal, setModal] = useState<null | { type: "enable"|"disable"; mod: ModuleKey }>(null);
  const [reason, setReason] = useState("");

  if (!tenant) return <SAPage title="Not found"><div className="text-sm text-muted-foreground">Tenant not found.</div></SAPage>;

  const impersonate = () => {
    sessionStorage.setItem("impersonate", JSON.stringify({ id: tenant.id, name: tenant.name }));
    window.open("/?impersonate=" + tenant.id, "_blank");
    toast.success(`Opening CRM as ${tenant.name}…`);
  };
  const toggleModule = (k: ModuleKey, enable: boolean) => {
    updateTenant(tenant.id, { modules: enable ? [...tenant.modules, k] : tenant.modules.filter(m => m !== k) });
    toast.success(`${enable ? "Enabled" : "Disabled"} ${k} for ${tenant.name}`);
    setModal(null); setReason("");
  };

  const mockUsers = [
    { name: "Arjun Mehta", email: "arjun@" + tenant.slug + ".com", role: "Admin", dept: "Operations", last: "2h ago", status: "active" },
    { name: "Sneha Rao", email: "sneha@" + tenant.slug + ".com", role: "Manager", dept: "Sales", last: "1d ago", status: "active" },
    { name: "Karan V", email: "karan@" + tenant.slug + ".com", role: "Employee", dept: "Engineering", last: "3d ago", status: "active" },
  ];

  return (
    <SAPage
      title={tenant.name}
      subtitle={`${tenant.slug} · ${planLabel(tenant.plan)} Plan · MRR ${fmtINR(tenant.mrr)} · ${tenant.users} users · Expires ${tenant.expires}`}
      actions={
        <>
          <SAButton variant="outline" size="sm">Edit</SAButton>
          <SAButton variant="outline" size="sm" onClick={impersonate}><Eye className="w-3.5 h-3.5" /> Impersonate</SAButton>
          <SAButton variant="danger" size="sm" onClick={() => { updateTenant(tenant.id, { status: "suspended" }); toast("Suspended"); }}>Suspend</SAButton>
          <SAButton variant="ghost" size="sm"><MoreVertical className="w-3.5 h-3.5" /></SAButton>
        </>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 h-10 text-xs font-medium border-b-2 transition ${tab === t ? "text-indigo-600" : "text-muted-foreground border-transparent hover:text-foreground"}`}
            style={tab === t ? { borderColor: "hsl(var(--sa-accent))" } : undefined}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SACard title="Organization">
            <div className="p-4 space-y-2 text-xs">
              <Row k="Industry" v={tenant.industry || "—"} />
              <Row k="Country" v={tenant.country} />
              <Row k="Website" v={tenant.website || "—"} />
              <Row k="Email" v={tenant.email} />
              <Row k="Phone" v={tenant.phone || "—"} />
            </div>
            <div className="p-4 border-t border-border">
              <div className="text-2xs uppercase tracking-wider text-muted-foreground mb-2">Account Health</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--sa-accent))" }}>82<span className="text-base text-muted-foreground">/100</span></div>
              <div className="text-xs text-emerald-600 font-medium">Healthy</div>
              <ul className="text-2xs text-muted-foreground mt-2 space-y-0.5">
                <li>✅ Login frequency</li><li>✅ Feature adoption</li><li>✅ Payment status</li><li>🟡 Support tickets ({tickets.filter(t=>t.status!=="resolved" && t.status!=="closed").length} open)</li>
              </ul>
            </div>
          </SACard>
          <div className="space-y-4">
            <SACard title="Revenue Summary">
              <div className="p-4 text-xs space-y-1.5 font-mono">
                <Row k="Plan" v={`${planLabel(tenant.plan)} (${fmtINR(tenant.mrr)}/mo)`} />
                <Row k="Total MRR" v={fmtINR(tenant.mrr)} />
                <Row k="ARR" v={fmtINR(tenant.mrr * 12)} />
                <Row k="Last payment" v={invoices.find(i=>i.status==="paid")?.paidDate || "—"} />
                <Row k="Next payment" v="May 1, 2025" />
              </div>
            </SACard>
            <SACard title="Usage This Month">
              <div className="p-4 text-xs space-y-2">
                <Bar k="Active Users" v={`${tenant.users}`} max={50} cur={tenant.users} />
                <Bar k="Modules used" v={`${tenant.modules.length} / ${ALL_MODULES.length}`} max={ALL_MODULES.length} cur={tenant.modules.length} />
                <Bar k="API calls" v="12,840" max={50000} cur={12840} />
                <Bar k="Storage" v="2.4 GB" max={25} cur={2.4} />
              </div>
            </SACard>
          </div>
        </div>
      )}

      {tab === "Users" && (
        <SACard title="Users">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-muted-foreground"><tr className="text-2xs uppercase">
              <th className="text-left px-3 h-9 font-medium">Name</th><th className="text-left px-3 font-medium">Email</th>
              <th className="text-left px-3 font-medium">Role</th><th className="text-left px-3 font-medium">Dept</th>
              <th className="text-left px-3 font-medium">Last Login</th><th className="text-right px-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.email} className="border-t border-border hover:bg-slate-50">
                  <td className="px-3 h-10 font-medium">{u.name}</td>
                  <td className="px-3 font-mono text-2xs">{u.email}</td>
                  <td className="px-3"><Pill tone={u.role==="Admin"?"info":"neutral"}>{u.role}</Pill></td>
                  <td className="px-3">{u.dept}</td>
                  <td className="px-3 text-muted-foreground">{u.last}</td>
                  <td className="px-3 text-right space-x-1">
                    <button className="text-indigo-600 hover:underline">Reset Password</button>
                    <span className="text-border">·</span>
                    <button className="text-rose-600 hover:underline">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SACard>
      )}

      {tab === "Modules" && (
        <SACard title="Module Status">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-muted-foreground"><tr className="text-2xs uppercase">
              <th className="text-left px-3 h-9 font-medium">Module</th><th className="text-left px-3 font-medium">Status</th>
              <th className="text-left px-3 font-medium">Schema</th><th className="text-left px-3 font-medium">Last Activity</th>
              <th className="text-right px-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {ALL_MODULES.map(m => {
                const on = tenant.modules.includes(m.key);
                const schema = tenant.slug.split("-")[0] + "_" + m.key;
                return (
                  <tr key={m.key} className="border-t border-border hover:bg-slate-50">
                    <td className="px-3 h-10 font-medium">{m.name}</td>
                    <td className="px-3"><Pill tone={on?"success":"neutral"}>{on ? "✅ Active" : "❌ Off"}</Pill></td>
                    <td className="px-3 font-mono text-2xs">{on ? schema : "—"}</td>
                    <td className="px-3 text-muted-foreground">{on ? "2h ago" : "—"}</td>
                    <td className="px-3 text-right">
                      <SAButton size="sm" variant={on ? "outline" : "primary"} onClick={() => setModal({ type: on ? "disable" : "enable", mod: m.key })}>
                        {on ? "Disable" : "Enable"}
                      </SAButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SACard>
      )}

      {tab === "Billing" && (
        <div className="space-y-4">
          <SACard title="Upcoming Charges">
            <div className="p-4 text-xs flex justify-between">
              <div>Next billing: <strong>May 1, 2025</strong> — {fmtINR(tenant.mrr)}</div>
              <div>Plan renewal: <strong>{tenant.expires}</strong></div>
            </div>
          </SACard>
          <SACard title="Payment History" action={<div className="flex gap-1.5"><SAButton size="sm" variant="outline">Add Credit</SAButton><SAButton size="sm">Generate Invoice</SAButton></div>}>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-muted-foreground"><tr className="text-2xs uppercase">
                <th className="text-left px-3 h-9 font-medium">Invoice</th><th className="text-left px-3 font-medium">Period</th>
                <th className="text-left px-3 font-medium">Total</th><th className="text-left px-3 font-medium">Status</th>
                <th className="text-left px-3 font-medium">Due</th><th className="text-right px-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {invoices.map(i => (
                  <tr key={i.id} className="border-t border-border hover:bg-slate-50">
                    <td className="px-3 h-10 font-mono text-2xs">{i.id}</td>
                    <td className="px-3">{i.period}</td>
                    <td className="px-3 font-mono">{fmtINR(i.total)}</td>
                    <td className="px-3"><Pill tone={i.status==="paid"?"success":i.status==="failed"?"danger":i.status==="pending"?"warning":"neutral"}>{i.status}</Pill></td>
                    <td className="px-3 text-muted-foreground">{i.dueDate}</td>
                    <td className="px-3 text-right space-x-1">
                      <button className="text-indigo-600 hover:underline">View</button>
                      <span className="text-border">·</span>
                      <button className="text-indigo-600 hover:underline">Download PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SACard>
        </div>
      )}

      {tab === "Activity" && (
        <SACard title="Activity Log">
          <div className="p-4 space-y-2 text-xs">
            {[...activity, { id: "_seed", at: "Yesterday", text: `${tenant.name} added a new module`, kind: "module" as const }].map(a => (
              <div key={a.id} className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: "hsl(var(--sa-accent))" }} />
                <div><div>{a.text}</div><div className="text-2xs text-muted-foreground">{a.at}</div></div>
              </div>
            ))}
            {activity.length === 0 && <div className="text-muted-foreground">No activity yet.</div>}
          </div>
        </SACard>
      )}

      {tab === "Support" && (
        <SACard title="Support Tickets">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-muted-foreground"><tr className="text-2xs uppercase">
              <th className="text-left px-3 h-9 font-medium">Ticket</th><th className="text-left px-3 font-medium">Subject</th>
              <th className="text-left px-3 font-medium">Priority</th><th className="text-left px-3 font-medium">Status</th>
              <th className="text-left px-3 font-medium">Created</th>
            </tr></thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-t border-border hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/super-admin/support/${t.id}`)}>
                  <td className="px-3 h-10 font-mono text-2xs">{t.id}</td>
                  <td className="px-3">{t.subject}</td>
                  <td className="px-3"><Pill tone={t.priority==="P1"?"danger":t.priority==="P2"?"warning":"neutral"}>{t.priority}</Pill></td>
                  <td className="px-3"><Pill tone={t.status==="resolved"?"success":t.status==="open"?"warning":"info"}>{t.status}</Pill></td>
                  <td className="px-3 text-muted-foreground">{t.created}</td>
                </tr>
              ))}
              {tickets.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No support tickets.</td></tr>}
            </tbody>
          </table>
        </SACard>
      )}

      {/* Module enable/disable modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5">
            <h3 className="text-base font-semibold mb-2">{modal.type === "enable" ? "Enable" : "Disable"} {ALL_MODULES.find(m=>m.key===modal.mod)?.name}</h3>
            {modal.type === "enable" ? (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Enable <strong>{modal.mod}</strong> for {tenant.name}?</p>
                <p>+₹{ALL_MODULES.find(m=>m.key===modal.mod)?.price.toLocaleString("en-IN")}/month added to their plan.</p>
                <p className="text-2xs font-mono bg-slate-50 p-2 rounded">Schema will be created: {tenant.slug.split("-")[0]}_{modal.mod}</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="text-amber-600">⚠ This will disconnect the schema. Data preserved but inaccessible.</p>
                <textarea className={inputClsM} placeholder="Reason (required, internal note)" value={reason} onChange={e=>setReason(e.target.value)} />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <SAButton variant="outline" onClick={() => { setModal(null); setReason(""); }}>Cancel</SAButton>
              <SAButton variant={modal.type==="disable"?"danger":"primary"} onClick={() => toggleModule(modal.mod, modal.type === "enable")}>
                Confirm {modal.type === "enable" ? "Enable" : "Disable"}
              </SAButton>
            </div>
          </div>
        </div>
      )}
    </SAPage>
  );
}

const inputClsM = "w-full px-2.5 py-2 rounded-md border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 h-20 mt-2";
function Row({ k, v }: { k: string; v: React.ReactNode }) { return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>; }
function Bar({ k, v, max, cur }: { k: string; v: string; max: number; cur: number }) {
  const pct = Math.min(100, (cur/max)*100);
  return (<div><div className="flex justify-between text-2xs mb-1"><span className="text-muted-foreground">{k}</span><span className="font-mono">{v}</span></div><div className="h-1.5 rounded-sm bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${pct}%`, background: "hsl(var(--sa-accent))" }} /></div></div>);
}
