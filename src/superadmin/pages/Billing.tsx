import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { SAPage, SACard, SAKpi, SAButton, Pill } from "../components/SAPage";
import { useSuperAdminStore, fmtINR, planLabel } from "@/store/superAdminStore";
import { toast } from "sonner";

const series = ["Nov","Dec","Jan","Feb","Mar","Apr","May"].map((m, i) => ({
  m, new: 22000 + i*1500, expansion: 8000 + i*1000, contraction: -(3000 + i*200), churn: -(5000 + i*300),
}));

export default function SABilling() {
  const invoices = useSuperAdminStore(s => s.invoices);
  const tenants = useSuperAdminStore(s => s.tenants);
  const [open, setOpen] = useState(false);
  const mrr = tenants.filter(t=>t.status==="active").reduce((s,t)=>s+t.mrr,0);
  const collected = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.total,0);
  const outstanding = invoices.filter(i=>["pending","overdue","failed"].includes(i.status)).reduce((s,i)=>s+i.total,0);
  const planAgg = ["enterprise","pro","growth","starter","custom"].map(k => ({
    name: planLabel(k as any),
    mrr: tenants.filter(t=>t.plan===k && t.status==="active").reduce((s,t)=>s+t.mrr,0),
  })).filter(x=>x.mrr>0);

  return (
    <SAPage title="Billing & Revenue" subtitle="Invoices, MRR breakdown, and collections"
      actions={<SAButton size="sm" onClick={()=>setOpen(true)}>Generate Invoice</SAButton>}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <SAKpi label="MRR" value={fmtINR(mrr)} trend="↑ 8.2%" />
        <SAKpi label="ARR" value={fmtINR(mrr*12)} trend="↑ 8.2%" />
        <SAKpi label="Collected" value={fmtINR(collected)} sub="this month" />
        <SAKpi label="Outstanding" value={fmtINR(outstanding)} danger />
        <SAKpi label="Refunded" value={fmtINR(15000)} sub="2 invoices" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <SACard title="MRR Breakdown">
          <div className="h-64 p-3"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v:any)=>fmtINR(Math.abs(v))}/><Legend wrapperStyle={{fontSize:10}}/>
              <Bar dataKey="new" fill="#10B981" stackId="s" name="New"/>
              <Bar dataKey="expansion" fill="#14B8A6" stackId="s" name="Expansion"/>
              <Bar dataKey="contraction" fill="#F59E0B" stackId="s" name="Contraction"/>
              <Bar dataKey="churn" fill="#EF4444" stackId="s" name="Churned"/>
            </BarChart></ResponsiveContainer></div>
        </SACard>
        <SACard title="Revenue by Plan">
          <div className="p-4 space-y-3">{planAgg.map((p,i)=>{const total=planAgg.reduce((s,x)=>s+x.mrr,0); const pct=(p.mrr/total)*100; return (
            <div key={i}><div className="flex justify-between text-xs mb-1"><span>{p.name}</span><span className="font-mono">{fmtINR(p.mrr)} ({pct.toFixed(0)}%)</span></div>
            <div className="h-2.5 rounded-sm bg-slate-100 overflow-hidden"><div className="h-full" style={{width:`${pct}%`,background:"hsl(var(--sa-accent))"}}/></div></div>
          );})}</div>
        </SACard>
      </div>
      <SACard title="All Invoices">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-muted-foreground"><tr className="text-2xs uppercase">
            <th className="text-left px-3 h-9 font-medium">Invoice</th><th className="text-left px-3 font-medium">Tenant</th>
            <th className="text-left px-3 font-medium">Plan</th><th className="text-left px-3 font-medium">Period</th>
            <th className="text-left px-3 font-medium">Total</th><th className="text-left px-3 font-medium">Status</th>
            <th className="text-left px-3 font-medium">Due</th><th className="text-right px-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>{invoices.slice(0,20).map(i=>(
            <tr key={i.id} className="border-t border-border hover:bg-slate-50">
              <td className="px-3 h-10 font-mono text-2xs">{i.id}</td>
              <td className="px-3 font-medium">{i.tenantName}</td>
              <td className="px-3"><Pill tone="info">{planLabel(i.plan)}</Pill></td>
              <td className="px-3">{i.period}</td>
              <td className="px-3 font-mono">{fmtINR(i.total)}</td>
              <td className="px-3"><Pill tone={i.status==="paid"?"success":i.status==="failed"?"danger":i.status==="pending"?"warning":"neutral"}>{i.status}</Pill></td>
              <td className="px-3 text-muted-foreground">{i.dueDate}</td>
              <td className="px-3 text-right"><button className="text-indigo-600 hover:underline">View</button></td>
            </tr>))}</tbody>
        </table>
      </SACard>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={()=>setOpen(false)}>
          <div className="absolute inset-0 bg-black/30"/>
          <div className="relative w-full max-w-lg bg-white shadow-xl flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="h-12 px-4 border-b flex items-center justify-between"><h2 className="text-sm font-semibold">Generate Invoice</h2><button onClick={()=>setOpen(false)}>✕</button></div>
            <div className="p-4 space-y-3 flex-1 overflow-auto text-xs">
              <div><label className="text-2xs text-muted-foreground">Tenant</label><select className={inp}>{tenants.map(t=><option key={t.id}>{t.name}</option>)}</select></div>
              <div><label className="text-2xs text-muted-foreground">Period</label><input className={inp} placeholder="May 2025"/></div>
              <div><label className="text-2xs text-muted-foreground">Amount</label><input type="number" className={inp} defaultValue={9999}/></div>
              <div><label className="text-2xs text-muted-foreground">Due Date</label><input type="date" className={inp}/></div>
            </div>
            <div className="p-3 border-t flex justify-end gap-2"><SAButton variant="outline" onClick={()=>setOpen(false)}>Cancel</SAButton><SAButton onClick={()=>{toast.success("Invoice generated");setOpen(false);}}>Generate + Send</SAButton></div>
          </div>
        </div>
      )}
    </SAPage>
  );
}
const inp = "w-full h-9 px-2.5 mt-1 rounded-md border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200";