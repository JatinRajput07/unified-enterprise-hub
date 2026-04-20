import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useWowStore, type Automation } from "@/store/wowStore";
import { Plus, Zap } from "lucide-react";

interface Props {
  moduleAccent: string;
  moduleName: string;
}

/** Reusable automations page — also used by other modules via wrapper. */
export function AutomationsPage({ moduleAccent, moduleName, automations, onToggle }: Props & {
  automations: Automation[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Automations"
        subtitle={`${moduleName} · ${automations.filter(a => a.active).length} of ${automations.length} active`}
        accentVar={moduleAccent}
        actions={
          <Button size="sm" className="h-7 text-xs gap-1" style={{ background: `hsl(var(${moduleAccent}))` }}>
            <Plus className="w-3.5 h-3.5" /> New Automation
          </Button>
        }
      />
      <FilterBar />
      <div className="p-3 space-y-2">
        {automations.map(a => (
          <div key={a.id} className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: `hsl(var(${moduleAccent}) / 0.15)`, color: `hsl(var(${moduleAccent}))` }}>
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{a.name}</div>
              <div className="text-2xs text-muted-foreground mt-0.5">
                <span className="font-mono">When</span> {a.trigger} → <span className="font-mono">Then</span> {a.action}
              </div>
            </div>
            <div className="text-2xs text-muted-foreground font-mono">{a.lastTriggered ?? "Never"}</div>
            <StatusPill variant={a.active ? "success" : "neutral"}>{a.active ? "Active" : "Inactive"}</StatusPill>
            <Switch checked={a.active} onCheckedChange={() => onToggle(a.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WowAutomations() {
  const { automations, toggleAutomation } = useWowStore();
  return <AutomationsPage moduleAccent="--mod-wayofwork" moduleName="WayOfWork" automations={automations} onToggle={toggleAutomation} />;
}
