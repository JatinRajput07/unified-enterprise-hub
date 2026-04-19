import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Eye } from "lucide-react";
import { MOCK_USERS } from "@/store/appStore";

const audit = [
  { ts: "12:42:18", user: "Aarav M.", action: "VIEW_AS", target: "Rahul Singh", severity: "warning" as const },
  { ts: "12:38:04", user: "Priya S.", action: "ROLE_CHANGE", target: "Neha K. → MANAGER", severity: "info" as const },
  { ts: "12:21:55", user: "Rahul S.", action: "EXPORT", target: "Sales pipeline (248 rows)", severity: "neutral" as const },
  { ts: "11:58:12", user: "Aarav M.", action: "PERMISSION_GRANT", target: "Vikram J. → Finance", severity: "info" as const },
  { ts: "11:42:01", user: "Neha K.", action: "FAILED_LOGIN", target: "from 192.168.1.42", severity: "danger" as const },
  { ts: "11:21:38", user: "System", action: "BACKUP", target: "DB snapshot completed", severity: "success" as const },
  { ts: "10:58:16", user: "Priya S.", action: "TEAM_CREATE", target: "APAC Sales", severity: "info" as const },
];

const moduleNames = ["Sales", "Finance", "PMS", "Sysadmin", "Master", "WoW", "FRD", "Portfolio", "Staffing", "Canteen"];
const roleNames = ["SUPER_ADMIN", "DEPT_HEAD", "MANAGER", "EMPLOYEE", "VIEWER"];

const matrix: Record<string, Record<string, "full" | "edit" | "view" | "none">> = {
  SUPER_ADMIN: Object.fromEntries(moduleNames.map(m => [m, "full"])),
  DEPT_HEAD: { Sales: "full", Finance: "view", PMS: "edit", Sysadmin: "view", Master: "edit", WoW: "edit", FRD: "edit", Portfolio: "edit", Staffing: "view", Canteen: "none" },
  MANAGER: { Sales: "edit", Finance: "view", PMS: "edit", Sysadmin: "none", Master: "view", WoW: "edit", FRD: "edit", Portfolio: "view", Staffing: "none", Canteen: "view" },
  EMPLOYEE: { Sales: "edit", Finance: "none", PMS: "edit", Sysadmin: "none", Master: "view", WoW: "view", FRD: "view", Portfolio: "view", Staffing: "none", Canteen: "view" },
  VIEWER: { Sales: "view", Finance: "view", PMS: "view", Sysadmin: "none", Master: "view", WoW: "view", FRD: "view", Portfolio: "view", Staffing: "none", Canteen: "view" },
};

const cell = {
  full: { label: "Full", color: "bg-success/20 text-success border-success/30" },
  edit: { label: "Edit", color: "bg-primary/20 text-primary border-primary/30" },
  view: { label: "View", color: "bg-warning/15 text-warning border-warning/30" },
  none: { label: "—", color: "bg-muted/40 text-muted-foreground border-border" },
};

export default function SystemAdminDashboard() {
  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="System Administration"
        subtitle="Users · Teams · RBAC · Audit"
        accentVar="--mod-sysadmin"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Eye className="w-3.5 h-3.5" /> View As</Button>
            <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3.5 h-3.5" /> Invite User</Button>
          </>
        }
      />
      <FilterBar />

      {/* KPIs */}
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard label="Total Users" value="142" sub="across 7 depts" delta={3.2} accent="hsl(var(--mod-sysadmin))" />
        <KpiCard label="Active Today" value="89" sub="62.7% engagement" delta={8.4} accent="hsl(var(--success))" sparkline={[40,52,48,68,72,78,85,89]} />
        <KpiCard label="Teams" value="24" sub="6 cross-functional" delta={0} accent="hsl(var(--mod-pms))" />
        <KpiCard label="Pending Requests" value="7" sub="permission elevations" delta={40} accent="hsl(var(--warning))" />
        <KpiCard label="Failed Logins (24h)" value="12" sub="2 blocked" delta={-33} accent="hsl(var(--destructive))" />
        <KpiCard label="Audit Events (24h)" value="1,847" sub="89 cross-dept" delta={5.6} accent="hsl(var(--mod-finance))" sparkline={[30,45,40,55,50,65,72,68]} />
      </div>

      {/* Users + RBAC matrix */}
      <div className="px-3 grid grid-cols-1 xl:grid-cols-5 gap-2">
        {/* Users table */}
        <div className="xl:col-span-2 bg-surface border border-border rounded-sm flex flex-col">
          <div className="h-9 px-3 flex items-center justify-between border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Users</h3>
            <div className="text-2xs text-muted-foreground font-mono">{MOCK_USERS.length} total</div>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-surface-hover">
              <tr className="text-2xs uppercase text-muted-foreground">
                <th className="text-left px-3 h-7 font-medium tracking-wider">User</th>
                <th className="text-left px-3 h-7 font-medium tracking-wider">Role</th>
                <th className="text-left px-3 h-7 font-medium tracking-wider">Teams</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-surface-hover">
                  <td className="px-3 h-9">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-2xs font-bold">{u.avatar}</div>
                      <div>
                        <div className="font-medium leading-tight">{u.name}</div>
                        <div className="text-3xs text-muted-foreground font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 h-9">
                    <StatusPill variant={u.role === "SUPER_ADMIN" ? "danger" : u.role === "DEPT_HEAD" ? "purple" : u.role === "MANAGER" ? "info" : u.role === "VIEWER" ? "neutral" : "success"}>
                      {u.role.replace("_", " ")}
                    </StatusPill>
                  </td>
                  <td className="px-3 h-9">
                    <div className="flex flex-wrap gap-1">
                      {u.teams.map(t => (
                        <span key={t.id} className="text-2xs">
                          {t.name}
                          {t.isPrimary && <span className="text-primary ml-0.5">*</span>}
                          {t.isGuest && <span className="text-warning ml-0.5">ᴳ</span>}
                        </span>
                      )).reduce<React.ReactNode[]>((acc, el, i) => i ? [...acc, <span key={`s${i}`} className="text-muted-foreground/40">·</span>, el] : [el], [])}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-1.5 border-t border-border text-3xs text-muted-foreground font-mono">
            <span className="text-primary">*</span> primary team · <span className="text-warning">ᴳ</span> guest membership
          </div>
        </div>

        {/* Permission matrix */}
        <div className="xl:col-span-3 bg-surface border border-border rounded-sm flex flex-col">
          <div className="h-9 px-3 flex items-center justify-between border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> RBAC Permission Matrix</h3>
            <Button variant="outline" size="sm" className="h-6 text-2xs">Edit</Button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1.5 text-2xs uppercase text-muted-foreground tracking-wider">Role / Module</th>
                  {moduleNames.map(m => (
                    <th key={m} className="px-1 py-1.5 text-2xs font-mono text-muted-foreground text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roleNames.map(role => (
                  <tr key={role} className="border-t border-border">
                    <td className="px-2 py-1.5 font-medium text-xs whitespace-nowrap">{role.replace("_", " ")}</td>
                    {moduleNames.map(m => {
                      const lvl = matrix[role][m];
                      const c = cell[lvl];
                      return (
                        <td key={m} className="px-1 py-1 text-center">
                          <span className={`inline-flex items-center justify-center w-full h-5 px-1 rounded-sm text-2xs font-medium border ${c.color}`}>
                            {c.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="p-3 flex-1">
        <div className="bg-surface border border-border rounded-sm flex flex-col min-h-[280px]">
          <div className="h-9 px-3 flex items-center justify-between border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider">Audit Log</h3>
            <div className="flex gap-1 text-2xs">
              {["All","Critical","Auth","RBAC","Data"].map((t, i) => (
                <button key={t} className={`px-1.5 h-5 rounded-sm font-mono ${i===0?"bg-primary/15 text-primary":"text-muted-foreground hover:bg-surface-hover"}`}>{t}</button>
              ))}
            </div>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-surface-hover">
              <tr className="text-2xs uppercase text-muted-foreground">
                <th className="text-left px-3 h-7 font-medium tracking-wider w-20">Time</th>
                <th className="text-left px-3 h-7 font-medium tracking-wider w-32">User</th>
                <th className="text-left px-3 h-7 font-medium tracking-wider w-40">Action</th>
                <th className="text-left px-3 h-7 font-medium tracking-wider">Target</th>
                <th className="text-right px-3 h-7 font-medium tracking-wider w-24">Severity</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((e, i) => (
                <tr key={i} className="border-t border-border hover:bg-surface-hover">
                  <td className="px-3 h-8 font-mono text-2xs text-muted-foreground">{e.ts}</td>
                  <td className="px-3 h-8">{e.user}</td>
                  <td className="px-3 h-8 font-mono text-2xs">{e.action}</td>
                  <td className="px-3 h-8 truncate">{e.target}</td>
                  <td className="px-3 h-8 text-right"><StatusPill variant={e.severity}>{e.severity}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
