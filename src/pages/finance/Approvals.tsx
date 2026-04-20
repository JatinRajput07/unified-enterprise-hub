import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { useFinanceStore } from "@/store/financeStore";
import { inr } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { peopleById } from "@/store/wowStore";

export default function Approvals() {
  const { expenses, setExpenseStatus } = useFinanceStore();
  const pending = expenses.filter(e => e.status === "Pending");

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Approvals" subtitle={`${pending.length} pending`} accentVar="--mod-finance" />
      <FilterBar />
      <div className="p-3">
        <Panel title="Pending Approvals">
          <DataTable
            rowKey={(r) => r.id} rows={pending}
            columns={[
              { key: "title", label: "Item", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "type", label: "Type", render: () => <StatusPill variant="info">Expense</StatusPill> },
              { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-mono">{inr(r.amount)}</span> },
              { key: "by", label: "By", render: (r) => peopleById(r.submittedById).name },
              { key: "date", label: "Date", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.date}</span> },
              { key: "actions", label: "Actions", render: (r) => (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/40" onClick={() => { setExpenseStatus(r.id, "Rejected"); toast({ title: "Rejected" }); }}><X className="w-3 h-3" /> Reject</Button>
                  <Button size="sm" className="h-7 text-xs gap-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => { setExpenseStatus(r.id, "Approved"); toast({ title: "Approved" }); }}><Check className="w-3 h-3" /> Approve</Button>
                </div>
              )},
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
