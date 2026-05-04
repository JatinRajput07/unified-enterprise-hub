import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlanKey = "trial" | "starter" | "growth" | "pro" | "enterprise" | "custom";
export type TenantStatus = "active" | "trial" | "suspended" | "cancelled" | "payment_failed";
export type ModuleKey =
  | "sales" | "hrms" | "pms" | "finance" | "wayofwork"
  | "mastersheet" | "frd" | "portfolio" | "staffing" | "canteen";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  industry?: string;
  country: string;
  website?: string;
  plan: PlanKey;
  modules: ModuleKey[];
  users: number;
  mrr: number;
  status: TenantStatus;
  signup: string;
  expires: string;
  lastLogin: string;
  notes?: string;
}

export interface DemoRequest {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  modules: ModuleKey[];
  source: string;
  message?: string;
  requested: string;
  status: "new" | "contacted" | "scheduled" | "demo_done" | "converted" | "rejected" | "no_response";
  assignedTo?: string;
  scheduledAt?: string;
  meetingLink?: string;
}

export interface CustomDeal {
  id: string;
  name: string;
  tenantId?: string;
  tenantName: string;
  modules: ModuleKey[];
  monthlyPrice: number;
  discountPct: number;
  billingCycle: "monthly" | "annual";
  duration: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  status: "active" | "negotiating" | "expired" | "cancelled";
  owner: string;
  notes?: string;
}

export interface Plan {
  key: PlanKey;
  name: string;
  price: number;          // monthly INR; 0 for trial/custom
  maxUsers: number;       // 0 = unlimited
  maxModules: number;     // 0 = all
  storageGB: number;
  apiCalls: number;
  modulesAllowed: ModuleKey[];
  support: string;
  features: string[];
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  plan: PlanKey;
  period: string;
  amount: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue" | "failed" | "refunded";
  dueDate: string;
  paidDate?: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  contact: string;
  subject: string;
  category: string;
  priority: "P1" | "P2" | "P3" | "P4";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  created: string;
  lastReply: string;
  thread: { from: "tenant" | "agent"; author: string; at: string; body: string }[];
  internalNotes: { author: string; at: string; body: string }[];
}

export interface Announcement {
  id: string;
  title: string;
  type: "feature" | "maintenance" | "billing" | "important" | "module";
  content: string;
  audience: string;
  channels: string[];
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  sentAt?: string;
}

export interface ActivityEvent {
  id: string;
  at: string;
  text: string;
  kind: "plan" | "module" | "payment" | "user" | "admin" | "support" | "demo";
  tenantId?: string;
}

export const ALL_MODULES: { key: ModuleKey; name: string; price: number }[] = [
  { key: "sales", name: "Sales", price: 2999 },
  { key: "hrms", name: "HRMS", price: 1999 },
  { key: "pms", name: "PMS", price: 1999 },
  { key: "finance", name: "Finance", price: 1499 },
  { key: "wayofwork", name: "WayOfWork", price: 999 },
  { key: "mastersheet", name: "Master Sheet", price: 999 },
  { key: "frd", name: "FRD", price: 499 },
  { key: "portfolio", name: "Portfolio", price: 999 },
  { key: "staffing", name: "Staffing", price: 1499 },
  { key: "canteen", name: "Canteen", price: 499 },
];

export const DEFAULT_PLANS: Plan[] = [
  { key: "starter", name: "Starter", price: 999, maxUsers: 10, maxModules: 3, storageGB: 5, apiCalls: 10000,
    modulesAllowed: ["sales", "hrms", "pms"], support: "Email",
    features: ["Up to 10 users", "3 modules", "Basic support"] },
  { key: "growth", name: "Growth", price: 2999, maxUsers: 50, maxModules: 6, storageGB: 25, apiCalls: 50000,
    modulesAllowed: ["sales","hrms","pms","finance","wayofwork","mastersheet"], support: "Priority Email",
    features: ["Up to 50 users", "6 modules", "Priority support"] },
  { key: "pro", name: "Pro", price: 5999, maxUsers: 200, maxModules: 0, storageGB: 100, apiCalls: 250000,
    modulesAllowed: ALL_MODULES.map(m => m.key), support: "Dedicated CSM",
    features: ["Up to 200 users", "All modules", "Dedicated CSM"] },
  { key: "enterprise", name: "Enterprise", price: 0, maxUsers: 0, maxModules: 0, storageGB: 1000, apiCalls: 9999999,
    modulesAllowed: ALL_MODULES.map(m => m.key), support: "SLA + CSM",
    features: ["Unlimited users", "All modules", "SLA + CSM"] },
];

const seedTenants: Tenant[] = [
  { id: "t1", name: "TechCorp India", slug: "techcorp-india", email: "billing@techcorp.in", country: "India", plan: "growth", modules: ["sales","hrms","pms","finance","wayofwork","mastersheet"], users: 34, mrr: 14999, status: "active", signup: "2024-01-15", expires: "2025-05-15", lastLogin: "2h ago", industry: "IT Services" },
  { id: "t2", name: "Infosys", slug: "infosys", email: "ops@infosys.com", country: "India", plan: "enterprise", modules: ALL_MODULES.map(m=>m.key), users: 480, mrr: 45000, status: "active", signup: "2023-06-01", expires: "2026-06-01", lastLogin: "1h ago", industry: "IT Services" },
  { id: "t3", name: "Wipro", slug: "wipro", email: "billing@wipro.com", country: "India", plan: "custom", modules: ["pms","hrms","wayofwork"], users: 220, mrr: 8999, status: "active", signup: "2024-03-12", expires: "2025-04-30", lastLogin: "3h ago", industry: "Consulting" },
  { id: "t4", name: "Zomato", slug: "zomato", email: "ops@zomato.com", country: "India", plan: "pro", modules: ALL_MODULES.map(m=>m.key), users: 140, mrr: 9999, status: "active", signup: "2024-02-20", expires: "2025-08-20", lastLogin: "30m ago", industry: "Food Tech" },
  { id: "t5", name: "Razorpay", slug: "razorpay", email: "trial@razorpay.com", country: "India", plan: "trial", modules: ALL_MODULES.map(m=>m.key), users: 12, mrr: 0, status: "trial", signup: "2025-04-20", expires: "2025-05-04", lastLogin: "5h ago", industry: "Fintech" },
  { id: "t6", name: "Nykaa", slug: "nykaa", email: "billing@nykaa.com", country: "India", plan: "growth", modules: ["sales","hrms","pms","finance","wayofwork","mastersheet"], users: 67, mrr: 14999, status: "active", signup: "2024-05-08", expires: "2025-05-05", lastLogin: "1d ago", industry: "Retail" },
  { id: "t7", name: "StartupXYZ", slug: "startupxyz", email: "founder@startupxyz.io", country: "India", plan: "starter", modules: ["sales","hrms","pms"], users: 6, mrr: 999, status: "active", signup: "2024-11-12", expires: "2025-05-08", lastLogin: "15d ago", industry: "SaaS" },
  { id: "t8", name: "DesignHub", slug: "designhub", email: "billing@designhub.co", country: "India", plan: "starter", modules: ["sales","hrms","pms"], users: 8, mrr: 999, status: "payment_failed", signup: "2024-09-01", expires: "2025-05-03", lastLogin: "8h ago", industry: "Design" },
  { id: "t9", name: "BuilderSpace", slug: "builderspace", email: "demo@builderspace.io", country: "India", plan: "trial", modules: [], users: 0, mrr: 0, status: "trial", signup: "2025-04-30", expires: "2025-05-14", lastLogin: "—", industry: "Real Estate" },
  { id: "t10", name: "InnovateLtd", slug: "innovate", email: "billing@innovate.com", country: "India", plan: "growth", modules: ["sales","hrms","pms","finance","wayofwork","mastersheet"], users: 42, mrr: 14999, status: "suspended", signup: "2024-04-10", expires: "2025-04-30", lastLogin: "3d ago", industry: "Manufacturing" },
  { id: "t11", name: "UrbanPro", slug: "urbanpro", email: "billing@urbanpro.com", country: "India", plan: "pro", modules: ALL_MODULES.map(m=>m.key), users: 110, mrr: 9999, status: "active", signup: "2024-07-22", expires: "2025-07-22", lastLogin: "4h ago", industry: "EdTech" },
  { id: "t12", name: "MedTech India", slug: "medtech", email: "ops@medtech.in", country: "India", plan: "custom", modules: ["hrms","pms","finance","wayofwork"], users: 55, mrr: 12000, status: "active", signup: "2024-08-15", expires: "2025-08-15", lastLogin: "1d ago", industry: "Healthcare" },
];

const seedDemo: DemoRequest[] = [
  { id: "dr1", company: "BuilderSpace", contact: "Karan Mehra", email: "karan@builderspace.io", phone: "+91 98765 11111", modules: ["sales","hrms","pms"], source: "Website", message: "Need PMS + Sales for 50-person team", requested: "2025-04-30", status: "new" },
  { id: "dr2", company: "HealthFirst", contact: "Dr. Sneha", email: "sneha@healthfirst.in", phone: "+91 98765 22222", modules: ["hrms","pms"], source: "LinkedIn", requested: "2025-04-28", status: "scheduled", scheduledAt: "2025-05-04 11:00", meetingLink: "https://meet.example/abc", assignedTo: "Rahul S" },
  { id: "dr3", company: "LogiCo", contact: "Vikram J", email: "vikram@logico.com", phone: "+91 98765 33333", modules: ["sales","finance"], source: "Referral", requested: "2025-04-22", status: "demo_done", assignedTo: "Priya S" },
  { id: "dr4", company: "RetailPro", contact: "Anita R", email: "anita@retailpro.in", phone: "+91 98765 44444", modules: ["sales","hrms"], source: "Event", requested: "2025-04-15", status: "converted", assignedTo: "Rahul S" },
  { id: "dr5", company: "FinanceApp", contact: "Mohit P", email: "mohit@financeapp.io", phone: "+91 98765 55555", modules: ["finance"], source: "Cold outreach", requested: "2025-04-10", status: "rejected", assignedTo: "Priya S" },
];

const seedDeals: CustomDeal[] = [
  { id: "cd1", name: "Wipro PMS+HRMS Bundle", tenantId: "t3", tenantName: "Wipro", modules: ["pms","hrms","wayofwork"], monthlyPrice: 8999, discountPct: 40, billingCycle: "annual", duration: "1 year", startDate: "2024-04-01", endDate: "2025-04-30", autoRenew: true, status: "active", owner: "Rahul S" },
  { id: "cd2", name: "Innovate Sales+Finance", tenantId: "t10", tenantName: "InnovateLtd", modules: ["sales","finance"], monthlyPrice: 3999, discountPct: 20, billingCycle: "monthly", duration: "6 months", startDate: "2024-10-01", endDate: "2025-04-01", autoRenew: false, status: "expired", owner: "Priya S" },
  { id: "cd3", name: "MedTech Bundle", tenantId: "t12", tenantName: "MedTech India", modules: ["hrms","pms","finance","wayofwork"], monthlyPrice: 12000, discountPct: 25, billingCycle: "annual", duration: "1 year", startDate: "2024-08-15", endDate: "2025-08-15", autoRenew: true, status: "active", owner: "Rahul S" },
  { id: "cd4", name: "TechGiant Negotiation", tenantName: "TechGiant", modules: ["sales","hrms","pms","finance"], monthlyPrice: 18000, discountPct: 30, billingCycle: "annual", duration: "2 years", startDate: "2025-05-15", endDate: "2027-05-15", autoRenew: true, status: "negotiating", owner: "Aarav M" },
];

const seedInvoices: Invoice[] = seedTenants.filter(t => t.mrr > 0).flatMap((t, i) => [
  { id: `inv-${t.id}-apr`, tenantId: t.id, tenantName: t.name, plan: t.plan, period: "Apr 2025", amount: t.mrr, tax: Math.round(t.mrr*0.18), total: Math.round(t.mrr*1.18), status: t.status === "payment_failed" ? "failed" : "paid", dueDate: "2025-04-05", paidDate: t.status === "payment_failed" ? undefined : "2025-04-03" },
  { id: `inv-${t.id}-may`, tenantId: t.id, tenantName: t.name, plan: t.plan, period: "May 2025", amount: t.mrr, tax: Math.round(t.mrr*0.18), total: Math.round(t.mrr*1.18), status: i % 5 === 0 ? "pending" : "paid", dueDate: "2025-05-05", paidDate: i % 5 === 0 ? undefined : "2025-05-02" },
]);

const seedTickets: SupportTicket[] = [
  { id: "SUP-0042", tenantId: "t1", tenantName: "TechCorp India", contact: "Arjun Mehta", subject: "Sales module leads not loading", category: "Bug", priority: "P2", status: "open", assignedTo: "Rahul S", created: "2025-05-03 10:12", lastReply: "2h ago",
    thread: [
      { from: "tenant", author: "Arjun Mehta", at: "2025-05-03 10:12", body: "Leads tab shows empty after Apr 30. Affecting 12 users." },
      { from: "agent", author: "Rahul S", at: "2025-05-03 11:30", body: "Investigating — looks like a cache invalidation issue." },
    ],
    internalNotes: [{ author: "Rahul S", at: "2025-05-03 11:31", body: "Cache key collision — fix in progress." }] },
  { id: "SUP-0041", tenantId: "t6", tenantName: "Nykaa", contact: "Priya N", subject: "Add SSO via Okta", category: "Feature", priority: "P3", status: "in_progress", assignedTo: "Priya S", created: "2025-05-02 14:00", lastReply: "5h ago", thread: [], internalNotes: [] },
  { id: "SUP-0040", tenantId: "t8", tenantName: "DesignHub", contact: "Rohit V", subject: "Payment failed retry", category: "Billing", priority: "P1", status: "open", assignedTo: "Aarav M", created: "2025-05-02 09:30", lastReply: "1d ago", thread: [], internalNotes: [] },
  { id: "SUP-0039", tenantId: "t11", tenantName: "UrbanPro", contact: "Meera J", subject: "Export CSV broken", category: "Bug", priority: "P3", status: "resolved", assignedTo: "Rahul S", created: "2025-05-01 16:20", lastReply: "1d ago", thread: [], internalNotes: [] },
  { id: "SUP-0038", tenantId: "t4", tenantName: "Zomato", contact: "Karthik V", subject: "API rate limit increase", category: "Request", priority: "P4", status: "in_progress", assignedTo: "Priya S", created: "2025-04-30 12:00", lastReply: "2d ago", thread: [], internalNotes: [] },
];

const seedActivity: ActivityEvent[] = [
  { id: "a1", at: "2h ago", text: "TechCorp upgraded Starter → Growth", kind: "plan", tenantId: "t1" },
  { id: "a2", at: "4h ago", text: "New trial signup: BuilderSpace", kind: "demo", tenantId: "t9" },
  { id: "a3", at: "Yesterday", text: "Wipro added HRMS module", kind: "module", tenantId: "t3" },
  { id: "a4", at: "Yesterday", text: "InnovateLtd payment failed", kind: "payment", tenantId: "t10" },
  { id: "a5", at: "2 days ago", text: "Demo request: BuilderSpace", kind: "demo", tenantId: "t9" },
  { id: "a6", at: "3 days ago", text: "Razorpay started 14-day trial", kind: "plan", tenantId: "t5" },
];

const seedAnnouncements: Announcement[] = [
  { id: "an1", title: "Sales module v2.4 — AI Score upgrade", type: "feature", content: "We've upgraded the AI Score model. Expect more accurate predictions.", audience: "All tenants with Sales module", channels: ["In-App","Email"], status: "sent", sentAt: "2025-04-28" },
  { id: "an2", title: "Scheduled maintenance — May 5, 2:00 AM IST", type: "maintenance", content: "Brief maintenance window for ~30 minutes.", audience: "All tenants", channels: ["In-App","Email"], status: "scheduled", scheduledAt: "2025-05-05 02:00" },
];

interface State {
  authed: boolean;
  authedAt?: string;
  user: { name: string; email: string; role: string };

  tenants: Tenant[];
  demoRequests: DemoRequest[];
  customDeals: CustomDeal[];
  plans: Plan[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  activity: ActivityEvent[];
  announcements: Announcement[];

  // actions
  login: (email: string, password: string, otp: string) => boolean;
  logout: () => void;

  addTenant: (t: Omit<Tenant, "id">) => Tenant;
  updateTenant: (id: string, patch: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  addDemoRequest: (d: Omit<DemoRequest, "id">) => DemoRequest;
  updateDemoRequest: (id: string, patch: Partial<DemoRequest>) => void;

  addCustomDeal: (d: Omit<CustomDeal, "id">) => CustomDeal;
  updateCustomDeal: (id: string, patch: Partial<CustomDeal>) => void;

  addInvoice: (inv: Omit<Invoice, "id">) => Invoice;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;

  upsertPlan: (p: Plan) => void;

  addTicketReply: (id: string, body: string, from: "tenant"|"agent") => void;
  updateTicket: (id: string, patch: Partial<SupportTicket>) => void;

  addAnnouncement: (a: Omit<Announcement, "id">) => Announcement;

  logActivity: (text: string, kind: ActivityEvent["kind"], tenantId?: string) => void;
}

const id = () => Math.random().toString(36).slice(2, 9);

export const useSuperAdminStore = create<State>()(
  persist(
    (set, get) => ({
      authed: false,
      user: { name: "Rahul Singh", email: "rahul@yourdomain.com", role: "Super Admin" },
      tenants: seedTenants,
      demoRequests: seedDemo,
      customDeals: seedDeals,
      plans: DEFAULT_PLANS,
      invoices: seedInvoices,
      tickets: seedTickets,
      activity: seedActivity,
      announcements: seedAnnouncements,

      login: (email, password, otp) => {
        if (email && password && otp.length === 6) {
          set({ authed: true, authedAt: new Date().toISOString() });
          return true;
        }
        return false;
      },
      logout: () => set({ authed: false }),

      addTenant: (t) => {
        const tenant: Tenant = { ...t, id: id() };
        set(s => ({ tenants: [tenant, ...s.tenants] }));
        get().logActivity(`Tenant created: ${tenant.name}`, "admin", tenant.id);
        return tenant;
      },
      updateTenant: (tid, patch) => set(s => ({ tenants: s.tenants.map(t => t.id === tid ? { ...t, ...patch } : t) })),
      deleteTenant: (tid) => set(s => ({ tenants: s.tenants.filter(t => t.id !== tid) })),

      addDemoRequest: (d) => {
        const dr: DemoRequest = { ...d, id: id() };
        set(s => ({ demoRequests: [dr, ...s.demoRequests] }));
        return dr;
      },
      updateDemoRequest: (did, patch) => set(s => ({ demoRequests: s.demoRequests.map(d => d.id === did ? { ...d, ...patch } : d) })),

      addCustomDeal: (d) => {
        const cd: CustomDeal = { ...d, id: id() };
        set(s => ({ customDeals: [cd, ...s.customDeals] }));
        get().logActivity(`Custom deal created: ${cd.name}`, "admin", cd.tenantId);
        return cd;
      },
      updateCustomDeal: (cid, patch) => set(s => ({ customDeals: s.customDeals.map(d => d.id === cid ? { ...d, ...patch } : d) })),

      addInvoice: (inv) => {
        const i: Invoice = { ...inv, id: `inv-${id()}` };
        set(s => ({ invoices: [i, ...s.invoices] }));
        return i;
      },
      updateInvoice: (iid, patch) => set(s => ({ invoices: s.invoices.map(i => i.id === iid ? { ...i, ...patch } : i) })),

      upsertPlan: (p) => set(s => {
        const exists = s.plans.find(x => x.key === p.key);
        return { plans: exists ? s.plans.map(x => x.key === p.key ? p : x) : [...s.plans, p] };
      }),

      addTicketReply: (tid, body, from) => set(s => ({
        tickets: s.tickets.map(t => t.id === tid ? {
          ...t,
          thread: [...t.thread, { from, author: from === "agent" ? get().user.name : t.contact, at: new Date().toISOString().slice(0,16).replace("T"," "), body }],
          lastReply: "just now",
        } : t)
      })),
      updateTicket: (tid, patch) => set(s => ({ tickets: s.tickets.map(t => t.id === tid ? { ...t, ...patch } : t) })),

      addAnnouncement: (a) => {
        const an: Announcement = { ...a, id: id() };
        set(s => ({ announcements: [an, ...s.announcements] }));
        return an;
      },

      logActivity: (text, kind, tenantId) => set(s => ({
        activity: [{ id: id(), at: "just now", text, kind, tenantId }, ...s.activity].slice(0, 100)
      })),
    }),
    { name: "super-admin-store-v1" }
  )
);

// helpers
export const planLabel = (k: PlanKey) =>
  ({ trial: "Trial", starter: "Starter", growth: "Growth", pro: "Pro", enterprise: "Enterprise", custom: "Custom" } as const)[k];

export const fmtINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

export const computeMRR = (tenants: Tenant[]) => tenants.filter(t => t.status === "active").reduce((s, t) => s + t.mrr, 0);
