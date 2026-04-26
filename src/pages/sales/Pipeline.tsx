import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { useSalesStore, ALL_DEAL_STAGES, type DealStage } from "@/store/salesStore";
import { PEOPLE, inr } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const personById = (id: string) => PEOPLE.find(p => p.id === id);

const stageColor: Record<DealStage, string> = {
  Discovery: "hsl(var(--mod-sales))",
  Qualification: "hsl(var(--info))",
  Proposal: "hsl(var(--mod-pms))",
  Negotiation: "hsl(var(--warning))",
  Contract: "hsl(var(--mod-portfolio))",
  Won: "hsl(var(--success))",
  Lost: "hsl(var(--destructive))",
};

export default function Pipeline() {
  const deals = useSalesStore((s) => s.deals);
  const setDealStage = useSalesStore((s) => s.setDealStage);
  const { toast } = useToast();
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [dragId, setDragId] = useState<string | null>(null);

  const filtered = useMemo(() => ownerFilter === "all" ? deals : deals.filter(d => d.ownerId === ownerFilter), [deals, ownerFilter]);

  const grouped = useMemo(() => {
    const g: Record<DealStage, typeof deals> = { Discovery: [], Qualification: [], Proposal: [], Negotiation: [], Contract: [], Won: [], Lost: [] };
    filtered.forEach(d => g[d.stage].push(d));
    return g;
  }, [filtered]);

  const stageTotal = (stage: DealStage) => grouped[stage].reduce((acc, d) => acc + (d.currency === "USD" ? d.value * 83 : d.value), 0);

  function onDrop(stage: DealStage) {
    if (!dragId) return;
    const d = deals.find(x => x.id === dragId);
    if (d && d.stage !== stage) {
      setDealStage(dragId, stage);
      toast({ title: `${d.name} moved to ${stage}` });
    }
    setDragId(null);
  }

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Pipeline"
        subtitle={`${filtered.length} deals · ${inr(filtered.reduce((a, d) => a + (d.currency === "USD" ? d.value * 83 : d.value), 0))} weighted value`}
        accentVar="--mod-sales"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Filter className="w-3.5 h-3.5" /> Filters</Button>
            <Link to="/sales/deals/new"><Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3.5 h-3.5" /> New Deal</Button></Link>
          </>
        }
      />

      <div className="h-10 px-3 flex items-center gap-2 border-b border-border bg-surface/50 text-xs">
        <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="h-7 px-2 rounded-sm bg-background border border-border text-xs">
          <option value="all">All Owners</option>
          {PEOPLE.filter(p => p.dept === "Sales" || ["p1","p5"].includes(p.id)).map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="text-2xs text-muted-foreground">Tip: drag a card across stages to update.</div>
      </div>

      <div className="p-3 flex-1 overflow-x-auto">
        <div className="flex gap-2 min-w-max h-full">
          {ALL_DEAL_STAGES.map(stage => (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(stage)}
              className="w-72 shrink-0 bg-surface border border-border rounded-sm flex flex-col"
            >
              <div className="h-10 px-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: stageColor[stage] }} />
                  <h4 className="text-xs font-semibold">{stage}</h4>
                  <span className="text-2xs font-mono text-muted-foreground">({grouped[stage].length})</span>
                </div>
                <span className="text-2xs font-mono font-bold">{inr(stageTotal(stage))}</span>
              </div>
              <div className="p-1.5 flex-1 overflow-auto space-y-1.5 min-h-[200px]">
                {grouped[stage].map(d => {
                  const owner = personById(d.ownerId);
                  return (
                    <Link
                      key={d.id}
                      to={`/sales/deals/${d.id}`}
                      draggable
                      onDragStart={() => setDragId(d.id)}
                      className="block bg-background border border-border rounded-sm p-2 hover:border-primary hover:shadow-sm cursor-grab active:cursor-grabbing"
                    >
                      <div className="text-xs font-medium line-clamp-2 mb-1">{d.name}</div>
                      <div className="flex items-center justify-between text-2xs mb-1.5">
                        <span className="font-mono font-bold">{d.currency === "USD" ? `$${d.value.toLocaleString()}` : inr(d.value)}</span>
                        <span className="text-muted-foreground font-mono">{d.probability}%</span>
                      </div>
                      <div className="flex items-center justify-between text-3xs text-muted-foreground">
                        <span>{d.expectedCloseDate}</span>
                        <div className="w-4 h-4 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono font-bold">{owner?.initials}</div>
                      </div>
                    </Link>
                  );
                })}
                {grouped[stage].length === 0 && <div className="text-center py-8 text-3xs text-muted-foreground">Drop here</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}