import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, Receipt, Wallet, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const REPORTS = [
  { id: "rev", name: "Revenue Summary", icon: TrendingUp, desc: "Detailed revenue breakdown by client and period." },
  { id: "exp", name: "Expense Report", icon: Receipt, desc: "All expenses grouped by category and submitter." },
  { id: "age", name: "Invoice Aging", icon: FileText, desc: "Outstanding invoices grouped by 0-30, 30-60, 60-90, 90+ days." },
  { id: "bud", name: "Budget vs Actual", icon: BarChart3, desc: "Variance analysis across departments and categories." },
  { id: "cf", name: "Cash Flow", icon: Wallet, desc: "Operating, investing, and financing cash flows." },
];

export default function FinanceReports() {
  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Reports" subtitle="Generate and export finance reports" accentVar="--mod-finance" />
      <FilterBar />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORTS.map(r => (
          <div key={r.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="w-10 h-10 rounded-md flex items-center justify-center mb-3" style={{ background: "hsl(var(--mod-finance) / 0.15)", color: "hsl(var(--mod-finance))" }}>
              <r.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold mb-1">{r.name}</h3>
            <p className="text-2xs text-muted-foreground mb-3">{r.desc}</p>
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs flex-1" onClick={() => toast({ title: "Generated", description: r.name })} style={{ background: "hsl(var(--mod-finance))" }}>Generate</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast({ title: "Export started", description: r.name })}><Download className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
