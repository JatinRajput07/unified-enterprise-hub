import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWowStore, type WowType, type WowFreq } from "@/store/wowStore";
import { useCurrentUser } from "@/store/appStore";
import { toast } from "@/hooks/use-toast";
import { Plus, X, GripVertical, Save, Send, ArrowUp, ArrowDown } from "lucide-react";

const TYPES: WowType[] = ["Workflow","Activity","Process","SOP","Checklist","Report","Meeting","Other"];
const FREQS: WowFreq[] = ["Daily","Weekly","Bi-weekly","Monthly","Quarterly","Ad-hoc","One-time"];
const BEST_TIMES = ["Morning","Afternoon","End of Day","Anytime"];
const VIS = ["Team","Department","Organization"] as const;

export default function CreateWow() {
  const nav = useNavigate();
  const user = useCurrentUser();
  const { addWow } = useWowStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [type, setType] = useState<WowType>("Process");
  const [frequency, setFrequency] = useState<WowFreq>("Weekly");
  const [estTime, setEstTime] = useState(30);
  const [unit, setUnit] = useState<"min" | "hr">("min");
  const [bestTime, setBestTime] = useState("Anytime");
  const [steps, setSteps] = useState<string[]>([""]);
  const [toolInput, setToolInput] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [attachments, setAttachments] = useState<{ name: string; kind: "file" | "link"; url?: string }[]>([]);
  const [visibility, setVisibility] = useState<typeof VIS[number]>("Team");
  const [notes, setNotes] = useState("");

  const submit = (status: "Draft" | "Submitted") => {
    if (!title.trim() || !description.trim() || !responsibility.trim()) {
      toast({ title: "Missing fields", description: "Title, description, and responsibility are required.", variant: "destructive" });
      return;
    }
    const id = addWow({
      title, description, responsibility, type, frequency,
      estTime: unit === "hr" ? estTime * 60 : estTime,
      bestTime, steps: steps.filter(Boolean), tools, attachments,
      visibility, notes, ownerId: user.id, status,
      submittedAt: status === "Submitted" ? new Date().toISOString().slice(0, 10) : undefined,
    });
    toast({ title: status === "Draft" ? "Saved as draft" : "Submitted for review", description: title });
    nav("/wayofwork/my-wows");
  };

  const addTool = () => {
    if (toolInput.trim() && !tools.includes(toolInput.trim())) setTools([...tools, toolInput.trim()]);
    setToolInput("");
  };
  const addLink = () => {
    if (linkInput.trim()) {
      setAttachments([...attachments, { name: linkTitle.trim() || linkInput.trim(), kind: "link", url: linkInput.trim() }]);
      setLinkInput(""); setLinkTitle("");
    }
  };
  const moveStep = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps]; [next[i], next[j]] = [next[j], next[i]]; setSteps(next);
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Create WoW"
        subtitle="Document a process, workflow, SOP, or checklist"
        accentVar="--mod-wayofwork"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => submit("Draft")}><Save className="w-3.5 h-3.5" /> Save Draft</Button>
            <Button size="sm" className="h-7 text-xs gap-1" style={{ background: "hsl(var(--mod-wayofwork))" }} onClick={() => submit("Submitted")}>
              <Send className="w-3.5 h-3.5" /> Submit for Review
            </Button>
          </>
        }
      />
      <div className="flex-1 overflow-auto p-4 max-w-4xl mx-auto w-full space-y-6">
        <Section title="Basic Info">
          <FieldRow><Label>Title *</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Daily Standup Facilitation" /></FieldRow>
          <FieldRow><Label>Description *</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What this work is, why it matters, the outcome." rows={4} /></FieldRow>
          <FieldRow><Label>Responsibility *</Label><Input value={responsibility} onChange={e => setResponsibility(e.target.value)} placeholder="e.g. Engineering Lead" /></FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as WowType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Frequency *</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as WowFreq)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{FREQS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Time & Effort">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label>Estimated time per occurrence *</Label>
              <div className="flex gap-2">
                <Input type="number" value={estTime} onChange={e => setEstTime(parseInt(e.target.value) || 0)} />
                <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="min">minutes</SelectItem><SelectItem value="hr">hours</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Best time</Label>
              <Select value={bestTime} onValueChange={setBestTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BEST_TIMES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Steps / Process">
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-2xs text-muted-foreground w-5">{i + 1}.</span>
                <Input value={s} onChange={e => { const n = [...steps]; n[i] = e.target.value; setSteps(n); }} placeholder="Step description" />
                <button onClick={() => moveStep(i, -1)} className="w-7 h-7 rounded hover:bg-surface-hover flex items-center justify-center"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => moveStep(i, 1)} className="w-7 h-7 rounded hover:bg-surface-hover flex items-center justify-center"><ArrowDown className="w-3.5 h-3.5" /></button>
                <button onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="w-7 h-7 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {steps.length < 20 && (
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setSteps([...steps, ""])}>
                <Plus className="w-3.5 h-3.5" /> Add Step
              </Button>
            )}
          </div>
        </Section>

        <Section title="Tools & Systems">
          <div className="flex gap-2">
            <Input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTool())} placeholder="Type and press Enter (e.g. Slack)" />
            <Button variant="outline" size="sm" onClick={addTool}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tools.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 h-6 bg-primary/10 text-primary rounded-md text-2xs font-medium">
                {t}
                <button onClick={() => setTools(tools.filter(x => x !== t))}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </Section>

        <Section title="Attachments & Links">
          <div className="grid grid-cols-3 gap-2">
            <Input className="col-span-1" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="Link title" />
            <Input className="col-span-1" value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="https://..." />
            <Button variant="outline" size="sm" onClick={addLink}>Add Link</Button>
          </div>
          <div className="space-y-1 mt-2">
            {attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-muted/40 rounded-md text-xs">
                <span className="flex-1 truncate"><span className="font-medium">{a.name}</span> <span className="text-muted-foreground">{a.url}</span></span>
                <button onClick={() => setAttachments(attachments.filter((_, j) => j !== i))}><X className="w-3.5 h-3.5 text-destructive" /></button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Visibility & Notes">
          <div><Label>Visible to</Label>
            <Select value={visibility} onValueChange={(v) => setVisibility(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{VIS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <FieldRow><Label>Notes / Tips</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></FieldRow>
        </Section>
      </div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}
