import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Download, Upload, Sparkles, LayoutGrid, List, Search } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/StatusPill";
import { useSalesStore, ALL_LEAD_STATUSES, leadStatusVariant, priorityDot, type LeadStatus } from "@/store/salesStore";
import { PEOPLE, inr } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const peopleById = (id: string) => PEOPLE.find(p => p.id === id);

export default function Leads() {
  const leads = useSalesStore((s) => s.leads);
  const sources = useSalesStore((s) => s.sources);
  const setLeadStatus = useSalesStore((s) => s.setLeadStatus);
  const { toast } = useToast();

  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<"createdAt" | "aiScore" | "value">("createdAt");

  const filtered = useMemo(() => {
    let out = leads;
    if (search) {
      const s = search.toLowerCase();
      out = out.filter(l => l.title.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || `${l.firstName} ${l.lastName}`.toLowerCase().includes(s));
    }
    if (statusFilter !== "all") out = out.filter(l => l.status === statusFilter);
    out = [...out].sort((a, b) => {
      if (sortKey === "aiScore") return b.aiScore - a.aiScore;
      if (sortKey === "value") return (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0);
      return b.createdAt.localeCompare(a.createdAt);
    });
    return out;
  }, [leads, search, statusFilter, sortKey]);

  function toggleSelect(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }
  function toggleAll() {
    setSelected(s => s.length === filtered.length ? [] : filtered.map(l => l.id));
  }

  function bulkStatus(status: LeadStatus) {
    selected.forEach(id => setLeadStatus(id, status));
    toast({ title: `${selected.length} leads moved to ${status}` });
    setSelected([]);
  }

  // Kanban grouped
  const grouped = useMemo(() => {
    const g: Record<LeadStatus, typeof filtered> = { New: [], Contacted: [], Qualified: [], "Proposal Sent": [], Negotiation: [], Won: [], Lost: [], "On Hold": [] };
    filtered.forEach(l => g[l.status].push(l));
    return g;
  }, [filtered]);

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Leads"
        subtitle={`${leads.length} total · ${leads.filter(l => !["Won","Lost"].includes(l.status)).length} active`}
        accentVar="--mod-sales"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Upload className="w-3.5 h-3.5" /> Import</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3.5 h-3.5" /> Export</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Assign</Button>
            <Link to="/sales/leads/new"><Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3.5 h-3.5" /> New Lead</Button></Link>
          </>
        }
      />

      {/* Filter bar */}
      <div className="h-10 px-3 flex items-center gap-2 border-b border-border bg-surface/50 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads…" className="h-7 pl-7 w-56 text-xs" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-7 px-2 rounded-sm bg-background border border-border text-xs">
          <option value="all">All Status</option>
          {ALL_LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as any)} className="h-7 px-2 rounded-sm bg-background border border-border text-xs">
          <option value="createdAt">Sort: Newest</option>
          <option value="aiScore">Sort: AI Score</option>
          <option value="value">Sort: Value</option>
        </select>
        <div className="flex-1" />
        {selected.length > 0 && (
          <div className="flex items-center gap-1 bg-primary/10 px-2 h-7 rounded-sm">
            <span className="text-2xs font-medium text-primary">{selected.length} selected</span>
            <select onChange={(e) => e.target.value && bulkStatus(e.target.value as LeadStatus)} className="h-5 px-1 bg-transparent text-2xs border-0 text-primary">
              <option value="">Change status…</option>
              {ALL_LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div className="flex items-center bg-surface-hover rounded-sm p-0.5">
          <button onClick={() => setView("table")} className={`h-6 px-2 rounded-sm flex items-center gap-1 text-2xs ${view === "table" ? "bg-surface text-foreground" : "text-muted-foreground"}`}><List className="w-3 h-3" /> Table</button>
          <button onClick={() => setView("kanban")} className={`h-6 px-2 rounded-sm flex items-center gap-1 text-2xs ${view === "kanban" ? "bg-surface text-foreground" : "text-muted-foreground"}`}><LayoutGrid className="w-3 h-3" /> Kanban</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="p-3 flex-1">
          <div className="bg-surface border border-border rounded-sm overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 sticky top-0 z-10">
                <tr className="text-2xs uppercase text-muted-foreground tracking-wider">
                  <th className="w-8 px-3 h-8"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                  <th className="text-left px-3 h-8 font-medium">Lead</th>
                  <th className="text-left px-3 h-8 font-medium">Source</th>
                  <th className="text-left px-3 h-8 font-medium">Status</th>
                  <th className="text-left px-3 h-8 font-medium">Priority</th>
                  <th className="text-left px-3 h-8 font-medium">Owner</th>
                  <th className="text-right px-3 h-8 font-medium">Value</th>
                  <th className="text-center px-3 h-8 font-medium">AI Score</th>
                  <th className="text-left px-3 h-8 font-medium">Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const owner = peopleById(l.assigneeId);
                  const src = sources.find(s => s.id === l.sourceAccountId);
                  const scoreColor = l.aiScore >= 7 ? "bg-success" : l.aiScore >= 4 ? "bg-warning" : "bg-destructive";
                  return (
                    <tr key={l.id} className="border-t border-border hover:bg-surface-hover">
                      <td className="px-3 h-10"><input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggleSelect(l.id)} /></td>
                      <td className="px-3 h-10">
                        <Link to={`/sales/leads/${l.id}`} className="hover:text-primary">
                          <div className="font-medium truncate max-w-[260px]">{l.title}</div>
                          <div className="text-3xs text-muted-foreground truncate">{l.company} · {l.firstName} {l.lastName}</div>
                        </Link>
                      </td>
                      <td className="px-3 h-10">
                        <div>{l.sourcePlatform}</div>
                        <div className="text-3xs text-muted-foreground truncate max-w-[140px]">{src?.displayName ?? "—"}</div>
                      </td>
                      <td className="px-3 h-10"><StatusPill variant={leadStatusVariant(l.status)}>{l.status}</StatusPill></td>
                      <td className="px-3 h-10"><span className="text-xs">{priorityDot(l.priority)} {l.priority}</span></td>
                      <td className="px-3 h-10">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-3xs font-bold">{owner?.initials}</div>
                          <span className="truncate max-w-[100px]">{owner?.name}</span>
                        </div>
                      </td>
                      <td className="px-3 h-10 text-right font-mono">{inr(l.estimatedValue ?? 0)}</td>
                      <td className="px-3 h-10">
                        <div className="flex items-center justify-center gap-1.5" title={`AI Score: ${l.aiScore}/10`}>
                          <div className="w-12 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                            <div className={`h-full ${scoreColor}`} style={{ width: `${l.aiScore * 10}%` }} />
                          </div>
                          <span className="font-mono text-2xs w-7">{l.aiScore}</span>
                        </div>
                      </td>
                      <td className="px-3 h-10 font-mono text-2xs text-muted-foreground">{l.followUpDate}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">No leads match filters</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-3 flex-1 overflow-x-auto">
          <div className="flex gap-2 min-w-max h-full">
            {ALL_LEAD_STATUSES.map(stage => (
              <div key={stage} className="w-64 shrink-0 bg-surface border border-border rounded-sm flex flex-col">
                <div className="h-9 px-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full bg-mod-sales`} style={{ background: `hsl(var(--${leadStatusVariant(stage) === "success" ? "success" : leadStatusVariant(stage) === "danger" ? "destructive" : "primary"}))` }} />
                    <h4 className="text-xs font-semibold">{stage}</h4>
                  </div>
                  <span className="text-2xs font-mono text-muted-foreground">{grouped[stage].length}</span>
                </div>
                <div className="p-1.5 flex-1 overflow-auto space-y-1.5">
                  {grouped[stage].map(l => {
                    const owner = peopleById(l.assigneeId);
                    return (
                      <Link key={l.id} to={`/sales/leads/${l.id}`} className="block bg-background border border-border rounded-sm p-2 hover:border-primary hover:shadow-sm">
                        <div className="text-xs font-medium line-clamp-2 mb-1">{l.title}</div>
                        <div className="text-3xs text-muted-foreground truncate mb-1.5">{l.company}</div>
                        <div className="flex items-center justify-between text-2xs">
                          <span className="font-mono font-bold">{inr(l.estimatedValue ?? 0)}</span>
                          <div className="flex items-center gap-1">
                            <span title="AI Score" className="font-mono text-muted-foreground">⭐{l.aiScore}</span>
                            <div className="w-4 h-4 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-3xs font-bold">{owner?.initials}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {grouped[stage].length === 0 && <div className="text-center py-6 text-3xs text-muted-foreground">Empty</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
