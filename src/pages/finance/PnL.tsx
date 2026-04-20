import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { useFinanceStore } from "@/store/financeStore";
import { inr } from "@/lib/mockData";
import { Download, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PnL() {
  const { invoices, expenses } = useFinanceStore();
  const [period, setPeriod] = useState("Quarterly");

  const revenue = invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const cogs = Math.round(revenue * 0.42);
  const grossProfit = revenue - cogs;
  const opex = expenses.filter(e => e.status !== "Rejected").reduce((a, e) => a + e.amount, 0) + 1850000;
  const netProfit = grossProfit - opex;

  const lines = [
    { label: "Revenue", curr: revenue, prev: revenue * 0.84, group: "rev" },
    { label: "Cost of Goods Sold", curr: -cogs, prev: -(cogs * 0.9), group: "cogs" },
    { label: "Gross Profit", curr: grossProfit, prev: grossProfit * 0.78, group: "gp", bold: true },
    { label: "Salaries", curr: -1200000, prev: -1080000, group: "opex" },
    { label: "Marketing", curr: -320000, prev: -290000, group: "opex" },
    { label: "Software & Tools", curr: -180000, prev: -160000, group: "opex" },
    { label: "Travel & Entertainment", curr: -85000, prev: -65000, group: "opex" },
    { label: "Other Operating Expenses", curr: -65000, prev: -52000, group: "opex" },
    { label: "Total Operating Expenses", curr: -opex, prev: -(opex * 0.9), group: "opex-total", bold: true },
    { label: "Net Profit / (Loss)", curr: netProfit, prev: netProfit * 0.7, group: "net", bold: true },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="P&L Statement" subtitle="Profit & loss · Q1 2025 vs Q4 2024" accentVar="--mod-finance"
        actions={<>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Quarterly">Quarterly</SelectItem><SelectItem value="Yearly">Yearly</SelectItem></SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3.5 h-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><FileSpreadsheet className="w-3.5 h-3.5" /> Excel</Button>
        </>} />
      <FilterBar />
      <div className="p-4 flex-1">
        <div className="bg-surface border border-border rounded-lg max-w-3xl mx-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-semibold">Profit & Loss Statement</h2>
            <p className="text-xs text-muted-foreground">{period} · All figures in ₹</p>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-muted/40">
              <tr className="text-2xs uppercase text-muted-foreground tracking-wider">
                <th className="text-left px-4 h-9">Line Item</th>
                <th className="text-right px-4 h-9">Current Period</th>
                <th className="text-right px-4 h-9">Previous Period</th>
                <th className="text-right px-4 h-9">YoY %</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const yoy = ((l.curr - l.prev) / Math.abs(l.prev)) * 100;
                return (
                  <tr key={i} className={`border-t border-border ${l.bold ? "bg-muted/30" : ""}`}>
                    <td className={`px-4 h-9 ${l.bold ? "font-bold" : ""} ${l.group === "opex" ? "pl-8 text-muted-foreground" : ""}`}>{l.label}</td>
                    <td className={`px-4 h-9 text-right font-mono tabular-nums ${l.bold ? "font-bold" : ""} ${l.curr < 0 ? "text-destructive" : ""}`}>{inr(Math.abs(l.curr))}</td>
                    <td className="px-4 h-9 text-right font-mono tabular-nums text-muted-foreground">{inr(Math.abs(l.prev))}</td>
                    <td className={`px-4 h-9 text-right font-mono tabular-nums ${yoy > 0 ? "text-success" : "text-destructive"}`}>{yoy > 0 ? "+" : ""}{yoy.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
