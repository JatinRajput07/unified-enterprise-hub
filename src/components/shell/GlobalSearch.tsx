import { useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MODULES } from "@/lib/modules";

const RECENT = [
  { type: "Lead", title: "TechCorp - Q1 expansion", path: "/sales/leads" },
  { type: "Deal", title: "Acme Industries renewal", path: "/sales/deals" },
  { type: "Project", title: "Website redesign v3", path: "/pms" },
  { type: "Invoice", title: "INV-2025-0421", path: "/finance/invoices" },
  { type: "User", title: "Rahul Singh", path: "/system-admin/users" },
];

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSearchOpen]);

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-2 px-3 h-11 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            placeholder="Search leads, projects, invoices, users..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="font-mono text-2xs px-1.5 h-4 flex items-center bg-surface-hover rounded-sm border border-border">ESC</kbd>
        </div>
        <div className="max-h-[400px] overflow-auto">
          <div className="px-3 py-1.5 text-2xs uppercase tracking-wider text-muted-foreground bg-surface">Recent</div>
          {RECENT.map((r, i) => (
            <button
              key={i}
              onClick={() => { navigate(r.path); setSearchOpen(false); }}
              className="w-full flex items-center gap-3 px-3 h-9 text-xs hover:bg-surface-hover text-left"
            >
              <span className="text-2xs font-mono text-muted-foreground w-14 uppercase">{r.type}</span>
              <span className="flex-1 truncate">{r.title}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </button>
          ))}
          <div className="px-3 py-1.5 text-2xs uppercase tracking-wider text-muted-foreground bg-surface">Modules</div>
          {MODULES.map((m) => (
            <button
              key={m.key}
              onClick={() => { navigate(m.path); setSearchOpen(false); }}
              className="w-full flex items-center gap-3 px-3 h-9 text-xs hover:bg-surface-hover text-left"
            >
              <m.icon className="w-3.5 h-3.5" style={{ color: `hsl(var(${m.colorVar}))` }} />
              <span className="flex-1">{m.name}</span>
              <span className="text-2xs font-mono text-muted-foreground">{m.short}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
