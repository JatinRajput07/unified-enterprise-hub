import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle2, XCircle } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/StatusPill";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSalesStore, ALL_DEAL_STAGES, type DealStage } from "@/store/salesStore";
import { PEOPLE, inr } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function DealDetail() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const deal = useSalesStore((s) => s.deals.find(d => d.id === id));
  const company = useSalesStore((s) => s.companies.find(c => c.id === deal?.companyId));
  const contact = useSalesStore((s) => s.contacts.find(c => c.id === deal?.contactId));
  const activities = useSalesStore((s) => s.activities.filter(a => a.dealId === id));
  const proposals = useSalesStore((s) => s.proposals.filter(p => p.dealId === id));
  const setDealStage = useSalesStore((s) => s.setDealStage);
  const addProposal = useSalesStore((s) => s.addProposal);

  if (!deal) return <div className="p-6 text-sm">Deal not found. <Link to="/sales/deals" className="text-primary">Back</Link></div>;

  const owner = PEOPLE.find(p => p.id === deal.ownerId);

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title={deal.name}
        subtitle={`${company?.name ?? ""} · ${deal.currency === "USD" ? `$${deal.value.toLocaleString()}` : inr(deal.value)} · ${deal.probability}% probability`}
        accentVar="--mod-sales"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => nav(-1)}><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>
            <Button size="sm" className="h-7 text-xs gap-1 bg-success hover:bg-success/90" onClick={() => { setDealStage(deal.id, "Won"); toast({ title: "Deal marked as Won 🎉" }); }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Won
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setDealStage(deal.id, "Lost"); toast({ title: "Deal marked as Lost" }); }}>
              <XCircle className="w-3.5 h-3.5" /> Mark Lost
            </Button>
          </>
        }
      />

      {/* Stage progress */}
      <div className="px-3 py-2 border-b border-border bg-surface/50">
        <div className="flex items-center gap-1">
          {ALL_DEAL_STAGES.filter(s => s !== "Lost").map((s, i) => {
            const idx = ALL_DEAL_STAGES.indexOf(deal.stage);
            const myIdx = ALL_DEAL_STAGES.indexOf(s);
            const active = myIdx <= idx && deal.stage !== "Lost";
            return (
              <button
                key={s}
                onClick={() => setDealStage(deal.id, s as DealStage)}
                className={`flex-1 h-7 text-2xs font-medium rounded-sm transition ${active ? "bg-primary text-primary-foreground" : "bg-surface-hover text-muted-foreground hover:bg-muted"}`}
              >
                {i + 1}. {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="h-8">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity ({activities.length})</TabsTrigger>
              <TabsTrigger value="proposals" className="text-xs">Proposals ({proposals.length})</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-3 bg-surface border border-border rounded-sm p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><div className="text-muted-foreground text-2xs uppercase mb-1">Company</div><div className="font-medium">{company?.name ?? "—"}</div></div>
                <div><div className="text-muted-foreground text-2xs uppercase mb-1">Contact</div><div className="font-medium">{contact ? `${contact.firstName} ${contact.lastName}` : "—"}</div></div>
                <div><div className="text-muted-foreground text-2xs uppercase mb-1">Source</div><div className="font-medium">{deal.source}</div></div>
                <div><div className="text-muted-foreground text-2xs uppercase mb-1">Owner</div><div className="font-medium">{owner?.name}</div></div>
                <div><div className="text-muted-foreground text-2xs uppercase mb-1">Expected Close</div><div className="font-mono">{deal.expectedCloseDate}</div></div>
                <div><div className="text-muted-foreground text-2xs uppercase mb-1">Created</div><div className="font-mono">{deal.createdAt}</div></div>
              </div>
              {deal.notes && <div className="pt-2 border-t border-border"><div className="text-2xs uppercase text-muted-foreground mb-1">Notes</div><div className="text-xs">{deal.notes}</div></div>}
            </TabsContent>
            <TabsContent value="activity" className="mt-3 bg-surface border border-border rounded-sm p-3 space-y-2">
              {activities.length === 0 ? <div className="text-xs text-muted-foreground p-4 text-center">No activity yet</div> : activities.map(a => (
                <div key={a.id} className="flex gap-2 p-2 rounded-sm hover:bg-surface-hover">
                  <div className="w-7 h-7 rounded-sm bg-primary/15 text-primary flex items-center justify-center text-2xs font-bold">{a.type[0]}</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{a.subject}</div>
                    <div className="text-3xs text-muted-foreground font-mono">{a.date} · {a.type}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="proposals" className="mt-3 bg-surface border border-border rounded-sm p-3 space-y-2">
              <div className="flex justify-end mb-2">
                <Button size="sm" className="h-7 text-xs gap-1" onClick={() => {
                  addProposal({ title: `Proposal for ${deal.name}`, dealId: deal.id, amount: deal.value, currency: deal.currency, status: "Draft", validTill: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10), ownerId: deal.ownerId });
                  toast({ title: "AI Proposal generated" });
                }}>
                  <FileText className="w-3.5 h-3.5" /> Generate Proposal (AI)
                </Button>
              </div>
              {proposals.length === 0 ? <div className="text-xs text-muted-foreground p-4 text-center">No proposals yet</div> : proposals.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-sm border border-border">
                  <div>
                    <div className="text-xs font-medium">{p.title}</div>
                    <div className="text-3xs text-muted-foreground font-mono">Valid till {p.validTill} · {p.currency === "USD" ? `$${p.amount.toLocaleString()}` : inr(p.amount)}</div>
                  </div>
                  <StatusPill variant={p.status === "Accepted" ? "success" : p.status === "Rejected" ? "danger" : p.status === "Sent" || p.status === "Viewed" ? "info" : "neutral"}>{p.status}</StatusPill>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="notes" className="mt-3 bg-surface border border-border rounded-sm p-4">
              <div className="text-xs text-muted-foreground">{deal.notes || "No notes"}</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-3">
          <div className="bg-surface border border-border rounded-sm p-3">
            <h4 className="text-2xs uppercase text-muted-foreground tracking-wider mb-2">AI Insights</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-success/10 border border-success/20 rounded-sm">
                <div className="text-2xs text-muted-foreground uppercase">Win Probability</div>
                <div className="text-xl font-mono font-bold text-success">{deal.probability}%</div>
              </div>
              <div className="p-2 bg-primary/5 rounded-sm">
                <div className="text-2xs font-medium text-primary mb-1">💡 ARIA suggests</div>
                <ul className="text-2xs space-y-1 text-muted-foreground">
                  <li>• Schedule a follow-up call within 3 days</li>
                  <li>• Send a tailored case study from {company?.industry ?? "this industry"}</li>
                  <li>• Loop in technical lead for the next demo</li>
                </ul>
              </div>
            </div>
          </div>

          {deal.leadId && (
            <div className="bg-surface border border-border rounded-sm p-3">
              <h4 className="text-2xs uppercase text-muted-foreground tracking-wider mb-2">Linked Lead</h4>
              <Link to={`/sales/leads/${deal.leadId}`} className="text-xs text-primary hover:underline">View original lead →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}