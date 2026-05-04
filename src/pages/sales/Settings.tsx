import { useEffect, useState } from "react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { StatusPill } from "@/components/ui/StatusPill";
import { SlideOver } from "@/components/ui/SlideOver";
import { useSalesStore, ALL_DEAL_STAGES } from "@/store/salesStore";
import { useToast } from "@/hooks/use-toast";
import { Plug, Sparkles, Workflow, Settings2, CheckCircle2 } from "lucide-react";

const INTEGRATIONS = [
  { id: "slack", name: "Slack", desc: "Get deal alerts in channels", icon: "💬" },
  { id: "gmail", name: "Gmail", desc: "Sync email threads to leads", icon: "📧" },
  { id: "calendar", name: "Google Calendar", desc: "Auto-log meetings as activities", icon: "📅" },
  { id: "twilio", name: "Twilio SMS/WhatsApp", desc: "Send WhatsApp from CRM", icon: "📱" },
  { id: "zoom", name: "Zoom", desc: "Auto-create meeting links", icon: "🎥" },
  { id: "linkedin", name: "LinkedIn Sales Nav", desc: "Sync contacts and conversations", icon: "in" },
  { id: "upwork", name: "Upwork", desc: "Auto-import job leads", icon: "U" },
  { id: "stripe", name: "Stripe", desc: "Sync payments with closed deals", icon: "💳" },
  { id: "hubspot", name: "HubSpot", desc: "Two-way contact sync", icon: "🟧" },
  { id: "zapier", name: "Zapier", desc: "Connect 5000+ apps", icon: "⚡" },
];

const AUTOMATIONS = [
  { id: "auto-assign", name: "Auto-assign new leads round-robin", desc: "Distribute incoming leads evenly across reps", on: true },
  { id: "follow-up", name: "Send follow-up email after 3 days of no contact", desc: "Trigger nurture sequence automatically", on: true },
  { id: "score", name: "Recalculate AI score on every update", desc: "Keep lead scores fresh as data changes", on: true },
  { id: "close-stale", name: "Mark deal as 'Lost' after 60 days inactivity", desc: "Auto-archive stale opportunities", on: false },
  { id: "won-handoff", name: "Notify PMS team when deal moves to Won", desc: "Trigger project kickoff workflow", on: true },
  { id: "forecast-alert", name: "Alert manager if forecast falls below 80% of target", desc: "Get early warning on quarterly performance", on: false },
];

export default function SalesSettings() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({});
  const [automations, setAutomations] = useState<Record<string, boolean>>(() => Object.fromEntries(AUTOMATIONS.map(a => [a.id, a.on])));
  const [open, setOpen] = useState<string | null>(null);
  const [creds, setCreds] = useState({ apiKey: "", workspace: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sales-integrations");
      if (saved) setIntegrations(JSON.parse(saved));
    } catch { /* noop */ }
  }, []);

  function connect(id: string) {
    if (!creds.apiKey) { toast({ title: "API key required", variant: "destructive" }); return; }
    const next = { ...integrations, [id]: true };
    setIntegrations(next);
    localStorage.setItem("sales-integrations", JSON.stringify(next));
    toast({ title: `Connected to ${INTEGRATIONS.find(i => i.id === id)?.name}` });
    setOpen(null);
    setCreds({ apiKey: "", workspace: "" });
  }

  function disconnect(id: string) {
    const next = { ...integrations, [id]: false };
    setIntegrations(next);
    localStorage.setItem("sales-integrations", JSON.stringify(next));
    toast({ title: `Disconnected from ${INTEGRATIONS.find(i => i.id === id)?.name}` });
  }

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Sales Settings" subtitle="Pipeline, integrations, automations" accentVar="--mod-sales" />
      <div className="p-3">
        <Tabs defaultValue="integrations">
          <TabsList className="h-9">
            <TabsTrigger value="integrations" className="text-xs gap-1"><Plug className="w-3.5 h-3.5" /> Integrations</TabsTrigger>
            <TabsTrigger value="automations" className="text-xs gap-1"><Workflow className="w-3.5 h-3.5" /> Automations</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1"><Sparkles className="w-3.5 h-3.5" /> AI</TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs gap-1"><Settings2 className="w-3.5 h-3.5" /> Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {INTEGRATIONS.map(i => {
                const on = integrations[i.id];
                return (
                  <div key={i.id} className="bg-surface border border-border rounded-sm p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-sm bg-muted flex items-center justify-center text-base shrink-0">{i.icon}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{i.name}</div>
                          <div className="text-3xs text-muted-foreground line-clamp-2">{i.desc}</div>
                        </div>
                      </div>
                      {on ? <StatusPill variant="success">Connected</StatusPill> : <StatusPill variant="neutral">Not Connected</StatusPill>}
                    </div>
                    <div className="mt-3 flex justify-end">
                      {on
                        ? <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => disconnect(i.id)}>Disconnect</Button>
                        : <Button size="sm" className="h-7 text-xs" onClick={() => setOpen(i.id)}>Connect</Button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="automations" className="mt-3">
            <div className="bg-surface border border-border rounded-sm divide-y divide-border">
              {AUTOMATIONS.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium">{a.name}</div>
                    <div className="text-2xs text-muted-foreground">{a.desc}</div>
                  </div>
                  <Switch checked={automations[a.id]} onCheckedChange={(v) => { setAutomations(s => ({ ...s, [a.id]: v })); toast({ title: `${a.name} ${v ? "enabled" : "disabled"}` }); }} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-3 max-w-2xl">
            <div className="bg-surface border border-border rounded-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">ARIA – Sales AI Assistant</h3>
                <StatusPill variant="success">Active</StatusPill>
              </div>
              <p className="text-xs text-muted-foreground">ARIA computes lead scores, win probabilities, suggests next-best actions, and drafts proposals. All scoring is computed locally with deterministic formulas.</p>
              <div className="space-y-2 pt-2 border-t border-border">
                {[
                  ["Auto lead scoring", true],
                  ["Win probability calculation", true],
                  ["Next-best-action suggestions", true],
                  ["Auto proposal drafting", true],
                  ["Anomaly alerts (deals stuck > 14d)", false],
                ].map(([label, on]) => (
                  <div key={label as string} className="flex items-center justify-between">
                    <div className="text-xs flex items-center gap-1.5">{on && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}{label}</div>
                    <Switch defaultChecked={on as boolean} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="mt-3 max-w-2xl">
            <div className="bg-surface border border-border rounded-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold">Deal Stages</h3>
              <p className="text-xs text-muted-foreground">Default probability per stage (used for forecasting).</p>
              <div className="space-y-1.5">
                {ALL_DEAL_STAGES.map((s, i) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-sm border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-xs font-medium">{s}</span>
                    </div>
                    <Input defaultValue={[15,30,50,70,90,100,0][i]} type="number" className="h-7 w-20 text-xs text-right" />
                  </div>
                ))}
              </div>
              <Button size="sm" className="h-7 text-xs" onClick={() => toast({ title: "Pipeline updated" })}>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SlideOver open={!!open} onClose={() => setOpen(null)} title={`Connect ${INTEGRATIONS.find(i => i.id === open)?.name ?? ""}`} width="md" footer={<><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setOpen(null)}>Cancel</Button><Button size="sm" className="h-8 text-xs" onClick={() => open && connect(open)}>Connect</Button></>}>
        <div className="space-y-3 p-1">
          <p className="text-xs text-muted-foreground">Enter your credentials. We'll securely store them and sync data automatically.</p>
          <div><Label className="text-xs">API Key *</Label><Input value={creds.apiKey} onChange={(e) => setCreds({ ...creds, apiKey: e.target.value })} placeholder="sk-..." className="h-8 text-xs font-mono" /></div>
          <div><Label className="text-xs">Workspace / Account ID</Label><Input value={creds.workspace} onChange={(e) => setCreds({ ...creds, workspace: e.target.value })} className="h-8 text-xs" /></div>
        </div>
      </SlideOver>
    </div>
  );
}