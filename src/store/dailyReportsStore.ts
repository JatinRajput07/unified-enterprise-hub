import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReportMood = "great" | "good" | "ok" | "blocked";

export interface TaskItem {
  id: string;
  title: string;
  status: "done" | "in_progress" | "blocked";
  hours: number;
  project?: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  department: string;
  date: string; // YYYY-MM-DD
  submittedAt: string; // ISO
  mood: ReportMood;
  totalHours: number;
  tasks: TaskItem[];
  accomplishments: string;
  blockers: string;
  tomorrowPlan: string;
  notes?: string;
}

const today = () => new Date().toISOString().slice(0, 10);

function seed(): DailyReport[] {
  const people = [
    { id: "u2", name: "Priya Shah", avatar: "PS", dept: "Sales" },
    { id: "u3", name: "Rahul Singh", avatar: "RS", dept: "Sales" },
    { id: "u4", name: "Neha Kapoor", avatar: "NK", dept: "Sales" },
    { id: "u5", name: "Vikram Joshi", avatar: "VJ", dept: "Finance" },
  ];
  const out: DailyReport[] = [];
  for (let d = 1; d <= 4; d++) {
    const date = new Date(); date.setDate(date.getDate() - d);
    const ds = date.toISOString().slice(0, 10);
    people.forEach((p, i) => {
      out.push({
        id: `dr-${ds}-${p.id}`,
        userId: p.id, userName: p.name, userAvatar: p.avatar, department: p.dept,
        date: ds, submittedAt: date.toISOString(),
        mood: (["great", "good", "ok", "blocked"] as ReportMood[])[(i + d) % 4],
        totalHours: 6 + ((i + d) % 4),
        tasks: [
          { id: `t1-${d}-${p.id}`, title: "Client follow-ups", status: "done", hours: 2, project: "Acme" },
          { id: `t2-${d}-${p.id}`, title: "Proposal draft", status: "in_progress", hours: 3, project: "TechCorp" },
        ],
        accomplishments: "Closed 2 deals, sent 5 proposals.",
        blockers: i % 2 ? "Waiting on legal review." : "",
        tomorrowPlan: "Demo with Globex, pipeline review.",
      });
    });
  }
  return out;
}

interface DailyReportsState {
  reports: DailyReport[];
  addReport: (r: DailyReport) => void;
  deleteReport: (id: string) => void;
}

export const useDailyReportsStore = create<DailyReportsState>()(
  persist(
    (set) => ({
      reports: seed(),
      addReport: (r) => set((s) => ({ reports: [r, ...s.reports.filter(x => x.id !== r.id)] })),
      deleteReport: (id) => set((s) => ({ reports: s.reports.filter(r => r.id !== id) })),
    }),
    { name: "crm-daily-reports" }
  )
);

export const todayDate = today;