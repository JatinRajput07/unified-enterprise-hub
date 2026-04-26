import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Download, Search } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/StatusPill";
import { useSalesStore, ALL_DEAL_STAGES, type DealStage } from "@/store/salesStore";
import { PEOPLE, inr } from "@/lib/mockData";

const stageVariant = (s: DealStage) => s === "Won" ? "success" : s === "Lost" ? "danger" : s === "Negotiation" || s === "Contract" ? "warning" : s === "Proposal" ? "purple" : "info";

export default function Deals() {
  const deals = useSalesStore((s) => s.deals);
  const companies = useSalesStore((s) => s.companies);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<DealStage | "all">("all");

  const filtered = useMemo(() => {
    let out = deals;
    if (search) out = out.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    if (stage !== "all") out = out.filter(d => d.stage === stage);
    return out;
  }, [deals, search, stage]);

  const totalValue = filtered.reduce((acc, d) => acc + (d.currency === "USD" ? d.value * 83 : d.value), 0);
  const weightedValue = filtered.reduce((acc, d) => acc + ((d.currency === "USD" ? d.value * 83 : d.value) * d.probability / 100), 0);

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Deals"
        subtitle={`${filtered.length} deals · ${inr(totalValue)} total · ${inr(weightedValue)} weighted`}
        accentVar="--mod-sales"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3.5 h-3.5" /> Export</Button>
            <Link to="/sales/deals/new"><Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3.5 h-3.5" /> New Deal</Button></Link>
          </>
        }
      />
      <div className="h-10 px-3 flex items-center gap-2 border-b border-border bg-surface/50 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deals…" className="h-7 pl-7 w-56 text-xs" />
        </div>
        <select value={stage} onChange={(e) => setStage(e.target.value as any)} className="h-7 px-2 rounded-sm bg-background border border-border text-xs">
          <option value="all">All Stages</option>
          {ALL_DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="p-3 flex-1">
        <div className="bg-surface border border-border rounded-sm overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 sticky top-0">
              <tr className="text-2xs uppercase text-muted-foreground tracking-wider">
                <th className="text-left px-3 h-8 font-medium">Deal</th>
                <th className="text-left px-3 h-8 font-medium">Company</th>
                <th className="text-left px-3 h-8 font-medium">Stage</th>
                <th className="text-right px-3 h-8 font-medium">Value</th>
                <th className="text-center px-3 h-8 font-medium">Prob</th>
                <th className="text-left px-3 h-8 font-medium">Owner</th>
                <th className="text-left px-3 h-8 font-medium">Close</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const co = companies.find(c => c.id === d.companyId);
                const owner = PEOPLE.find(p => p.id === d.ownerId);
                return (
                  <tr key={d.id} className="border-t border-border hover:bg-surface-hover">
                    <td className="px-3 h-10">
                      <Link to={`/sales/deals/${d.id}`} className="hover:text-primary font-medium truncate max-w-[300px] block">{d.name}</Link>
                    </td>
                    <td className="px-3 h-10 text-muted-foreground">{co?.name ?? "—"}</td>
                    <td className="px-3 h-10"><StatusPill variant={stageVariant(d.stage) as any}>{d.stage}</StatusPill></td>
                    <td className="px-3 h-10 text-right font-mono">{d.currency === "USD" ? `$${d.value.toLocaleString()}` : inr(d.value)}</td>
                    <td className="px-3 h-10 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${d.probability}%` }} />
                        </div>
                        <span className="font-mono text-2xs w-7">{d.probability}%</span>
                      </div>
                    </td>
                    <td className="px-3 h-10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-3xs font-bold">{owner?.initials}</div>
                        <span className="truncate max-w-[100px]">{owner?.name}</span>
                      </div>
                    </td>
                    <td className="px-3 h-10 font-mono text-2xs text-muted-foreground">{d.expectedCloseDate}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No deals</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}