import { useLocation } from "react-router-dom";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { getModuleByPath } from "@/lib/modules";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  const location = useLocation();
  const mod = getModuleByPath(location.pathname);
  const sub = mod.submenu.find(s => s.path === location.pathname);

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title={sub?.label ?? mod.name}
        subtitle={`${mod.name} · ${mod.submenu.length} sections`}
        accentVar={mod.colorVar}
      />
      <FilterBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div
            className="w-12 h-12 rounded-sm mx-auto flex items-center justify-center mb-3"
            style={{ background: `hsl(var(${mod.colorVar}) / 0.15)`, color: `hsl(var(${mod.colorVar}))` }}
          >
            <Construction className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-semibold mb-1">{sub?.label ?? mod.name}</h2>
          <p className="text-xs text-muted-foreground">
            This module's UI is scaffolded. Drop a request to flesh out KPIs, tables, and workflows for{" "}
            <span className="font-mono text-foreground">{mod.short}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
