import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleKey } from "@/lib/modules";

export type GlobalRole = "SUPER_ADMIN" | "DEPT_HEAD" | "MANAGER" | "EMPLOYEE" | "VIEWER";

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  isPrimary?: boolean;
  isGuest?: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: GlobalRole;
  avatar: string;
  departmentId: string;
  teams: Team[];
  activeTeamId: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "u1", name: "Aarav Mehta", email: "aarav@acme.io", role: "SUPER_ADMIN",
    avatar: "AM", departmentId: "d-sys",
    teams: [{ id: "t-org", name: "Organization", departmentId: "d-sys", isPrimary: true }],
    activeTeamId: "t-org",
  },
  {
    id: "u2", name: "Priya Shah", email: "priya@acme.io", role: "DEPT_HEAD",
    avatar: "PS", departmentId: "d-sales",
    teams: [{ id: "t-ent", name: "Enterprise Sales", departmentId: "d-sales", isPrimary: true }],
    activeTeamId: "t-ent",
  },
  {
    id: "u3", name: "Rahul Singh", email: "rahul@acme.io", role: "MANAGER",
    avatar: "RS", departmentId: "d-sales",
    teams: [
      { id: "t-ent", name: "Enterprise Sales", departmentId: "d-sales", isPrimary: true },
      { id: "t-smb", name: "SMB Sales", departmentId: "d-sales", isGuest: true },
    ],
    activeTeamId: "t-ent",
  },
  {
    id: "u4", name: "Neha Kapoor", email: "neha@acme.io", role: "EMPLOYEE",
    avatar: "NK", departmentId: "d-sales",
    teams: [
      { id: "t-smb", name: "SMB Sales", departmentId: "d-sales", isPrimary: true },
      { id: "t-ent", name: "Enterprise Sales", departmentId: "d-sales", isGuest: true },
    ],
    activeTeamId: "t-smb",
  },
  {
    id: "u5", name: "Vikram Joshi", email: "vikram@acme.io", role: "VIEWER",
    avatar: "VJ", departmentId: "d-fin",
    teams: [{ id: "t-fin", name: "FP&A", departmentId: "d-fin", isPrimary: true }],
    activeTeamId: "t-fin",
  },
];

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;

  l1Open: boolean;
  setL1Open: (v: boolean) => void;
  toggleL1: () => void;

  rightPanel: string | null;
  setRightPanel: (id: string | null) => void;

  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  setActiveTeam: (teamId: string) => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      l1Open: true,
      setL1Open: (v) => set({ l1Open: v }),
      toggleL1: () => set((s) => ({ l1Open: !s.l1Open })),

      rightPanel: null,
      setRightPanel: (id) => set((s) => ({ rightPanel: s.rightPanel === id ? null : id })),

      currentUserId: "u1",
      setCurrentUserId: (id) => set({ currentUserId: id }),
      setActiveTeam: (teamId) => set((s) => {
        const users = MOCK_USERS.map(u =>
          u.id === s.currentUserId ? { ...u, activeTeamId: teamId } : u
        );
        // mutate mock list in place so getCurrentUser reads it
        users.forEach((u, i) => { MOCK_USERS[i] = u; });
        return {};
      }),

      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
    }),
    { name: "crm-app-state", partialize: (s) => ({ theme: s.theme, l1Open: s.l1Open, currentUserId: s.currentUserId }) }
  )
);

export const useCurrentUser = () => {
  const id = useAppStore((s) => s.currentUserId);
  return MOCK_USERS.find((u) => u.id === id) ?? MOCK_USERS[0];
};

// Module visibility per role (simplified mock RBAC)
export const moduleAccess: Record<GlobalRole, ModuleKey[] | "all"> = {
  SUPER_ADMIN: "all",
  DEPT_HEAD: ["sales", "sysadmin", "pms", "mastersheet", "frd", "portfolio", "wayofwork"],
  MANAGER: ["sales", "pms", "mastersheet", "wayofwork", "frd"],
  EMPLOYEE: ["sales", "pms", "wayofwork", "canteen"],
  VIEWER: ["finance", "portfolio"],
};

export function canAccessModule(role: GlobalRole, key: ModuleKey): boolean {
  const acc = moduleAccess[role];
  return acc === "all" || acc.includes(key);
}
