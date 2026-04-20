import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWowStore, peopleById } from "@/store/wowStore";
import { useCurrentUser } from "@/store/appStore";
import { Check, X, AlertTriangle, Inbox } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WowDetail } from "./MyWows";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ReviewQueue() {
  const { wows, approveWow, rejectWow } = useWowStore();
  const user = useCurrentUser();
  const pending = wows.filter(w => w.status === "Submitted");
  const [selected, setSelected] = useState<string | null>(pending[0]?.id ?? null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectMode, setRejectMode] = useState<"reject" | "changes">("reject");

  const isReviewer = ["MANAGER","DEPT_HEAD","SUPER_ADMIN"].includes(user.role);
  const current = pending.find(w => w.id === selected);

  if (!isReviewer) {
    return (
      <div className="flex flex-col min-h-full">
        <ModuleHeader title="Review Queue" subtitle="Manager / Admin only" accentVar="--mod-wayofwork" />
        <EmptyState icon={<AlertTriangle className="w-6 h-6" />} title="Access restricted" subtitle="Switch to a Manager, Dept Head, or Admin user to review WoWs." />
      </div>
    );
  }

  const approve = (id: string) => {
    approveWow(id);
    toast({ title: "Approved", description: "Employee will be notified." });
    setSelected(pending.find(w => w.id !== id)?.id ?? null);
  };
  const doReject = () => {
    if (!current || !reason.trim()) return;
    rejectWow(current.id, reason);
    toast({ title: rejectMode === "changes" ? "Changes requested" : "Rejected", description: "Employee will be notified with your reason." });
    setRejectOpen(false); setReason("");
    setSelected(pending.find(w => w.id !== current.id)?.id ?? null);
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Review Queue" subtitle={`${pending.length} pending`} accentVar="--mod-wayofwork" />
      <FilterBar />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[35%_1fr] min-h-0">
        <div className="border-r border-border overflow-auto">
          {pending.length === 0 ? (
            <EmptyState icon={<Inbox className="w-6 h-6" />} title="Queue is clear" subtitle="No WoWs awaiting review." />
          ) : (
            pending.map(w => {
              const author = peopleById(w.ownerId);
              return (
                <button key={w.id} onClick={() => setSelected(w.id)}
                  className={`w-full text-left p-3 border-b border-border hover:bg-surface-hover ${selected === w.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center font-mono text-3xs font-bold">{author.initials}</div>
                    <span className="text-xs font-medium">{author.name}</span>
                  </div>
                  <div className="text-sm font-semibold mb-1">{w.title}</div>
                  <div className="flex items-center gap-2 text-2xs text-muted-foreground">
                    <StatusPill variant="info">{w.type}</StatusPill>
                    <span className="font-mono">{w.submittedAt}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="overflow-auto">
          {current ? (
            <div className="flex flex-col h-full">
              <div className="p-4 flex-1 overflow-auto">
                <h2 className="text-base font-semibold mb-1">{current.title}</h2>
                <div className="text-2xs text-muted-foreground font-mono mb-4">By {peopleById(current.ownerId).name} · Submitted {current.submittedAt}</div>
                <WowDetail wow={current} />
              </div>
              <div className="border-t border-border p-3 flex items-center justify-end gap-2 bg-surface">
                <Button variant="outline" size="sm" className="h-8 gap-1 text-warning border-warning/40" onClick={() => { setRejectMode("changes"); setRejectOpen(true); }}>
                  <AlertTriangle className="w-3.5 h-3.5" /> Request Changes
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive border-destructive/40" onClick={() => { setRejectMode("reject"); setRejectOpen(true); }}>
                  <X className="w-3.5 h-3.5" /> Reject
                </Button>
                <Button size="sm" className="h-8 gap-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => approve(current.id)}>
                  <Check className="w-3.5 h-3.5" /> Approve
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState icon={<Check className="w-6 h-6" />} title="All caught up" subtitle="Select a WoW from the list to review." />
          )}
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{rejectMode === "changes" ? "Request changes" : "Reject WoW"}</DialogTitle></DialogHeader>
          <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (required) — this will be sent to the author" rows={5} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button onClick={doReject} disabled={!reason.trim()} className={rejectMode === "changes" ? "bg-warning text-warning-foreground hover:bg-warning/90" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
