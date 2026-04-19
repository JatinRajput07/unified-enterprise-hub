import {
  Workflow, Wallet, ShieldCheck, FolderKanban, Database,
  TrendingUp, FileText, Briefcase, Users2, UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type ModuleKey =
  | "wayofwork" | "finance" | "sysadmin" | "pms" | "mastersheet"
  | "sales" | "frd" | "portfolio" | "staffing" | "canteen";

export interface ModuleDef {
  key: ModuleKey;
  name: string;
  short: string;
  icon: LucideIcon;
  path: string;
  colorVar: string; // hsl var name
  submenu: { label: string; path: string }[];
}

export const MODULES: ModuleDef[] = [
  {
    key: "wayofwork", name: "WayOfWork", short: "WOW", icon: Workflow,
    path: "/wayofwork", colorVar: "--mod-wayofwork",
    submenu: [
      { label: "Dashboard", path: "/wayofwork" },
      { label: "SOPs", path: "/wayofwork/sops" },
      { label: "Workflows", path: "/wayofwork/workflows" },
      { label: "Templates", path: "/wayofwork/templates" },
    ],
  },
  {
    key: "finance", name: "Finance", short: "FIN", icon: Wallet,
    path: "/finance", colorVar: "--mod-finance",
    submenu: [
      { label: "Dashboard", path: "/finance" },
      { label: "Invoices", path: "/finance/invoices" },
      { label: "P&L", path: "/finance/pnl" },
      { label: "Budgets", path: "/finance/budgets" },
      { label: "Expenses", path: "/finance/expenses" },
      { label: "Reports", path: "/finance/reports" },
    ],
  },
  {
    key: "sysadmin", name: "System Admin", short: "SYS", icon: ShieldCheck,
    path: "/system-admin", colorVar: "--mod-sysadmin",
    submenu: [
      { label: "Dashboard", path: "/system-admin" },
      { label: "Users", path: "/system-admin/users" },
      { label: "Teams", path: "/system-admin/teams" },
      { label: "Departments", path: "/system-admin/departments" },
      { label: "RBAC Matrix", path: "/system-admin/rbac" },
      { label: "Audit Logs", path: "/system-admin/audit" },
    ],
  },
  {
    key: "pms", name: "PMS", short: "PMS", icon: FolderKanban,
    path: "/pms", colorVar: "--mod-pms",
    submenu: [
      { label: "Dashboard", path: "/pms" },
      { label: "Projects", path: "/pms/projects" },
      { label: "Tasks", path: "/pms/tasks" },
      { label: "Timeline", path: "/pms/timeline" },
    ],
  },
  {
    key: "mastersheet", name: "Master Sheet", short: "MST", icon: Database,
    path: "/master-sheet", colorVar: "--mod-mastersheet",
    submenu: [
      { label: "Dashboard", path: "/master-sheet" },
      { label: "Records", path: "/master-sheet/records" },
      { label: "Schemas", path: "/master-sheet/schemas" },
    ],
  },
  {
    key: "sales", name: "Sales", short: "SLS", icon: TrendingUp,
    path: "/sales", colorVar: "--mod-sales",
    submenu: [
      { label: "Dashboard", path: "/sales" },
      { label: "Leads", path: "/sales/leads" },
      { label: "Pipeline", path: "/sales/pipeline" },
      { label: "Deals", path: "/sales/deals" },
      { label: "Contacts", path: "/sales/contacts" },
      { label: "Companies", path: "/sales/companies" },
      { label: "Activities", path: "/sales/activities" },
      { label: "Forecasts", path: "/sales/forecasts" },
      { label: "Reports", path: "/sales/reports" },
    ],
  },
  {
    key: "frd", name: "FRD", short: "FRD", icon: FileText,
    path: "/frd", colorVar: "--mod-frd",
    submenu: [
      { label: "Dashboard", path: "/frd" },
      { label: "Documents", path: "/frd/documents" },
      { label: "Reviews", path: "/frd/reviews" },
    ],
  },
  {
    key: "portfolio", name: "Portfolio", short: "PRT", icon: Briefcase,
    path: "/portfolio", colorVar: "--mod-portfolio",
    submenu: [
      { label: "Dashboard", path: "/portfolio" },
      { label: "Clients", path: "/portfolio/clients" },
      { label: "Projects", path: "/portfolio/projects" },
    ],
  },
  {
    key: "staffing", name: "Staffing Solutions", short: "STF", icon: Users2,
    path: "/staffing", colorVar: "--mod-staffing",
    submenu: [
      { label: "Dashboard", path: "/staffing" },
      { label: "Candidates", path: "/staffing/candidates" },
      { label: "Positions", path: "/staffing/positions" },
      { label: "Allocations", path: "/staffing/allocations" },
    ],
  },
  {
    key: "canteen", name: "Canteen", short: "CTN", icon: UtensilsCrossed,
    path: "/canteen", colorVar: "--mod-canteen",
    submenu: [
      { label: "Dashboard", path: "/canteen" },
      { label: "Menu", path: "/canteen/menu" },
      { label: "Orders", path: "/canteen/orders" },
      { label: "Inventory", path: "/canteen/inventory" },
    ],
  },
];

export const getModuleByPath = (pathname: string): ModuleDef => {
  const match = MODULES.find(m => pathname.startsWith(m.path));
  return match ?? MODULES.find(m => m.key === "sales")!;
};
