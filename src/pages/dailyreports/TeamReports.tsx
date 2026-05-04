import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { useDailyReportsStore } from "@/store/dailyReportsStore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

const ACCENT = "hsl(var(--mod-dailyreports))";

export default function TeamReports() {
  const reports = useDailyReportsStore(s => s.reports);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return reports
      .filter(r => moodFilter === "all" || r.mood === moodFilter)
      .filter(r => !dateFilter || r.date === dateFilter)
      .filter(r => !search || r.userName.toLowerCase().includes(search.toLowerCase()) || r.accomplishments.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date) || b.submittedAt.localeCompare(a.submittedAt));
  }, [reports, search, moodFilter, dateFilter]);

  const toggle = (id: string) => {
    const n = new Set(expanded);
    n.has(id) ? n.delete(id) : n.add(id);
    setExpanded(n);
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Team Reports" subtitle={`${filtered.length} reports across the team`} accentVar="--mod-dailyreports" />
      <FilterBar />

      <div className="p-3 flex flex-wrap gap-2 items-center border-b border-border">
        <Input placeholder="Search by person or content..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs max-w-xs" />
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="h-8 text-xs w-40" />
        <Select value={moodFilter} onValueChange={setMoodFilter}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All moods</SelectItem>
            <SelectItem value="great">Great</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="ok">OK</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-3 space-y-2">
        {filtered.map(r => {
          const isOpen = expanded.has(r.id);
          return (
            <div key={r.id} className="bg-surface border border-border rounded-lg">
              <button onClick={() => toggle(r.id)} className="w-full p-3 flex items-center gap-3 text-left hover:bg-surface-hover rounded-lg">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{r.userAvatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.userName}</span>
                    <span className="text-2xs text-muted-foreground font-mono">{r.date}</span>
                    <span className="text-2xs uppercase px-1.5 py-0.5 rounded" style={{ background: `${ACCENT}20`, color: ACCENT }}>{r.mood}</span>
                  </div>
                  <div className="text-2xs text-muted-foreground truncate mt-0.5">{r.accomplishments}</div>
                </div>
                <span className="text-2xs text-muted-foreground flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" />{r.totalHours}h</span>
                {r.mood === "blocked" ? <AlertTriangle className="w-4 h-4 text-destructive shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                  <div>
                    <div className="text-2xs uppercase font-semibold text-muted-foreground mb-1">Tasks ({r.tasks.length})</div>
                    <div className="space-y-1">
                      {r.tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-2 h-2 rounded-full ${t.status === "done" ? "bg-success" : t.status === "blocked" ? "bg-destructive" : "bg-warning"}`} />
                          <span className="flex-1 truncate">{t.title}</span>
                          {t.project && <span className="text-2xs text-muted-foreground">{t.project}</span>}
                          <span className="text-2xs font-mono">{t.hours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div><div className="text-2xs uppercase font-semibold text-muted-foreground mb-1">Accomplishments</div><p>{r.accomplishments}</p></div>
                    <div><div className="text-2xs uppercase font-semibold text-muted-foreground mb-1">Blockers</div><p className={r.blockers ? "text-destructive" : "text-muted-foreground"}>{r.blockers || "None"}</p></div>
                    <div><div className="text-2xs uppercase font-semibold text-muted-foreground mb-1">Tomorrow</div><p>{r.tomorrowPlan}</p></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}