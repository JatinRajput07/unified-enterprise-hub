import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { SlideOver } from "@/components/ui/SlideOver";
import { useWowStore, peopleById, type TrainingStatus } from "@/store/wowStore";
import { Eye, Play, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WowDetail } from "./MyWows";
import { EmptyState } from "@/components/ui/EmptyState";

const variant: Record<TrainingStatus, any> = { "Not Started": "neutral", "In Progress": "info", "Completed": "success" };

export default function MyTraining() {
  const { trainings, wows, setTrainingStatus } = useWowStore();
  const [viewing, setViewing] = useState<string | null>(null);
  const wow = wows.find(w => w.id === viewing);

  const rows = trainings.map(t => ({ ...t, wow: wows.find(w => w.id === t.wowId)! })).filter(r => r.wow);

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="My Training" subtitle={`${trainings.length} assignments`} accentVar="--mod-wayofwork" />
      <FilterBar />
      <div className="p-3 flex-1">
        <Panel title="Assigned to me">
          {rows.length === 0 ? (
            <EmptyState title="No training assigned" subtitle="Approved WoWs assigned to you will appear here." />
          ) : (
            <DataTable
              rowKey={(r) => r.id} rows={rows}
              columns={[
                { key: "title", label: "WoW Title", render: (r) => <span className="font-medium">{r.wow.title}</span> },
                { key: "by", label: "Assigned By", render: (r) => peopleById(r.assignedById).name },
                { key: "type", label: "Type", render: (r) => <StatusPill variant="info">{r.wow.type}</StatusPill> },
                { key: "assignedAt", label: "Assigned", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.assignedAt}</span> },
                { key: "due", label: "Due", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.dueDate ?? "—"}</span> },
                { key: "progress", label: "Progress", render: (r) => {
                  const pct = r.status === "Completed" ? 100 : r.status === "In Progress" ? 50 : 0;
                  return (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
                      <span className="font-mono text-2xs">{pct}%</span>
                    </div>
                  );
                }},
                { key: "status", label: "Status", render: (r) => <StatusPill variant={variant[r.status]}>{r.status}</StatusPill> },
                { key: "actions", label: "Actions", render: (r) => (
                  <div className="flex gap-1">
                    <button onClick={() => setViewing(r.wow.id)} title="View" className="w-6 h-6 rounded hover:bg-surface-hover flex items-center justify-center"><Eye className="w-3.5 h-3.5" /></button>
                    {r.status === "Not Started" && (
                      <button onClick={() => { setTrainingStatus(r.id, "In Progress"); toast({ title: "Marked in progress" }); }} title="Start" className="w-6 h-6 rounded hover:bg-primary/10 text-primary flex items-center justify-center"><Play className="w-3.5 h-3.5" /></button>
                    )}
                    {r.status !== "Completed" && (
                      <button onClick={() => { setTrainingStatus(r.id, "Completed"); toast({ title: "Completed", description: "Assigner will be notified." }); }} title="Complete" className="w-6 h-6 rounded hover:bg-success/10 text-success flex items-center justify-center"><Check className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                )},
              ]}
            />
          )}
        </Panel>
      </div>

      <SlideOver open={!!wow} onClose={() => setViewing(null)} title={wow?.title ?? ""} width="xl">
        {wow && <WowDetail wow={wow} />}
      </SlideOver>
    </div>
  );
}
