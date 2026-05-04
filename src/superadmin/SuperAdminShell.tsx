import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Layers, Receipt, CalendarCheck2,
  Sparkles, Boxes, Megaphone, LifeBuoy, BarChart3, Settings, Bell, LogOut
} from "lucide-react";
import { useSuperAdminStore } from "@/store/superAdminStore";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/super-admin/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { to: "/super-admin/tenants",        icon: Building2,       label: "Tenants" },
  { to: "/super-admin/plans",          icon: Layers,          label: "Plans" },
  { to: "/super-admin/billing",        icon: Receipt,         label: "Billing" },
  { to: "/super-admin/demo-requests",  icon: CalendarCheck2,  label: "Demos" },
  { to: "/super-admin/custom-deals",   icon: Sparkles,        label: "Deals" },
  { to: "/super-admin/modules",        icon: Boxes,           label: "Modules" },
  { to: "/super-admin/announcements",  icon: Megaphone,       label: "Announce" },
  { to: "/super-admin/support",        icon: LifeBuoy,        label: "Support" },
  { to: "/super-admin/analytics",      icon: BarChart3,       label: "Analytics" },
  { to: "/super-admin/settings",       icon: Settings,        label: "Settings" },
];

export function SuperAdminShell() {
  const authed = useSuperAdminStore(s => s.authed);
  const user = useSuperAdminStore(s => s.user);
  const logout = useSuperAdminStore(s => s.logout);
  const navigate = useNavigate();
  if (!authed) return <Navigate to="/super-admin/login" replace />;
  return (
    <div className="h-screen w-screen flex flex-col bg-[hsl(var(--background))] text-foreground overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-surface flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: "hsl(var(--sa-accent))" }}>
            ⬡
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Super Admin</div>
            <div className="text-2xs text-muted-foreground">Product Owner Console</div>
          </div>
        </div>
        <div className="flex-1" />
        <button className="relative w-8 h-8 rounded-md hover:bg-surface-hover flex items-center justify-center">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center text-white" style={{ background: "hsl(var(--destructive))" }}>3</span>
        </button>
        <div className="flex items-center gap-2 px-2 h-8 rounded-md hover:bg-surface-hover cursor-pointer">
          <div className="w-6 h-6 rounded-full text-white text-2xs font-bold flex items-center justify-center" style={{ background: "hsl(var(--sa-accent))" }}>RS</div>
          <div className="text-xs">
            <div className="font-medium leading-none">{user.name}</div>
            <div className="text-2xs text-muted-foreground">{user.role}</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate("/super-admin/login"); }} className="w-8 h-8 rounded-md hover:bg-surface-hover flex items-center justify-center text-muted-foreground" title="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </header>
      <div className="flex-1 flex min-h-0">
        {/* L1 sidebar */}
        <nav className="w-[60px] border-r border-border bg-surface flex flex-col items-center py-2 gap-1 shrink-0">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} title={n.label}
              className={({ isActive }) => cn(
                "w-11 h-11 rounded-lg flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:bg-surface-hover transition",
                isActive && "text-white"
              )}
              style={({ isActive }) => isActive ? { background: "hsl(var(--sa-accent))" } : undefined}
            >
              <n.icon className="w-4 h-4" />
              <span className="text-[9px] font-medium">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 min-w-0 overflow-auto bg-[hsl(var(--background))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
