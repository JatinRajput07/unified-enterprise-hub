import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Input } from "@/components/ui/input";
import { SlideOver } from "@/components/ui/SlideOver";
import { useWowStore, peopleById } from "@/store/wowStore";
import { WowDetail } from "./MyWows";
import { Search, BookOpen } from "lucide-react";

export default function WowLibrary() {
  const { wows } = useWowStore();
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  const approved = wows.filter(w => w.status === "Approved" || w.status === "Training Assigned");
  const filtered = approved.filter(w =>
    w.title.toLowerCase().includes(q.toLowerCase()) ||
    w.type.toLowerCase().includes(q.toLowerCase()) ||
    w.tools.some(t => t.toLowerCase().includes(q.toLowerCase()))
  );

  const wow = wows.find(w => w.id === viewing);

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="WoW Library" subtitle={`${approved.length} approved · org-wide knowledge base`} accentVar="--mod-wayofwork" />
      <FilterBar />
      <div className="p-3">
        <div className="relative max-w-md mb-3">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, type, tool…" className="pl-8" />
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No WoWs match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(w => {
              const author = peopleById(w.ownerId);
              return (
                <button key={w.id} onClick={() => setViewing(w.id)} className="text-left bg-surface border border-border rounded-lg p-3 hover:border-primary hover:shadow-md transition-all">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "hsl(var(--mod-wayofwork) / 0.15)", color: "hsl(var(--mod-wayofwork))" }}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">{w.title}</h3>
                      <p className="text-2xs text-muted-foreground line-clamp-2">{w.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <StatusPill variant="info">{w.type}</StatusPill>
                    <StatusPill variant="neutral">{w.frequency}</StatusPill>
                  </div>
                  <div className="flex items-center justify-between text-2xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center font-mono text-3xs font-bold">{author.initials}</div>
                      <span>{author.name}</span>
                    </div>
                    <span className="font-mono">{w.createdAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <SlideOver open={!!wow} onClose={() => setViewing(null)} title={wow?.title ?? ""} width="xl">
        {wow && <WowDetail wow={wow} />}
      </SlideOver>
    </div>
  );
}
