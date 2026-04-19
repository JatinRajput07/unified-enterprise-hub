import { useAppStore, useCurrentUser } from "@/store/appStore";
import { HelpCircle, Keyboard } from "lucide-react";

export function Footer() {
  const user = useCurrentUser();
  const activeTeam = user.teams.find(t => t.id === user.activeTeamId);

  return (
    <footer className="h-8 bg-surface border-t border-border flex items-center px-3 gap-3 text-2xs text-muted-foreground shrink-0 font-mono">
      {/* Left */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        <span>System OK</span>
        <span className="text-muted-foreground/60">·</span>
        <span>v2.4.1</span>
      </div>

      <div className="h-3 w-px bg-border" />

      {/* Center: filters summary */}
      <div className="flex-1 truncate">
        <span className="text-muted-foreground/70">Filtered:</span>{" "}
        <span className="text-foreground/80">Q1 2025</span>
        <span className="text-muted-foreground/60 mx-1">·</span>
        <span className="text-foreground/80">Team: {activeTeam?.name}</span>
        <span className="text-muted-foreground/60 mx-1">·</span>
        <span className="text-foreground/80">Status: Active</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span><span className="text-success">●</span> 24 online</span>
        <span className="text-muted-foreground/60">·</span>
        <span>Synced 2m ago</span>
        <div className="h-3 w-px bg-border mx-1" />
        <button className="hover:text-foreground flex items-center gap-1"><HelpCircle className="w-3 h-3" /></button>
        <button className="hover:text-foreground flex items-center gap-1"><Keyboard className="w-3 h-3" /> ⌘?</button>
      </div>
    </footer>
  );
}
