import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWowStore, peopleById } from "@/store/wowStore";
import { useCurrentUser } from "@/store/appStore";
import { PEOPLE } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";

export default function AssignTraining() {
  const { wows, assignTraining } = useWowStore();
  const user = useCurrentUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [due, setDue] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  const approved = wows.filter(w => w.status === "Approved" || w.status === "Training Assigned").filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) || w.type.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAssignee = (id: string) => setAssignees(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const confirm = () => {
    if (selected.length === 0 || assignees.length === 0) {
      toast({ title: "Pick WoWs and assignees", variant: "destructive" }); return;
    }
    assignTraining(selected, assignees, due || undefined, note || undefined, user.id);
    toast({ title: "Training assigned", description: `${selected.length} WoW(s) → ${assignees.length} trainee(s)` });
    setOpen(false); setSelected([]); setAssignees([]); setDue(""); setNote("");
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Assign Training"
        subtitle="Promote approved WoWs to training material"
        accentVar="--mod-wayofwork"
        actions={
          <Button size="sm" className="h-7 text-xs gap-1" disabled={selected.length === 0} onClick={() => setOpen(true)} style={{ background: "hsl(var(--mod-wayofwork))" }}>
            <GraduationCap className="w-3.5 h-3.5" /> Assign as Training ({selected.length})
          </Button>
        }
      />
      <FilterBar />
      <div className="p-3 flex-1">
        <Panel title="Approved WoWs" action={<Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="h-7 w-48 text-xs" />}>
          <DataTable
            rowKey={(r) => r.id} rows={approved}
            columns={[
              { key: "sel", label: "", render: (r) => <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggle(r.id)} /> },
              { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "type", label: "Type", render: (r) => <StatusPill variant="info">{r.type}</StatusPill> },
              { key: "owner", label: "Owner", render: (r) => peopleById(r.ownerId).name },
              { key: "frequency", label: "Frequency" },
              { key: "estTime", label: "Time", render: (r) => <span className="font-mono text-2xs">{r.estTime}m</span> },
            ]}
          />
        </Panel>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Assign {selected.length} WoW(s) as training</DialogTitle></DialogHeader>
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-2xs uppercase text-muted-foreground tracking-wider mb-1">Assignees</div>
              <div className="max-h-40 overflow-auto border border-border rounded-md p-2 space-y-1">
                {PEOPLE.map(p => (
                  <label key={p.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-surface-hover cursor-pointer">
                    <Checkbox checked={assignees.includes(p.id)} onCheckedChange={() => toggleAssignee(p.id)} />
                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center font-mono text-3xs font-bold">{p.initials}</div>
                    <span className="text-xs flex-1">{p.name}</span>
                    <span className="text-2xs text-muted-foreground">{p.dept}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="text-2xs uppercase text-muted-foreground tracking-wider mb-1">Due date (optional)</div>
              <Input type="date" value={due} onChange={e => setDue(e.target.value)} />
            </div>
            <div>
              <div className="text-2xs uppercase text-muted-foreground tracking-wider mb-1">Note to trainee (optional)</div>
              <Textarea value={note} onChange={e => setNote(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirm} style={{ background: "hsl(var(--mod-wayofwork))" }}>Confirm Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
