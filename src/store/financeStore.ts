import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMPANIES, PEOPLE, daysFromNow, pick } from "@/lib/mockData";

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
export type ExpenseStatus = "Pending" | "Approved" | "Rejected" | "Reimbursed";

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: { description: string; qty: number; rate: number }[];
}
export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  submittedById: string;
  date: string;
  status: ExpenseStatus;
  description?: string;
}
export interface Budget {
  id: string;
  department: string;
  category: string;
  allocated: number;
  spent: number;
  period: string;
}
export interface Automation {
  id: string; name: string; trigger: string; action: string; active: boolean; lastTriggered?: string;
}

const seedInvoices: Invoice[] = Array.from({ length: 12 }).map((_, i) => {
  const amt = [50000, 125000, 380000, 720000, 1500000, 220000, 95000, 410000, 680000, 1200000, 175000, 540000][i];
  const status: InvoiceStatus = i < 5 ? "Paid" : i < 8 ? "Sent" : i < 10 ? "Overdue" : i === 10 ? "Draft" : "Cancelled";
  return {
    id: `inv${i + 1}`, number: `INV-${String(2401 + i).padStart(4, "0")}`,
    client: pick(COMPANIES, i), amount: amt,
    issueDate: daysFromNow(-(60 - i * 4)), dueDate: daysFromNow(-30 + i * 5), status,
    items: [{ description: "Professional services", qty: 1, rate: amt }],
  };
});

const seedExpenses: Expense[] = [
  { id: "e1", title: "Client lunch — Razorpay", category: "Meals", amount: 4500, submittedById: "p2", date: daysFromNow(-2), status: "Pending" },
  { id: "e2", title: "Mumbai travel", category: "Travel", amount: 28500, submittedById: "p1", date: daysFromNow(-5), status: "Approved" },
  { id: "e3", title: "Adobe CC subscription", category: "Software", amount: 4720, submittedById: "p5", date: daysFromNow(-7), status: "Reimbursed" },
  { id: "e4", title: "Office supplies", category: "Office", amount: 6300, submittedById: "p9", date: daysFromNow(-3), status: "Pending" },
  { id: "e5", title: "Conference ticket", category: "Training", amount: 35000, submittedById: "p4", date: daysFromNow(-12), status: "Approved" },
  { id: "e6", title: "Client dinner — Zepto", category: "Meals", amount: 8200, submittedById: "p10", date: daysFromNow(-1), status: "Pending" },
  { id: "e7", title: "Cab to airport", category: "Travel", amount: 1800, submittedById: "p2", date: daysFromNow(-8), status: "Rejected", description: "Personal travel — not reimbursable" },
  { id: "e8", title: "AWS credits top-up", category: "Software", amount: 75000, submittedById: "p4", date: daysFromNow(-15), status: "Reimbursed" },
];

const seedBudgets: Budget[] = [
  { id: "b1", department: "Engineering", category: "Cloud", allocated: 1500000, spent: 1180000, period: "Q1 2025" },
  { id: "b2", department: "Engineering", category: "Tools", allocated: 600000, spent: 420000, period: "Q1 2025" },
  { id: "b3", department: "Sales", category: "Travel", allocated: 800000, spent: 650000, period: "Q1 2025" },
  { id: "b4", department: "Sales", category: "Marketing", allocated: 1200000, spent: 1320000, period: "Q1 2025" },
  { id: "b5", department: "HR", category: "Training", allocated: 400000, spent: 180000, period: "Q1 2025" },
  { id: "b6", department: "Operations", category: "Office", allocated: 350000, spent: 290000, period: "Q1 2025" },
];

const seedAutomations: Automation[] = [
  { id: "fa1", name: "Mark overdue at T+3", trigger: "Invoice unpaid > 3d after due", action: "Set status Overdue", active: true, lastTriggered: "30m ago" },
  { id: "fa2", name: "Reminder for unpaid invoices", trigger: "Daily 9 AM", action: "Email overdue clients", active: true, lastTriggered: "today" },
  { id: "fa3", name: "Notify on expense > ₹50K", trigger: "Expense submitted > 50000", action: "Notify Finance Head", active: true },
  { id: "fa4", name: "Auto-approve recurring vendors", trigger: "Approved vendor + < ₹10K", action: "Auto-approve", active: false },
];

interface FinanceState {
  invoices: Invoice[]; expenses: Expense[]; budgets: Budget[]; automations: Automation[];
  addInvoice: (i: Omit<Invoice, "id">) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  setExpenseStatus: (id: string, status: ExpenseStatus) => void;
  toggleAutomation: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      invoices: seedInvoices, expenses: seedExpenses, budgets: seedBudgets, automations: seedAutomations,
      addInvoice: (i) => set(s => ({ invoices: [{ ...i, id: `inv${Date.now()}` }, ...s.invoices] })),
      setInvoiceStatus: (id, status) => set(s => ({ invoices: s.invoices.map(x => x.id === id ? { ...x, status } : x) })),
      addExpense: (e) => set(s => ({ expenses: [{ ...e, id: `e${Date.now()}` }, ...s.expenses] })),
      setExpenseStatus: (id, status) => set(s => ({ expenses: s.expenses.map(x => x.id === id ? { ...x, status } : x) })),
      toggleAutomation: (id) => set(s => ({ automations: s.automations.map(a => a.id === id ? { ...a, active: !a.active } : a) })),
    }),
    { name: "crm-finance-state" }
  )
);
