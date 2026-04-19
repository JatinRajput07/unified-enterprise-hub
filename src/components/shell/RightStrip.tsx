import { Pin, Clock, MessageSquare, Paperclip, BarChart3, Calendar, Timer, Link2 } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const items = [
  { id: "pinned", icon: Pin, label: "Pinned" },
  { id: "recent", icon: Clock, label: "Recent Activity" },
  { id: "chat", icon: MessageSquare, label: "Internal Chat" },
  { id: "files", icon: Paperclip, label: "Attachments" },
  { id: "stats", icon: BarChart3, label: "Quick Stats" },
  { id: "calendar", icon: Calendar, label: "Mini Calendar" },
  { id: "timer", icon: Timer, label: "Time Tracker" },
  { id: "links", icon: Link2, label: "Quick Links" },
];

export function RightStrip() {
  const { rightPanel, setRightPanel } = useAppStore();
  return (
    <TooltipProvider delayDuration={150}>
      <aside className="w-8 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-2 gap-0.5 shrink-0 relative z-10">
        {items.map((it) => {
          const Icon = it.icon;
          const active = rightPanel === it.id;
          return (
            <Tooltip key={it.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setRightPanel(it.id)}
                  className={cn(
                    "w-7 h-7 rounded-sm flex items-center justify-center transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">{it.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}

export function RightPanel() {
  const { rightPanel, setRightPanel } = useAppStore();
  if (!rightPanel) return null;
  const item = items.find((i) => i.id === rightPanel);
  if (!item) return null;
  const Icon = item.icon;

  return (
    <div className="absolute top-12 bottom-8 right-8 w-[300px] bg-surface-elevated border-l border-border shadow-lg z-20 flex flex-col animate-slide-in-right">
      <div className="h-10 px-3 flex items-center gap-2 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold">{item.label}</span>
        <button onClick={() => setRightPanel(null)} className="ml-auto text-muted-foreground hover:text-foreground text-xs">✕</button>
      </div>
      <div className="flex-1 overflow-auto p-3 text-xs text-muted-foreground">
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-2 bg-surface border border-border rounded-sm">
              <div className="text-foreground font-medium">{item.label} item #{i + 1}</div>
              <div className="text-3xs mt-1 font-mono">2 hours ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
