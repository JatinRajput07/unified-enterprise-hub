import { useLocation } from "react-router-dom";
import { Search, Settings, Cog, Zap, Bell, Sun, Moon, Users } from "lucide-react";
import { useAppStore, useCurrentUser, MOCK_USERS } from "@/store/appStore";
import { getModuleByPath } from "@/lib/modules";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const location = useLocation();
  const mod = getModuleByPath(location.pathname);
  const { theme, toggleTheme, setSearchOpen, setCurrentUserId, setActiveTeam } = useAppStore();
  const user = useCurrentUser();

  const subPath = location.pathname.split("/").pop();
  const subLabel = mod.submenu.find(s => s.path === location.pathname)?.label ?? subPath;

  return (
    <header className="h-12 flex items-center px-3 gap-3 bg-surface border-b border-border shrink-0">
      {/* Left: Logo + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono font-bold text-2xs">A</span>
          </div>
          <span className="font-bold text-sm tracking-tight">ACME</span>
          <span className="text-2xs text-muted-foreground font-mono">/CRM</span>
        </div>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-xs min-w-0">
          <span className="text-muted-foreground truncate">{mod.name}</span>
          {subLabel && subLabel !== mod.path.slice(1) && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium truncate">{subLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex-1 max-w-md mx-auto flex items-center gap-2 px-2.5 h-7 bg-surface-hover border border-border rounded-sm text-xs text-muted-foreground hover:border-primary/40 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">Search leads, projects, invoices...</span>
        <kbd className="font-mono text-2xs px-1 h-4 flex items-center bg-background rounded-sm border border-border">⌘K</kbd>
      </button>

      {/* Right: Action cluster */}
      <div className="flex items-center gap-0.5">
        <IconBtn label="Config"><Cog className="w-4 h-4" /></IconBtn>
        <IconBtn label="Settings"><Settings className="w-4 h-4" /></IconBtn>
        <IconBtn label="Automation"><Zap className="w-4 h-4" /></IconBtn>
        <IconBtn label="Theme" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </IconBtn>
        <IconBtn label="Notifications">
          <div className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-destructive rounded-full" />
          </div>
        </IconBtn>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Role/User switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 h-8 px-2 rounded-sm hover:bg-surface-hover transition-colors">
            <div className="w-6 h-6 rounded-sm bg-primary/20 text-primary flex items-center justify-center font-mono text-2xs font-bold">
              {user.avatar}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-medium leading-tight">{user.name}</div>
              <div className="text-3xs text-muted-foreground leading-tight font-mono">{user.role.replace("_", " ")}</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground tracking-wider">Switch user (demo)</DropdownMenuLabel>
            {MOCK_USERS.map(u => (
              <DropdownMenuItem key={u.id} onClick={() => setCurrentUserId(u.id)} className="text-xs">
                <div className="w-5 h-5 rounded-sm bg-muted text-muted-foreground flex items-center justify-center font-mono text-3xs font-bold mr-2">{u.avatar}</div>
                <div className="flex-1">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-3xs text-muted-foreground font-mono">{u.role.replace("_", " ")}</div>
                </div>
                {u.id === user.id && <StatusPill variant="info">active</StatusPill>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Active team
            </DropdownMenuLabel>
            {user.teams.map(t => (
              <DropdownMenuItem key={t.id} onClick={() => setActiveTeam(t.id)} className="text-xs">
                <span className="flex-1">{t.name}</span>
                {t.id === user.activeTeamId && <StatusPill variant="info">active</StatusPill>}
                {t.isPrimary && t.id !== user.activeTeamId && <StatusPill variant="neutral">primary</StatusPill>}
                {t.isGuest && <StatusPill variant="warning">guest</StatusPill>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">My Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">My Tasks</DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
    >
      {children}
    </button>
  );
}
