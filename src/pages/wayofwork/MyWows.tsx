import { useState } from "react";
import { Link } from "react-router-dom";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { SlideOver } from "@/components/ui/SlideOver";
import { useWowStore, type WowStatus, type Wow } from "@/store/wowStore";
import { useCurrentUser } from "@/store/appStore";
import { Plus, Trash2, Send, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusVariant: Record<WowStatus, any> = {
  Draft: "neutral", Submitted: "info", Approved: "success", Rejected: "danger", "Training Assigned": "purple",
};

export default function MyWows() {
  const { wows, updateWow, deleteWow } = useWowStore();
  const user = useCurrentUser();
  const [viewing, setViewing] = useState<Wow | null>(null);

  // Show all WoWs in this prototype (single-user demo)
  const myWows = wows;

  const submit = (id: string) => {
    updateWow(id, { status: "Submitted", submittedAt: new Date().toISOString().slice(0, 10) });
    toast({ title: "Submitted for review", description: "Manager will be notified." });
  };
  const remove = (id: string) => {
    deleteWow(id);
    toast({ title: "Deleted" });
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="My WoWs"
        subtitle={`${myWows.length} documented work items`}
        accentVar="--mod-wayofwork"
        actions={
          <Link to="/wayofwork/create">
            <Button size="sm" className="h-7 text-xs gap-1" style={{ background: "hsl(var(--mod-wayofwork))" }}>
              <Plus className="w-3.5 h-3.5" /> New WoW
            </Button>
          </Link>
        }
      />
      <FilterBar />

      <div className="p-3 flex-1">
        <Panel title="All My WoWs">
          <DataTable
            rowKey={(r) => r.id} rows={myWows}
            columns={[
              { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "type", label: "Type", render: (r) => <StatusPill variant="info">{r.type}</StatusPill> },
              { key: "frequency", label: "Frequency" },
              { key: "estTime", label: "Time", render: (r) => <span className="font-mono text-2xs">{r.estTime}m</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill variant={statusVariant[r.status]}>{r.status}</StatusPill> },
              { key: "createdAt", label: "Created", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.createdAt}</span> },
              { key: "actions", label: "Actions", render: (r) => (
                <div className="flex gap-1">
                  <button onClick={() => setViewing(r)} title="View" className="w-6 h-6 rounded hover:bg-surface-hover flex items-center justify-center text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                  {(r.status === "Draft" || r.status === "Rejected") && (
                    <button onClick={() => submit(r.id)} title="Submit" className="w-6 h-6 rounded hover:bg-primary/10 flex items-center justify-center text-primary"><Send className="w-3.5 h-3.5" /></button>
                  )}
                  {r.status === "Draft" && (
                    <button onClick={() => remove(r.id)} title="Delete" className="w-6 h-6 rounded hover:bg-destructive/10 flex items-center justify-center text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              )},
            ]}
          />
        </Panel>
      </div>

      <SlideOver open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title ?? ""} subtitle={viewing ? `${viewing.type} · ${viewing.frequency}` : ""} width="xl">
        {viewing && <WowDetail wow={viewing} />}
      </SlideOver>
    </div>
  );
}

export function WowDetail({ wow }: { wow: Wow }) {
  return (
    <div className="space-y-4 text-xs">
      {wow.status === "Rejected" && wow.rejectionReason && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <div className="font-semibold text-destructive mb-1">Rejected</div>
          <div>{wow.rejectionReason}</div>
        </div>
      )}
      <Field label="Description"><p>{wow.description}</p></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Responsibility">{wow.responsibility}</Field>
        <Field label="Best time">{wow.bestTime}</Field>
        <Field label="Estimated time">{wow.estTime} min</Field>
        <Field label="Visibility">{wow.visibility}</Field>
      </div>
      <Field label="Steps">
        <ol className="space-y-1 list-decimal list-inside">{wow.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </Field>
      <Field label="Tools">
        <div className="flex flex-wrap gap-1">{wow.tools.map(t => <StatusPill key={t} variant="neutral">{t}</StatusPill>)}</div>
      </Field>
      {wow.notes && <Field label="Notes">{wow.notes}</Field>}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-2xs uppercase text-muted-foreground tracking-wider mb-1">{label}</div>
      <div>{children}</div>
    </div>
  );
}
