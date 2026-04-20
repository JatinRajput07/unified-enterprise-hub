import { useState } from "react";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlideOver } from "@/components/ui/SlideOver";
import { useFinanceStore, type InvoiceStatus } from "@/store/financeStore";
import { COMPANIES, inr, daysFromNow } from "@/lib/mockData";
import { Plus, X, Trash2, Send, CheckCircle, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const variant: Record<InvoiceStatus, any> = { Draft: "neutral", Sent: "info", Paid: "success", Overdue: "danger", Cancelled: "neutral" };

export default function Invoices() {
  const { invoices, addInvoice, setInvoiceStatus } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState(COMPANIES[0]);
  const [items, setItems] = useState([{ description: "Consulting services", qty: 1, rate: 100000, tax: 18 }]);
  const [number, setNumber] = useState(`INV-${String(2500 + invoices.length).padStart(4, "0")}`);
  const [issue, setIssue] = useState(daysFromNow(0));
  const [due, setDue] = useState(daysFromNow(30));

  const total = items.reduce((a, i) => a + i.qty * i.rate * (1 + i.tax / 100), 0);

  const send = (status: InvoiceStatus) => {
    addInvoice({
      number, client, amount: Math.round(total),
      issueDate: issue, dueDate: due, status,
      items: items.map(({ description, qty, rate }) => ({ description, qty, rate })),
    });
    toast({ title: status === "Draft" ? "Saved as draft" : "Invoice sent", description: number });
    setOpen(false);
    setItems([{ description: "Consulting services", qty: 1, rate: 100000, tax: 18 }]);
    setNumber(`INV-${String(2500 + invoices.length + 1).padStart(4, "0")}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Invoices"
        subtitle={`${invoices.length} total · ${inr(invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0))} collected`}
        accentVar="--mod-finance"
        actions={
          <Button size="sm" className="h-7 text-xs gap-1" style={{ background: "hsl(var(--mod-finance))" }} onClick={() => setOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Create Invoice
          </Button>
        }
      />
      <FilterBar />
      <div className="p-3 flex-1">
        <Panel title="All Invoices">
          <DataTable
            rowKey={(r) => r.id} rows={invoices}
            columns={[
              { key: "number", label: "#", render: (r) => <span className="font-mono text-2xs">{r.number}</span> },
              { key: "client", label: "Client", render: (r) => <span className="font-medium">{r.client}</span> },
              { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-mono tabular-nums">{inr(r.amount)}</span> },
              { key: "issueDate", label: "Issued", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.issueDate}</span> },
              { key: "dueDate", label: "Due", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.dueDate}</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill variant={variant[r.status]}>{r.status}</StatusPill> },
              { key: "actions", label: "Actions", render: (r) => (
                <div className="flex gap-1">
                  <button title="Download" className="w-6 h-6 rounded hover:bg-surface-hover flex items-center justify-center text-muted-foreground"><Download className="w-3.5 h-3.5" /></button>
                  {r.status !== "Paid" && r.status !== "Cancelled" && (
                    <button title="Mark paid" onClick={() => { setInvoiceStatus(r.id, "Paid"); toast({ title: "Marked paid" }); }} className="w-6 h-6 rounded hover:bg-success/10 text-success flex items-center justify-center"><CheckCircle className="w-3.5 h-3.5" /></button>
                  )}
                  {r.status === "Sent" && (
                    <button title="Send reminder" onClick={() => toast({ title: "Reminder sent", description: r.client })} className="w-6 h-6 rounded hover:bg-primary/10 text-primary flex items-center justify-center"><Send className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              )},
            ]}
          />
        </Panel>
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)} title="Create Invoice" width="xl"
        footer={<>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="outline" onClick={() => send("Draft")}>Save Draft</Button>
          <Button onClick={() => send("Sent")} style={{ background: "hsl(var(--mod-finance))" }}>Send Invoice</Button>
        </>}>
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Invoice #</Label><Input value={number} onChange={e => setNumber(e.target.value)} /></div>
            <div><Label>Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{COMPANIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Issue date</Label><Input type="date" value={issue} onChange={e => setIssue(e.target.value)} /></div>
            <div><Label>Due date</Label><Input type="date" value={due} onChange={e => setDue(e.target.value)} /></div>
          </div>
          <div>
            <Label>Line items</Label>
            <table className="w-full text-xs mt-1">
              <thead className="bg-muted/40"><tr className="text-2xs uppercase text-muted-foreground"><th className="text-left px-2 h-7">Description</th><th className="text-right px-2 h-7 w-16">Qty</th><th className="text-right px-2 h-7 w-28">Rate</th><th className="text-right px-2 h-7 w-16">Tax%</th><th className="text-right px-2 h-7 w-28">Total</th><th className="w-8"></th></tr></thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-2 py-1"><Input className="h-7 text-xs" value={it.description} onChange={e => { const n = [...items]; n[i].description = e.target.value; setItems(n); }} /></td>
                    <td className="px-2 py-1"><Input className="h-7 text-xs text-right" type="number" value={it.qty} onChange={e => { const n = [...items]; n[i].qty = +e.target.value; setItems(n); }} /></td>
                    <td className="px-2 py-1"><Input className="h-7 text-xs text-right" type="number" value={it.rate} onChange={e => { const n = [...items]; n[i].rate = +e.target.value; setItems(n); }} /></td>
                    <td className="px-2 py-1"><Input className="h-7 text-xs text-right" type="number" value={it.tax} onChange={e => { const n = [...items]; n[i].tax = +e.target.value; setItems(n); }} /></td>
                    <td className="px-2 py-1 font-mono text-right tabular-nums">{inr(it.qty * it.rate * (1 + it.tax / 100))}</td>
                    <td><button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-destructive"><X className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1" onClick={() => setItems([...items, { description: "", qty: 1, rate: 0, tax: 18 }])}>
              <Plus className="w-3.5 h-3.5" /> Add line
            </Button>
          </div>
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-border">
            <span className="text-2xs uppercase text-muted-foreground tracking-wider">Total</span>
            <span className="font-mono text-lg font-bold tabular-nums">{inr(total)}</span>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
