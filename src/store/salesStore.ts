import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMPANIES, daysFromNow, pick } from "@/lib/mockData";

// ─── Types ──────────────────────────────────────────────────────────
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Negotiation" | "Won" | "Lost" | "On Hold";
export type LeadPriority = "Critical" | "High" | "Medium" | "Low";
export type LeadType = "Bid Won" | "Direct Invite" | "Direct Lead" | "Referral" | "Inbound" | "Outbound";
export type SourcePlatform =
  | "Upwork" | "LinkedIn" | "Fiverr" | "Toptal" | "Freelancer"
  | "Email" | "Referral" | "Website" | "Direct Call" | "WhatsApp"
  | "Event" | "Twitter/X" | "Facebook" | "Instagram" | "Google Ads" | "Other";
export type ProjectType = "Web App" | "Mobile App" | "API" | "Design" | "AI/ML" | "Consulting" | "Other";
export type Currency = "INR" | "USD";
export type BudgetType = "Fixed" | "Hourly" | "TBD";

export interface SourceAccount {
  id: string;
  platform: SourcePlatform;
  url: string;
  username: string;
  displayName: string;
  ownerId: string;
  secondaryOwnerId?: string;
  rateType: "Hourly" | "Monthly Subscription" | "Per Lead" | "Free";
  rateAmount?: number;
  currency: Currency;
  status: "Active" | "Paused" | "Suspended" | "Archived";
  jss?: number;
  rating?: number;
  notes?: string;
  tags: string[];
  createdAt: string;
}

export interface Lead {
  id: string;
  sourcePlatform: SourcePlatform;
  sourceAccountId?: string;
  leadType: LeadType;
  jobUrl?: string;
  jobTitle?: string;
  bidAmount?: number;
  contractType?: "Hourly" | "Fixed";
  company: string;
  companyWebsite?: string;
  industry: string;
  companySize?: string;
  country: string;
  city?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation?: string;
  linkedin?: string;
  whatsapp?: string;
  timezone: string;
  preferredContact: "Email" | "WhatsApp" | "Phone" | "LinkedIn";
  title: string;
  description: string;
  projectType: ProjectType;
  techStack: string[];
  budget?: number;
  budgetCurrency: Currency;
  budgetType: BudgetType;
  timeline?: string;
  complexity: "Low" | "Medium" | "High" | "Enterprise";
  priority: LeadPriority;
  estimatedValue?: number;
  assigneeId: string;
  team?: string;
  followUpDate?: string;
  tags: string[];
  internalNotes?: string;
  status: LeadStatus;
  aiScore: number;
  createdAt: string;
  createdById: string;
  lastActivityAt: string;
}

export interface Activity {
  id: string;
  leadId?: string;
  dealId?: string;
  type: "Call" | "Email" | "Meeting" | "Demo" | "Proposal" | "Follow-up" | "Note" | "Status Change" | "Created" | "Assigned" | "AI Action" | "Other";
  subject: string;
  description?: string;
  outcome?: "Positive" | "Neutral" | "Negative" | "No Response";
  nextStep?: string;
  nextFollowUp?: string;
  date: string;
  duration?: number;
  byId: string;
}

export interface SalesTask {
  id: string;
  leadId?: string;
  title: string;
  type: "Research" | "MVP Build" | "Proposal" | "Follow-up" | "Call" | "Meeting" | "Other";
  assigneeId: string;
  dueDate: string;
  priority: LeadPriority;
  status: "Open" | "In Progress" | "Done";
}

// ─── Deals / Contacts / Companies / Proposals ───────────────────────
export type DealStage = "Discovery" | "Qualification" | "Proposal" | "Negotiation" | "Contract" | "Won" | "Lost";
export const ALL_DEAL_STAGES: DealStage[] = ["Discovery","Qualification","Proposal","Negotiation","Contract","Won","Lost"];

export interface Deal {
  id: string;
  name: string;
  leadId?: string;
  companyId?: string;
  contactId?: string;
  ownerId: string;
  value: number;
  currency: Currency;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  source: SourcePlatform;
  notes?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation?: string;
  companyId?: string;
  ownerId: string;
  linkedin?: string;
  tags: string[];
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  industry: string;
  size: string;
  country: string;
  ownerId: string;
  arr?: number;
  status: "Prospect" | "Customer" | "Churned";
  tags: string[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  dealId?: string;
  leadId?: string;
  amount: number;
  currency: Currency;
  status: "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected";
  validTill: string;
  ownerId: string;
  createdAt: string;
}

// ─── Seed ───────────────────────────────────────────────────────────
const seedSources: SourceAccount[] = [
  { id: "s1", platform: "Upwork", url: "https://www.upwork.com/freelancers/bhavya_dev", username: "bhavya_dev", displayName: "Bhavya_Dev ($23/hr)", ownerId: "p5", rateType: "Hourly", rateAmount: 23, currency: "USD", status: "Active", jss: 92, rating: 4.9, tags: ["high-performing", "dev-focused"], createdAt: daysFromNow(-180) },
  { id: "s2", platform: "Upwork", url: "https://www.upwork.com/freelancers/techstudio_in", username: "techstudio_in", displayName: "TechStudio_IN ($18/hr)", ownerId: "p1", rateType: "Hourly", rateAmount: 18, currency: "USD", status: "Active", jss: 85, rating: 4.7, tags: ["enterprise"], createdAt: daysFromNow(-220) },
  { id: "s3", platform: "LinkedIn", url: "https://www.linkedin.com/in/priyamehta", username: "priyamehta", displayName: "Priya Mehta (Premium)", ownerId: "p2", rateType: "Monthly Subscription", rateAmount: 80, currency: "USD", status: "Active", tags: ["high-performing"], createdAt: daysFromNow(-365) },
  { id: "s4", platform: "Fiverr", url: "https://www.fiverr.com/devstudio99", username: "devstudio99", displayName: "devstudio99 ($15/hr)", ownerId: "p7", rateType: "Hourly", rateAmount: 15, currency: "USD", status: "Paused", rating: 4.5, tags: [], createdAt: daysFromNow(-150) },
  { id: "s5", platform: "Toptal", url: "https://www.toptal.com/resume/meera-nair", username: "meera-nair", displayName: "Meera Nair ($45/hr)", ownerId: "p8", rateType: "Hourly", rateAmount: 45, currency: "USD", status: "Active", rating: 5.0, tags: ["enterprise", "high-performing"], createdAt: daysFromNow(-90) },
  { id: "s6", platform: "Website", url: "https://company.com/contact", username: "website-form", displayName: "Website Contact Form", ownerId: "p2", rateType: "Free", currency: "INR", status: "Active", tags: [], createdAt: daysFromNow(-300) },
];

const STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost", "On Hold"];
const PRIORITIES: LeadPriority[] = ["Critical", "High", "Medium", "Low"];
const PROJECT_TYPES: ProjectType[] = ["Web App", "Mobile App", "API", "Design", "AI/ML", "Consulting"];
const TITLES = [
  "E-commerce Web App Development","Mobile App for Food Delivery","B2B SaaS Dashboard Redesign",
  "REST API for Inventory System","AI Chatbot for Customer Support","Marketplace Platform MVP",
  "Healthcare Patient Portal","Fintech Lending Application","Real Estate Listings Portal",
  "Logistics Tracking System","EdTech LMS Platform","HR Management System",
  "Subscription Billing Integration","Cross-platform React Native App","Data Analytics Dashboard",
];
const FIRST = ["Arjun","Riya","Sanjay","Pooja","Karan","Tanya","Rohit","Ananya","Aditya","Isha","Nikhil","Kavya","Manish","Divya","Varun"];
const LAST = ["Mehta","Iyer","Khanna","Verma","Reddy","Kapoor","Bhatt","Rao","Malhotra","Joshi","Nair","Shetty","Pillai","Saxena","Bose"];
const COUNTRIES = ["India","USA","UK","Germany","Australia","UAE","Singapore"];
const INDUSTRIES = ["Technology","E-commerce","Healthcare","Finance","Education","Manufacturing","Retail"];
const STACKS = [["React","Node.js"],["React Native","Firebase"],["Next.js","PostgreSQL"],["Python","FastAPI"],["Vue.js","Laravel"],["Flutter","Supabase"]];

const seedLeads: Lead[] = Array.from({ length: 16 }).map((_, i) => {
  const src = pick(seedSources, i);
  const status = STATUSES[i % STATUSES.length];
  const fn = pick(FIRST, i);
  const ln = pick(LAST, i + 3);
  const company = pick(COMPANIES, i);
  const value = [80000, 120000, 250000, 420000, 680000, 1200000, 1800000, 350000][i % 8];
  const days = -(i * 2 + 1);
  return {
    id: `l${i + 1}`,
    sourcePlatform: src.platform,
    sourceAccountId: src.id,
    leadType: (["Bid Won","Direct Invite","Direct Lead","Referral","Inbound"] as LeadType[])[i % 5],
    jobUrl: src.platform === "Upwork" ? `https://www.upwork.com/jobs/~01abc${i}` : undefined,
    jobTitle: src.platform === "Upwork" ? TITLES[i % TITLES.length] : undefined,
    bidAmount: src.platform === "Upwork" ? 50 + i * 10 : undefined,
    contractType: src.platform === "Upwork" ? (i % 2 === 0 ? "Fixed" : "Hourly") : undefined,
    company,
    companyWebsite: `https://${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    industry: pick(INDUSTRIES, i),
    companySize: ["11-50","51-200","201-1000"][i % 3],
    country: pick(COUNTRIES, i),
    city: ["Bengaluru","Mumbai","Delhi","Pune","Hyderabad"][i % 5],
    firstName: fn,
    lastName: ln,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone: `+91 9${(800000000 + i * 1234567).toString().slice(0, 9)}`,
    designation: ["CTO","Product Manager","Founder","VP Engineering","Head of Product"][i % 5],
    linkedin: `https://linkedin.com/in/${fn.toLowerCase()}${ln.toLowerCase()}`,
    timezone: "IST",
    preferredContact: "Email",
    title: pick(TITLES, i),
    description: `${company} is looking to build ${pick(TITLES, i).toLowerCase()}. They need a modern, scalable solution with focus on user experience and performance. Initial scope includes design, development, testing, and deployment.`,
    projectType: pick(PROJECT_TYPES, i),
    techStack: pick(STACKS, i),
    budget: value,
    budgetCurrency: i % 4 === 0 ? "USD" : "INR",
    budgetType: (["Fixed","Hourly","TBD"] as BudgetType[])[i % 3],
    timeline: ["1-3 months","3-6 months","< 1 month","6-12 months"][i % 4],
    complexity: (["Low","Medium","High","Enterprise"] as const)[i % 4],
    priority: pick(PRIORITIES, i),
    estimatedValue: value,
    assigneeId: pick(["p2","p10","p5","p1"], i),
    team: "Sales East",
    followUpDate: daysFromNow(i % 5 === 0 ? -2 : (i % 7) + 1),
    tags: i % 3 === 0 ? ["urgent","enterprise"] : i % 3 === 1 ? ["repeat-client"] : ["inbound"],
    internalNotes: "",
    status,
    aiScore: Number((4 + ((i * 1.7) % 6)).toFixed(1)),
    createdAt: daysFromNow(days),
    createdById: "p1",
    lastActivityAt: daysFromNow(days + 1),
  } as Lead;
});

const seedActivities: Activity[] = [
  { id: "a1", leadId: "l1", type: "Call", subject: "Discovery call with client", description: "Discussed scope, budget, and timeline. Client is keen.", outcome: "Positive", date: daysFromNow(-1), duration: 35, byId: "p2" },
  { id: "a2", leadId: "l1", type: "Email", subject: "Sent introductory deck", outcome: "Neutral", date: daysFromNow(-2), byId: "p2" },
  { id: "a3", leadId: "l2", type: "Meeting", subject: "Product demo", description: "Walked through MVP build and timeline.", outcome: "Positive", date: daysFromNow(-3), duration: 60, byId: "p10" },
  { id: "a4", leadId: "l3", type: "Note", subject: "Client requested case studies", description: "Need to send 2 e-commerce case studies.", date: daysFromNow(-4), byId: "p5" },
  { id: "a5", leadId: "l4", type: "Follow-up", subject: "Pinged on WhatsApp", outcome: "No Response", date: daysFromNow(-5), byId: "p2" },
  { id: "a6", leadId: "l5", type: "Email", subject: "Proposal sent", outcome: "Positive", date: daysFromNow(-1), byId: "p10" },
  { id: "a7", leadId: "l1", type: "Created", subject: "Lead created from Upwork (Bhavya_Dev)", date: daysFromNow(-6), byId: "p1" },
];

const seedTasks: SalesTask[] = [
  { id: "st1", leadId: "l1", title: "Research client's existing platform", type: "Research", assigneeId: "p4", dueDate: daysFromNow(2), priority: "High", status: "In Progress" },
  { id: "st2", leadId: "l1", title: "Schedule technical deep-dive call", type: "Call", assigneeId: "p2", dueDate: daysFromNow(1), priority: "Critical", status: "Open" },
  { id: "st3", leadId: "l2", title: "Draft initial proposal", type: "Proposal", assigneeId: "p10", dueDate: daysFromNow(3), priority: "High", status: "Open" },
];

const DEAL_STAGES_SEED: DealStage[] = ["Discovery","Qualification","Proposal","Negotiation","Contract","Won","Lost"];
const seedCompanies: Company[] = COMPANIES.slice(0, 12).map((name, i) => ({
  id: `co${i + 1}`,
  name,
  website: `https://${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
  industry: pick(["Technology","E-commerce","Healthcare","Finance","Education","Retail"], i),
  size: pick(["11-50","51-200","201-1000","1000+"], i),
  country: pick(["India","USA","UK","Singapore","UAE"], i),
  ownerId: pick(["p2","p10","p5","p1"], i),
  arr: (i + 1) * 350000 + 200000,
  status: i % 5 === 0 ? "Customer" : i % 7 === 0 ? "Churned" : "Prospect",
  tags: i % 2 === 0 ? ["enterprise"] : ["smb"],
  createdAt: daysFromNow(-(i * 12 + 30)),
}));

const seedContacts: Contact[] = Array.from({ length: 18 }).map((_, i) => {
  const fn = pick(FIRST, i);
  const ln = pick(LAST, i + 2);
  const co = seedCompanies[i % seedCompanies.length];
  return {
    id: `ct${i + 1}`,
    firstName: fn,
    lastName: ln,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${co.name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone: `+91 9${(800000000 + i * 7654321).toString().slice(0, 9)}`,
    designation: pick(["CTO","VP Eng","Founder","Product Lead","Head of Sales","CEO"], i),
    companyId: co.id,
    ownerId: pick(["p2","p10","p5"], i),
    linkedin: `https://linkedin.com/in/${fn.toLowerCase()}${ln.toLowerCase()}`,
    tags: i % 3 === 0 ? ["champion"] : i % 3 === 1 ? ["decision-maker"] : ["influencer"],
    createdAt: daysFromNow(-(i * 5 + 10)),
  };
});

const seedDeals: Deal[] = Array.from({ length: 14 }).map((_, i) => {
  const co = seedCompanies[i % seedCompanies.length];
  const ct = seedContacts[i % seedContacts.length];
  const stage = DEAL_STAGES_SEED[i % DEAL_STAGES_SEED.length];
  const probMap: Record<DealStage, number> = { Discovery: 15, Qualification: 30, Proposal: 50, Negotiation: 70, Contract: 90, Won: 100, Lost: 0 };
  return {
    id: `d${i + 1}`,
    name: `${co.name} – ${pick(TITLES, i)}`,
    leadId: i < seedLeads.length ? seedLeads[i].id : undefined,
    companyId: co.id,
    contactId: ct.id,
    ownerId: pick(["p2","p10","p5","p1"], i),
    value: [180000, 320000, 540000, 780000, 1200000, 240000, 460000][i % 7],
    currency: i % 4 === 0 ? "USD" : "INR",
    stage,
    probability: probMap[stage],
    expectedCloseDate: daysFromNow((i % 6) * 7 + 5),
    source: pick(["Upwork","LinkedIn","Referral","Website","Inbound" as any], i) as SourcePlatform,
    createdAt: daysFromNow(-(i * 4 + 8)),
  };
});

const seedProposals: Proposal[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `pr${i + 1}`,
  title: `Proposal v${(i % 3) + 1} – ${seedDeals[i].name}`,
  dealId: seedDeals[i].id,
  amount: seedDeals[i].value,
  currency: seedDeals[i].currency,
  status: (["Draft","Sent","Viewed","Accepted","Rejected","Sent"] as const)[i],
  validTill: daysFromNow(15 + i * 3),
  ownerId: seedDeals[i].ownerId,
  createdAt: daysFromNow(-(i * 3 + 1)),
}));

interface SalesState {
  sources: SourceAccount[];
  leads: Lead[];
  activities: Activity[];
  tasks: SalesTask[];
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  proposals: Proposal[];
  addSource: (s: Omit<SourceAccount, "id" | "createdAt">) => string;
  updateSource: (id: string, patch: Partial<SourceAccount>) => void;
  addLead: (l: Omit<Lead, "id" | "createdAt" | "lastActivityAt" | "aiScore">) => string;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  setLeadStatus: (id: string, status: LeadStatus, byId?: string) => void;
  logActivity: (a: Omit<Activity, "id">) => string;
  addTask: (t: Omit<SalesTask, "id">) => string;
  setTaskStatus: (id: string, status: SalesTask["status"]) => void;
  addDeal: (d: Omit<Deal, "id" | "createdAt">) => string;
  updateDeal: (id: string, patch: Partial<Deal>) => void;
  setDealStage: (id: string, stage: DealStage) => void;
  addContact: (c: Omit<Contact, "id" | "createdAt">) => string;
  addCompany: (c: Omit<Company, "id" | "createdAt">) => string;
  addProposal: (p: Omit<Proposal, "id" | "createdAt">) => string;
}

export function computeAiScore(l: Pick<Lead, "leadType" | "budget" | "budgetCurrency" | "description" | "complexity" | "priority">): number {
  let s = 4;
  if (l.leadType === "Direct Invite" || l.leadType === "Referral") s += 1.8;
  if (l.leadType === "Inbound") s += 1.0;
  const inrBudget = l.budgetCurrency === "USD" ? (l.budget ?? 0) * 83 : (l.budget ?? 0);
  if (inrBudget > 1000000) s += 2;
  else if (inrBudget > 300000) s += 1.2;
  else if (inrBudget > 100000) s += 0.6;
  if ((l.description?.length ?? 0) > 100) s += 0.6;
  if (l.complexity === "Enterprise") s += 0.8;
  if (l.priority === "Critical") s += 0.6;
  if (l.priority === "High") s += 0.3;
  return Math.min(10, Math.max(0, Number(s.toFixed(1))));
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set) => ({
      sources: seedSources,
      leads: seedLeads,
      activities: seedActivities,
      tasks: seedTasks,
      deals: seedDeals,
      contacts: seedContacts,
      companies: seedCompanies,
      proposals: seedProposals,
      addSource: (s) => {
        const id = `s${Date.now()}`;
        set((st) => ({ sources: [{ ...s, id, createdAt: new Date().toISOString().slice(0, 10) }, ...st.sources] }));
        return id;
      },
      updateSource: (id, patch) => set((st) => ({ sources: st.sources.map(s => s.id === id ? { ...s, ...patch } : s) })),
      addLead: (l) => {
        const id = `l${Date.now()}`;
        const now = new Date().toISOString().slice(0, 10);
        const aiScore = computeAiScore(l);
        set((st) => ({
          leads: [{ ...l, id, aiScore, createdAt: now, lastActivityAt: now }, ...st.leads],
          activities: [
            { id: `a${Date.now()}`, leadId: id, type: "Created", subject: `Lead created from ${l.sourcePlatform}`, date: now, byId: l.createdById },
            ...st.activities,
          ],
        }));
        return id;
      },
      updateLead: (id, patch) => set((st) => ({ leads: st.leads.map(l => l.id === id ? { ...l, ...patch, lastActivityAt: new Date().toISOString().slice(0, 10) } : l) })),
      setLeadStatus: (id, status, byId = "p1") => set((st) => ({
        leads: st.leads.map(l => l.id === id ? { ...l, status, lastActivityAt: new Date().toISOString().slice(0, 10) } : l),
        activities: [
          { id: `a${Date.now()}`, leadId: id, type: "Status Change", subject: `Status changed to ${status}`, date: new Date().toISOString().slice(0, 10), byId },
          ...st.activities,
        ],
      })),
      logActivity: (a) => {
        const id = `a${Date.now()}`;
        set((st) => ({
          activities: [{ ...a, id }, ...st.activities],
          leads: a.leadId ? st.leads.map(l => l.id === a.leadId ? { ...l, lastActivityAt: a.date } : l) : st.leads,
        }));
        return id;
      },
      addTask: (t) => {
        const id = `st${Date.now()}`;
        set((st) => ({ tasks: [{ ...t, id }, ...st.tasks] }));
        return id;
      },
      setTaskStatus: (id, status) => set((st) => ({ tasks: st.tasks.map(t => t.id === id ? { ...t, status } : t) })),
      addDeal: (d) => {
        const id = `d${Date.now()}`;
        set((st) => ({ deals: [{ ...d, id, createdAt: new Date().toISOString().slice(0, 10) }, ...st.deals] }));
        return id;
      },
      updateDeal: (id, patch) => set((st) => ({ deals: st.deals.map(d => d.id === id ? { ...d, ...patch } : d) })),
      setDealStage: (id, stage) => {
        const probMap: Record<DealStage, number> = { Discovery: 15, Qualification: 30, Proposal: 50, Negotiation: 70, Contract: 90, Won: 100, Lost: 0 };
        set((st) => ({
          deals: st.deals.map(d => d.id === id ? { ...d, stage, probability: probMap[stage] } : d),
          activities: [
            { id: `a${Date.now()}`, dealId: id, type: "Status Change", subject: `Deal moved to ${stage}`, date: new Date().toISOString().slice(0, 10), byId: "p1" },
            ...st.activities,
          ],
        }));
      },
      addContact: (c) => {
        const id = `ct${Date.now()}`;
        set((st) => ({ contacts: [{ ...c, id, createdAt: new Date().toISOString().slice(0, 10) }, ...st.contacts] }));
        return id;
      },
      addCompany: (c) => {
        const id = `co${Date.now()}`;
        set((st) => ({ companies: [{ ...c, id, createdAt: new Date().toISOString().slice(0, 10) }, ...st.companies] }));
        return id;
      },
      addProposal: (p) => {
        const id = `pr${Date.now()}`;
        set((st) => ({ proposals: [{ ...p, id, createdAt: new Date().toISOString().slice(0, 10) }, ...st.proposals] }));
        return id;
      },
    }),
    { name: "crm-sales-state" }
  )
);

export const leadStatusVariant = (s: LeadStatus): "info" | "purple" | "success" | "warning" | "danger" | "neutral" => {
  switch (s) {
    case "New": return "info";
    case "Contacted": return "purple";
    case "Qualified": return "info";
    case "Proposal Sent": return "warning";
    case "Negotiation": return "warning";
    case "Won": return "success";
    case "Lost": return "danger";
    case "On Hold": return "neutral";
  }
};
export const priorityColor = (p: LeadPriority) => p === "Critical" ? "text-destructive" : p === "High" ? "text-warning" : p === "Medium" ? "text-primary" : "text-muted-foreground";
export const priorityDot = (p: LeadPriority) => p === "Critical" ? "🔴" : p === "High" ? "🟠" : p === "Medium" ? "🟡" : "⚪";

export const ALL_LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost", "On Hold"];
