import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PEOPLE, daysFromNow } from "@/lib/mockData";

export type WowType = "Workflow" | "Activity" | "Process" | "SOP" | "Checklist" | "Report" | "Meeting" | "Other";
export type WowFreq = "Daily" | "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly" | "Ad-hoc" | "One-time";
export type WowStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Training Assigned";
export type TrainingStatus = "Not Started" | "In Progress" | "Completed";

export interface Wow {
  id: string;
  title: string;
  description: string;
  responsibility: string;
  type: WowType;
  frequency: WowFreq;
  estTime: number;     // minutes
  bestTime: string;
  steps: string[];
  tools: string[];
  attachments: { name: string; kind: "file" | "link"; url?: string }[];
  visibility: "Team" | "Department" | "Organization";
  notes: string;
  ownerId: string;
  status: WowStatus;
  rejectionReason?: string;
  createdAt: string;
  submittedAt?: string;
}

export interface TrainingAssignment {
  id: string;
  wowId: string;
  assigneeId: string;
  assignedById: string;
  dueDate?: string;
  note?: string;
  status: TrainingStatus;
  assignedAt: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  lastTriggered?: string;
}

interface WowState {
  wows: Wow[];
  trainings: TrainingAssignment[];
  automations: Automation[];
  addWow: (w: Omit<Wow, "id" | "createdAt">) => string;
  updateWow: (id: string, patch: Partial<Wow>) => void;
  deleteWow: (id: string) => void;
  approveWow: (id: string) => void;
  rejectWow: (id: string, reason: string) => void;
  assignTraining: (wowIds: string[], assigneeIds: string[], dueDate?: string, note?: string, assignedById?: string) => void;
  setTrainingStatus: (id: string, status: TrainingStatus) => void;
  toggleAutomation: (id: string) => void;
}

const seedWows: Wow[] = [
  {
    id: "w1", title: "Daily Standup Facilitation",
    description: "Run the engineering standup every weekday morning. Capture blockers and post summary.",
    responsibility: "Engineering Lead", type: "Meeting", frequency: "Daily",
    estTime: 15, bestTime: "Morning",
    steps: ["Join Zoom 5 min before", "Open shared notes", "Round-robin update", "Capture blockers", "Post summary in Slack"],
    tools: ["Zoom", "Slack", "Notion"], attachments: [], visibility: "Team", notes: "Keep under 15 min.",
    ownerId: "p1", status: "Approved", createdAt: daysFromNow(-30), submittedAt: daysFromNow(-29),
  },
  {
    id: "w2", title: "Monthly P&L Review",
    description: "Compile P&L statement and present to leadership.",
    responsibility: "Finance Manager", type: "Process", frequency: "Monthly",
    estTime: 240, bestTime: "End of Day",
    steps: ["Pull GL data", "Reconcile accounts", "Build P&L sheet", "Variance analysis", "Present to CFO"],
    tools: ["Tally", "Excel", "PowerPoint"], attachments: [], visibility: "Department", notes: "",
    ownerId: "p3", status: "Approved", createdAt: daysFromNow(-60), submittedAt: daysFromNow(-58),
  },
  {
    id: "w3", title: "Lead Qualification Checklist",
    description: "Qualify inbound leads using BANT before passing to AE.",
    responsibility: "SDR", type: "Checklist", frequency: "Daily",
    estTime: 20, bestTime: "Anytime",
    steps: ["Verify budget range", "Confirm authority", "Identify need", "Establish timeline", "Log in CRM"],
    tools: ["Salesforce", "LinkedIn", "Gmail"], attachments: [], visibility: "Organization", notes: "",
    ownerId: "p2", status: "Submitted", createdAt: daysFromNow(-3), submittedAt: daysFromNow(-2),
  },
  {
    id: "w4", title: "Weekly Sprint Planning",
    description: "Plan upcoming sprint with engineering team.",
    responsibility: "Scrum Master", type: "Workflow", frequency: "Weekly",
    estTime: 90, bestTime: "Morning",
    steps: ["Review backlog", "Capacity planning", "Sprint goals", "Story estimation", "Commit"],
    tools: ["Jira", "Confluence"], attachments: [], visibility: "Team", notes: "",
    ownerId: "p4", status: "Submitted", createdAt: daysFromNow(-1), submittedAt: daysFromNow(-1),
  },
  {
    id: "w5", title: "Customer Onboarding SOP",
    description: "Standard onboarding for new enterprise customers.",
    responsibility: "Customer Success", type: "SOP", frequency: "Ad-hoc",
    estTime: 480, bestTime: "Anytime",
    steps: ["Kickoff call", "Account provisioning", "Data migration", "Training session", "Go-live review"],
    tools: ["Zoom", "Notion", "Salesforce"], attachments: [], visibility: "Department", notes: "",
    ownerId: "p6", status: "Draft", createdAt: daysFromNow(-2),
  },
  {
    id: "w6", title: "Weekly Marketing Report",
    description: "Compile and distribute weekly marketing performance report.",
    responsibility: "Marketing Manager", type: "Report", frequency: "Weekly",
    estTime: 60, bestTime: "End of Day",
    steps: ["Pull analytics", "Compile metrics", "Write commentary", "Distribute"],
    tools: ["GA4", "Excel", "Slack"], attachments: [], visibility: "Organization", notes: "",
    ownerId: "p8", status: "Rejected", rejectionReason: "Add CAC and LTV metrics.",
    createdAt: daysFromNow(-10), submittedAt: daysFromNow(-8),
  },
  {
    id: "w7", title: "Code Review Process",
    description: "Review pull requests within 24h.",
    responsibility: "Senior Engineer", type: "Process", frequency: "Daily",
    estTime: 45, bestTime: "Afternoon",
    steps: ["Pull latest", "Run tests", "Review code", "Leave comments", "Approve or request changes"],
    tools: ["GitHub", "VS Code"], attachments: [], visibility: "Team", notes: "",
    ownerId: "p7", status: "Approved", createdAt: daysFromNow(-45), submittedAt: daysFromNow(-44),
  },
  {
    id: "w8", title: "Quarterly Budget Planning",
    description: "Department budget allocation for next quarter.",
    responsibility: "Department Head", type: "Activity", frequency: "Quarterly",
    estTime: 600, bestTime: "Morning",
    steps: ["Review previous quarter", "Forecast needs", "Allocate by category", "Get approval"],
    tools: ["Excel", "Tally"], attachments: [], visibility: "Department", notes: "",
    ownerId: "p3", status: "Approved", createdAt: daysFromNow(-90), submittedAt: daysFromNow(-88),
  },
];

const seedTrainings: TrainingAssignment[] = [
  { id: "t1", wowId: "w1", assigneeId: "p4", assignedById: "p1", status: "In Progress", assignedAt: daysFromNow(-5), dueDate: daysFromNow(7) },
  { id: "t2", wowId: "w7", assigneeId: "p9", assignedById: "p1", status: "Not Started", assignedAt: daysFromNow(-2), dueDate: daysFromNow(14) },
  { id: "t3", wowId: "w2", assigneeId: "p3", assignedById: "p1", status: "Completed", assignedAt: daysFromNow(-20), dueDate: daysFromNow(-5) },
];

const seedAutomations: Automation[] = [
  { id: "a1", name: "Notify manager on submit", trigger: "WoW Submitted", action: "Notify Manager", active: true, lastTriggered: "2h ago" },
  { id: "a2", name: "Notify employee on approve", trigger: "WoW Approved", action: "Notify Employee", active: true, lastTriggered: "5h ago" },
  { id: "a3", name: "Notify on reject with reason", trigger: "WoW Rejected", action: "Notify Employee + Reason", active: true, lastTriggered: "1d ago" },
  { id: "a4", name: "Notify trainee on assign", trigger: "Training Assigned", action: "Notify Trainee", active: true },
  { id: "a5", name: "Training reminder T-3 days", trigger: "3 days before due", action: "Send Reminder", active: false },
];

export const useWowStore = create<WowState>()(
  persist(
    (set) => ({
      wows: seedWows,
      trainings: seedTrainings,
      automations: seedAutomations,
      addWow: (w) => {
        const id = `w${Date.now()}`;
        set((s) => ({ wows: [{ ...w, id, createdAt: new Date().toISOString().slice(0, 10) }, ...s.wows] }));
        return id;
      },
      updateWow: (id, patch) => set((s) => ({ wows: s.wows.map(w => w.id === id ? { ...w, ...patch } : w) })),
      deleteWow: (id) => set((s) => ({ wows: s.wows.filter(w => w.id !== id) })),
      approveWow: (id) => set((s) => ({ wows: s.wows.map(w => w.id === id ? { ...w, status: "Approved" as WowStatus } : w) })),
      rejectWow: (id, reason) => set((s) => ({ wows: s.wows.map(w => w.id === id ? { ...w, status: "Rejected" as WowStatus, rejectionReason: reason } : w) })),
      assignTraining: (wowIds, assigneeIds, dueDate, note, assignedById = "p1") => set((s) => {
        const next: TrainingAssignment[] = [];
        wowIds.forEach((wid) => {
          assigneeIds.forEach((aid) => {
            next.push({
              id: `t${Date.now()}-${wid}-${aid}`, wowId: wid, assigneeId: aid, assignedById,
              dueDate, note, status: "Not Started", assignedAt: new Date().toISOString().slice(0, 10),
            });
          });
        });
        return { trainings: [...next, ...s.trainings] };
      }),
      setTrainingStatus: (id, status) => set((s) => ({ trainings: s.trainings.map(t => t.id === id ? { ...t, status } : t) })),
      toggleAutomation: (id) => set((s) => ({ automations: s.automations.map(a => a.id === id ? { ...a, active: !a.active } : a) })),
    }),
    { name: "crm-wow-state" }
  )
);

export const peopleById = (id: string) => PEOPLE.find(p => p.id === id) ?? PEOPLE[0];
