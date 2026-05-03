import { Plus } from "lucide-react";
import { SAPage, SACard, SAButton, Pill } from "../components/SAPage";
import { useSuperAdminStore, fmtINR, ALL_MODULES } from "@/store/superAdminStore";
import { toast } from "sonner";

export default function SAPlans() {
  const plans = useSuperAdminStore(s => s.plans);
  const tenants = useSuperAdminStore(s => s.tenants);

  return (
    <SAPage title="Plan Management" subtitle="Create and manage product plans"
      actions={<SAButton size="sm" onClick={() => toast("Open Create Plan form")}><Plus className="w-3.5 h-3.5" /> New Plan</SAButton>}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map(p => {
          const inPlan = tenants.filter(t => t.plan === p.key);
          const mrr = inPlan.reduce((s,t)=>s+t.mrr,0);
          return (
            <SACard key={p.key}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-base font-semibold">{p.name}</div>
                    <div className="text-xl font-bold mt-1" style={{ color: "hsl(var(--sa-accent))" }}>{p.price === 0 ? "Custom" : `${fmtINR(p.price)}/mo`}</div>
                  </div>
                  <Pill tone="info">{inPlan.length} tenants</Pill>
                </div>
                <div className="text-2xs text-muted-foreground mb-3">MRR: <strong className="text-foreground">{fmtINR(mrr)}</strong></div>
                <div className="space-y-1 text-xs border-t border-border pt-3">
                  <div><strong>Limits</strong></div>
                  <div className="text-muted-foreground">Users: {p.maxUsers === 0 ? "Unlimited" : p.maxUsers} · Modules: {p.maxModules === 0 ? "All" : p.maxModules}</div>
                  <div className="text-muted-foreground">Storage: {p.storageGB}GB · API: {p.apiCalls.toLocaleString()}/mo</div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs font-medium mb-1.5">Modules allowed:</div>
                  <div className="flex flex-wrap gap-1">
                    {p.modulesAllowed.map(m => <Pill key={m} tone="neutral">{ALL_MODULES.find(x=>x.key===m)?.name}</Pill>)}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <SAButton size="sm" variant="outline" onClick={() => toast("Edit plan form")}>Edit Plan</SAButton>
                  <SAButton size="sm" variant="ghost" onClick={() => toast(`${inPlan.length} tenants on ${p.name}`)}>View Tenants</SAButton>
                </div>
              </div>
            </SACard>
          );
        })}
      </div>
    </SAPage>
  );
}
