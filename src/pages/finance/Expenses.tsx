import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinanceStore, type ExpenseStatus } from "@/store/financeStore";
import { useCurrentUser } from "@/store/appStore";
import { PEOPLE, inr, daysFromNow } from "@/lib/mockData";
import { peopleById } from "@/store/wowStore";
import { Plus, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const variant: Record<ExpenseStatus, any> = { Pending: "warning", Approved: "success", Rejected: "danger", Reimbursed: "info" };
const CATS = ["Travel","Meals","Office","Software","Training","Other"];

export default function Expenses() {
  const { expenses, addExpense, setExpenseStatus } = useFinanceStore();
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(CATS[0]);
  const [date, setDate] = useState(daysFromNow(0));
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!title.trim() || !amount) { toast({ title: "Title and amount required", variant: "destructive" }); return; }
    addExpense({ title, amount, category, submittedById: user.id, date, status: "Pending", description });
    toast({ title: "Expense submitted", description: title });
    setOpen(false); setTitle(""); setAmount(0); setDescription("");
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Expenses" subtitle={`${expenses.length} total`} accentVar="--mod-finance"
        actions={<Button size="sm" className="h-7 text-xs gap-1" style={{ background: "hsl(var(--mod-finance))" }} onClick={() => setOpen(true)}><Plus className="w-3.5 h-3.5" /> Add Expense</Button>} />
      <FilterBar />
      <div className="p-3 flex-1">
        <Panel title="Expense Reports">
          <DataTable
            rowKey={(r) => r.id} rows={expenses}
            columns={[
              { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "category", label: "Category", render: (r) => <StatusPill variant="neutral">{r.category}</StatusPill> },
              { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-mono tabular-nums">{inr(r.amount)}</span> },
              { key: "by", label: "Submitted By", render: (r) => peopleById(r.submittedById).name },
              { key: "date", label: "Date", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.date}</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill variant={variant[r.status]}>{r.status}</StatusPill> },
              { key: "actions", label: "Actions", render: (r) => r.status === "Pending" ? (
                <div className="flex gap-1">
                  <button onClick={() => { setExpenseStatus(r.id, "Approved"); toast({ title: "Approved" }); }} className="w-6 h-6 rounded hover:bg-success/10 text-success flex items-center justify-center" title="Approve"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { setExpenseStatus(r.id, "Rejected"); toast({ title: "Rejected" }); }} className="w-6 h-6 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center" title="Reject"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (r.status === "Approved" ? (
                <button onClick={() => { setExpenseStatus(r.id, "Reimbursed"); toast({ title: "Reimbursed" }); }} className="text-2xs text-primary hover:underline">Reimburse</button>
              ) : null) },
            ]}
          />
        </Panel>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-3 text-xs">
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(+e.target.value)} /></div>
              <div><Label>Category</Label>
                <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} style={{ background: "hsl(var(--mod-finance))" }}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
