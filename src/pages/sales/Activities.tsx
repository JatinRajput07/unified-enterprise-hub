import { useMemo, useState } from "react";
import { Plus, Phone, Mail, Calendar, FileText, MessageSquare, Bell } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SlideOver } from "@/components/ui/SlideOver";
import { useSalesStore, type Activity } from "@/store/salesStore";
import { PEOPLE } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const ICONS: Record<Activity["type"], any> = {
  Call: Phone, Email: Mail, Meeting: Calendar, Demo: Calendar, Proposal: FileText, "Follow-up": Bell, Note: MessageSquare, "Status Change": Bell, Created: Plus, Assigned: Bell, "AI Action": Bell, Other: MessageSquare,
};

export default function Activities() {
  const activities = useSalesStore((s) => s.activities);
  const leads = useSalesStore((s) => s.leads);
  const logActivity = useSalesStore((s) => s.logActivity);
  const { toast } = useToast();
  const [filter, setFilter] = useState<Activity["type"] | "all">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Activity, "id">>({ type: "Call", subject: "", description: "", date: new Date().toISOString().slice(0, 10), byId: "p2", leadId: "" });

  const filtered = useMemo(() => {
    const s = filter === "all" ? activities : activities.filter(a => a.type === filter);
    return [...s].sort((a, b) => b.date.localeCompare(a.date));
  }, [activities, filter]);

  function submit() {
    if (!form.subject) { toast({ title: "Subject required", variant: "destructive" }); return; }
    logActivity(form);
    toast({ title: "Activity logged" });
    setOpen(false);
    setForm({ type: "Call", subject: "", description: "", date: new Date().toISOString().slice(0, 10), byId: "p2", leadId: "" });
  }

  const types: (Activity["type"] | "all")[] = ["all","Call","Email","Meeting","Demo","Proposal","Follow-up","Note"];

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Activities"
        subtitle={`${activities.length} logged · ${activities.filter(a => a.date === new Date().toISOString().slice(0, 10)).length} today`}
        accentVar="--mod-sales"
        actions={<Button size="sm" className="h-7 text-xs gap-1" onClick={() => setOpen(true)}><Plus className="w-3.5 h-3.5" /> Log Activity</Button>}
      />
      <div className="h-10 px-3 flex items-center gap-1 border-b border-border bg-surface/50 overflow-x-auto">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`h-7 px-3 rounded-sm text-xs whitespace-nowrap ${filter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-hover"}`}>
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>
      <div className="p-3 flex-1 max-w-4xl">
        <div className="bg-surface border border-border rounded-sm">
          {filtered.map((a, i) => {
            const Icon = ICONS[a.type] ?? MessageSquare;
            const lead = leads.find(l => l.id === a.leadId);
            const by = PEOPLE.find(p => p.id === a.byId);
            return (
              <div key={a.id} className={`flex gap-3 p-3 ${i > 0 ? "border-t border-border" : ""} hover:bg-surface-hover`}>
                <div className="w-8 h-8 rounded-sm bg-primary/15 text-primary flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium">{a.subject}</div>
                    <div className="text-3xs text-muted-foreground font-mono shrink-0">{a.date}</div>
                  </div>
                  {a.description && <div className="text-2xs text-muted-foreground mt-0.5">{a.description}</div>}
                  <div className="flex items-center gap-2 mt-1 text-3xs text-muted-foreground">
                    <span>{a.type}</span>
                    {by && <><span>·</span><span>{by.name}</span></>}
                    {lead && <><span>·</span><span className="text-primary">{lead.title}</span></>}
                    {a.outcome && <><span>·</span><span>{a.outcome}</span></>}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-xs">No activities</div>}
        </div>
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)} title="Log Activity" footer={<><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setOpen(false)}>Cancel</Button><Button size="sm" className="h-8 text-xs" onClick={submit}>Log</Button></>}>
        <div className="space-y-3 p-1">
          <div><Label className="text-xs">Type</Label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Activity["type"] })} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
              {(["Call","Email","Meeting","Demo","Proposal","Follow-up","Note","Other"] as const).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Subject *</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-8 text-xs" /></div>
          <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="text-xs" /></div>
          <div><Label className="text-xs">Lead (optional)</Label>
            <select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
              <option value="">— None —</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-8 text-xs" /></div>
        </div>
      </SlideOver>
    </div>
  );
}