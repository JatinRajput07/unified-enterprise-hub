import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { SAPage, SACard, SAButton } from "../components/SAPage";
import { useSuperAdminStore, ALL_MODULES, type ModuleKey, type PlanKey } from "@/store/superAdminStore";

const PLAN_CARDS: { key: PlanKey; name: string; price: string; users: string; modules: string; support: string; star?: boolean }[] = [
  { key: "starter", name: "Starter", price: "₹999/mo", users: "Up to 10", modules: "3 modules", support: "Basic support" },
  { key: "growth", name: "Growth", price: "₹2,999/mo", users: "Up to 50", modules: "6 modules", support: "Priority support", star: true },
  { key: "pro", name: "Pro", price: "₹5,999/mo", users: "Up to 200", modules: "All modules", support: "Dedicated CSM" },
  { key: "enterprise", name: "Enterprise", price: "Custom", users: "Unlimited", modules: "All modules", support: "SLA + CSM" },
];

export default function SATenantNew() {
  const navigate = useNavigate();
  const addTenant = useSuperAdminStore(s => s.addTenant);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("IT Services");
  const [country, setCountry] = useState("India");
  const [website, setWebsite] = useState("");
  const [plan, setPlan] = useState<PlanKey>("growth");
  const [billing, setBilling] = useState<"monthly"|"annual">("monthly");
  const [customPrice, setCustomPrice] = useState(false);
  const [price, setPrice] = useState(2999);
  const [modules, setModules] = useState<ModuleKey[]>(["sales","hrms","pms","finance","wayofwork","mastersheet"]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [welcome, setWelcome] = useState(true);
  const [pwMode, setPwMode] = useState<"auto"|"manual">("auto");
  const [payMethod, setPayMethod] = useState("invoice");
  const [billingStart, setBillingStart] = useState(new Date().toISOString().slice(0,10));
  const [trialDays, setTrialDays] = useState(0);
  const [notes, setNotes] = useState("");

  const toggleMod = (k: ModuleKey) => setModules(m => m.includes(k) ? m.filter(x=>x!==k) : [...m, k]);

  const submit = () => {
    if (!name || !slug || !email || !adminName || !adminEmail) { toast.error("Please fill required fields"); return; }
    const t = addTenant({
      name, slug, email, phone, industry, country, website,
      plan, modules, users: 1, mrr: customPrice ? price : (PLAN_CARDS.find(p => p.key === plan)?.key === "enterprise" ? 0 : price),
      status: trialDays > 0 ? "trial" : "active",
      signup: billingStart,
      expires: new Date(Date.now() + (trialDays || 365)*86400000).toISOString().slice(0,10),
      lastLogin: "—", notes,
    });
    toast.success(`✅ ${t.name} created — ${modules.length} schemas provisioned`);
    navigate(`/super-admin/tenants/${t.id}`);
  };

  return (
    <SAPage title="Add Tenant" subtitle="Create a new organization with provisioned schemas" actions={
      <>
        <SAButton variant="outline" size="sm" onClick={() => navigate(-1)}>Cancel</SAButton>
        <SAButton size="sm" onClick={submit}>Create Tenant</SAButton>
      </>
    }>
      <div className="space-y-4 max-w-5xl">
        {/* Section 1 */}
        <SACard title="Organization Info">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Organization Name *"><input className={inputCls} value={name} onChange={e=>{setName(e.target.value); if(!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""));}} /></Field>
            <Field label="Slug *" hint={`app.yourdomain.com/${slug || "your-slug"}`}><input className={inputCls} value={slug} onChange={e=>setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""))} /></Field>
            <Field label="Billing Email *"><input type="email" className={inputCls} value={email} onChange={e=>setEmail(e.target.value)} /></Field>
            <Field label="Phone"><input className={inputCls} value={phone} onChange={e=>setPhone(e.target.value)} /></Field>
            <Field label="Industry">
              <select className={inputCls} value={industry} onChange={e=>setIndustry(e.target.value)}>
                {["IT Services","Fintech","Retail","Healthcare","Manufacturing","SaaS","Real Estate","EdTech","Other"].map(i=><option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Country *">
              <select className={inputCls} value={country} onChange={e=>setCountry(e.target.value)}>
                {["India","USA","UK","UAE","Singapore"].map(c=><option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Website" className="md:col-span-2"><input className={inputCls} value={website} onChange={e=>setWebsite(e.target.value)} /></Field>
          </div>
        </SACard>

        {/* Section 2 - Plans */}
        <SACard title="Plan Selection">
          <div className="p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PLAN_CARDS.map(p => (
                <button key={p.key} onClick={() => setPlan(p.key)} className={`text-left p-4 rounded-lg border-2 transition relative ${plan === p.key ? "border-indigo-500 bg-indigo-50" : "border-border bg-surface hover:border-indigo-200"}`}>
                  {p.star && <span className="absolute top-2 right-2 text-amber-500 text-xs">★</span>}
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-base font-bold mt-1" style={{ color: "hsl(var(--sa-accent))" }}>{p.price}</div>
                  <div className="text-2xs text-muted-foreground mt-2 space-y-0.5">
                    <div>{p.users}</div><div>{p.modules}</div><div>{p.support}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Billing cycle:</span>
                {(["monthly","annual"] as const).map(b => (
                  <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={billing===b} onChange={() => setBilling(b)} />
                    <span className="capitalize">{b}{b==="annual" && <span className="text-emerald-600 ml-1">(Save 20%)</span>}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={customPrice} onChange={e=>setCustomPrice(e.target.checked)} />
                Custom pricing override
              </label>
              {customPrice && <input type="number" className={`${inputCls} w-28`} value={price} onChange={e=>setPrice(Number(e.target.value))} />}
            </div>
          </div>
        </SACard>

        {/* Section 3 - Modules */}
        <SACard title={`Modules (${modules.length} of ${ALL_MODULES.length} selected)`}>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {ALL_MODULES.map(m => {
              const on = modules.includes(m.key);
              return (
                <button key={m.key} onClick={() => toggleMod(m.key)} className={`flex items-center gap-2 px-3 h-10 rounded-md border text-xs font-medium transition ${on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-border bg-surface text-muted-foreground hover:border-indigo-200"}`}>
                  <span className={`w-4 h-4 rounded flex items-center justify-center ${on ? "bg-indigo-600 text-white" : "bg-slate-200"}`}>{on && <Check className="w-3 h-3" />}</span>
                  {m.name}
                </button>
              );
            })}
          </div>
        </SACard>

        {/* Section 4 - Admin User */}
        <SACard title="Admin User">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Admin Name *"><input className={inputCls} value={adminName} onChange={e=>setAdminName(e.target.value)} /></Field>
            <Field label="Admin Email *"><input type="email" className={inputCls} value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={welcome} onChange={e=>setWelcome(e.target.checked)} /> Send welcome email
            </label>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">Password:</span>
              <label className="flex items-center gap-1.5"><input type="radio" checked={pwMode==="auto"} onChange={()=>setPwMode("auto")} /> Auto-generate</label>
              <label className="flex items-center gap-1.5"><input type="radio" checked={pwMode==="manual"} onChange={()=>setPwMode("manual")} /> Set manually</label>
            </div>
          </div>
        </SACard>

        {/* Section 5 - Billing */}
        <SACard title="Billing">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Payment Method"><select className={inputCls} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
              {["invoice","auto-charge","manual","free"].map(p=><option key={p} value={p}>{p}</option>)}
            </select></Field>
            <Field label="Billing Start Date *"><input type="date" className={inputCls} value={billingStart} onChange={e=>setBillingStart(e.target.value)} /></Field>
            <Field label="Trial Period (days, 0 = none)"><input type="number" className={inputCls} value={trialDays} onChange={e=>setTrialDays(Number(e.target.value))} /></Field>
            <Field label="Internal Notes" className="md:col-span-2"><textarea className={inputCls + " h-20"} value={notes} onChange={e=>setNotes(e.target.value)} /></Field>
          </div>
        </SACard>
      </div>
    </SAPage>
  );
}

const inputCls = "w-full h-9 px-2.5 rounded-md border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200";
function Field({ label, hint, children, className="" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><label className="text-2xs uppercase tracking-wider text-muted-foreground font-medium">{label}</label><div className="mt-1">{children}</div>{hint && <div className="text-2xs text-muted-foreground mt-1 font-mono">{hint}</div>}</div>;
}
