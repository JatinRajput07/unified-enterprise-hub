import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyReportsStore, todayDate, type TaskItem, type ReportMood } from "@/store/dailyReportsStore";
import { useCurrentUser } from "@/store/appStore";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Smile, Meh, Frown, AlertTriangle } from "lucide-react";

const ACCENT = "hsl(var(--mod-dailyreports))";

const MOODS: { key: ReportMood; label: string; icon: any; color: string }[] = [
  { key: "great", label: "Great", icon: Smile, color: "hsl(var(--success))" },
  { key: "good", label: "Good", icon: Smile, color: "hsl(var(--mod-finance))" },
  { key: "ok", label: "OK", icon: Meh, color: "hsl(var(--warning))" },
  { key: "blocked", label: "Blocked", icon: AlertTriangle, color: "hsl(var(--destructive))" },
];

export default function SubmitReport() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const addReport = useDailyReportsStore(s => s.addReport);
  const existing = useDailyReportsStore(s => s.reports.find(r => r.date === todayDate() && r.userId === user.id));

  const [date, setDate] = useState(existing?.date ?? todayDate());
  const [mood, setMood] = useState<ReportMood>(existing?.mood ?? "good");
  const [tasks, setTasks] = useState<TaskItem[]>(existing?.tasks ?? [
    { id: crypto.randomUUID(), title: "", status: "done", hours: 1, project: "" },
  ]);
  const [accomplishments, setAccomplishments] = useState(existing?.accomplishments ?? "");
  const [blockers, setBlockers] = useState(existing?.blockers ?? "");
  const [tomorrowPlan, setTomorrowPlan] = useState(existing?.tomorrowPlan ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  const totalHours = tasks.reduce((s, t) => s + (Number(t.hours) || 0), 0);

  const updateTask = (id: string, patch: Partial<TaskItem>) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  const addTask = () =>
    setTasks(prev => [...prev, { id: crypto.randomUUID(), title: "", status: "done", hours: 1, project: "" }]);
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const handleSubmit = () => {
    if (!tasks.some(t => t.title.trim())) {
      toast({ title: "Add at least one task", variant: "destructive" });
      return;
    }
    if (!accomplishments.trim()) {
      toast({ title: "Accomplishments required", variant: "destructive" });
      return;
    }
    addReport({
      id: existing?.id ?? `dr-${date}-${user.id}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      department: user.departmentId,
      date,
      submittedAt: new Date().toISOString(),
      mood,
      totalHours,
      tasks: tasks.filter(t => t.title.trim()),
      accomplishments,
      blockers,
      tomorrowPlan,
      notes,
    });
    toast({ title: existing ? "Report updated" : "Report submitted", description: `${totalHours}h logged for ${date}` });
    navigate("/daily-reports/my");
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title={existing ? "Update Today's Report" : "Submit Daily Report"}
        subtitle="End-of-day work summary"
        accentVar="--mod-dailyreports"
      />

      <div className="p-4 max-w-4xl mx-auto w-full space-y-4">
        {/* Header section */}
        <div className="bg-surface border border-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-8 text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs">Total Hours</Label>
            <div className="h-8 mt-1 px-3 rounded-md border border-border bg-muted/30 flex items-center text-sm font-mono font-semibold" style={{ color: ACCENT }}>
              {totalHours}h
            </div>
          </div>
          <div>
            <Label className="text-xs">How was your day?</Label>
            <div className="flex gap-1 mt-1">
              {MOODS.map(m => {
                const Icon = m.icon;
                const active = mood === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMood(m.key)}
                    className={`flex-1 h-8 rounded-md border text-2xs flex items-center justify-center gap-1 transition ${active ? "border-2" : "border-border hover:bg-surface-hover"}`}
                    style={active ? { borderColor: m.color, color: m.color, background: `${m.color}15` } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Tasks Worked On</h3>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addTask}>
              <Plus className="w-3.5 h-3.5" /> Add Task
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.map((t, idx) => (
              <div key={t.id} className="grid grid-cols-12 gap-2 items-center">
                <Input
                  className="h-8 text-sm col-span-5"
                  placeholder={`Task ${idx + 1} title`}
                  value={t.title}
                  onChange={e => updateTask(t.id, { title: e.target.value })}
                />
                <Input
                  className="h-8 text-sm col-span-3"
                  placeholder="Project / Client"
                  value={t.project ?? ""}
                  onChange={e => updateTask(t.id, { project: e.target.value })}
                />
                <Select value={t.status} onValueChange={(v: any) => updateTask(t.id, { status: v })}>
                  <SelectTrigger className="h-8 text-xs col-span-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number" min={0} step={0.5}
                  className="h-8 text-sm col-span-1"
                  value={t.hours}
                  onChange={e => updateTask(t.id, { hours: Number(e.target.value) })}
                />
                <Button size="icon" variant="ghost" className="h-8 w-8 col-span-1" onClick={() => removeTask(t.id)} disabled={tasks.length === 1}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <Label className="text-xs">Key Accomplishments *</Label>
            <Textarea rows={4} className="mt-1 text-sm" placeholder="What did you achieve today?" value={accomplishments} onChange={e => setAccomplishments(e.target.value)} />
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <Label className="text-xs">Blockers / Challenges</Label>
            <Textarea rows={4} className="mt-1 text-sm" placeholder="Anything blocking you?" value={blockers} onChange={e => setBlockers(e.target.value)} />
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <Label className="text-xs">Plan for Tomorrow</Label>
            <Textarea rows={4} className="mt-1 text-sm" placeholder="What will you focus on tomorrow?" value={tomorrowPlan} onChange={e => setTomorrowPlan(e.target.value)} />
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <Label className="text-xs">Additional Notes</Label>
            <Textarea rows={4} className="mt-1 text-sm" placeholder="Anything else for your manager?" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-2 sticky bottom-0 bg-background py-3 border-t border-border">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate(-1)}>Cancel</Button>
          <Button size="sm" className="h-8 text-xs" style={{ background: ACCENT }} onClick={handleSubmit}>
            {existing ? "Update Report" : "Submit Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}