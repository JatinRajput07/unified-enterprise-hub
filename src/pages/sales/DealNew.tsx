import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSalesStore, ALL_DEAL_STAGES, type DealStage, type Currency } from "@/store/salesStore";
import { PEOPLE } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function DealNew() {
  const nav = useNavigate();
  const { toast } = useToast();
  const addDeal = useSalesStore((s) => s.addDeal);
  const companies = useSalesStore((s) => s.companies);
  const contacts = useSalesStore((s) => s.contacts);

  const [form, setForm] = useState({
    name: "",
    companyId: companies[0]?.id ?? "",
    contactId: contacts[0]?.id ?? "",
    ownerId: "p2",
    value: 250000,
    currency: "INR" as Currency,
    stage: "Discovery" as DealStage,
    probability: 15,
    expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    source: "Website" as any,
    notes: "",
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function onSubmit() {
    if (!form.name) { toast({ title: "Deal name required", variant: "destructive" }); return; }
    const id = addDeal(form);
    toast({ title: "Deal created" });
    nav(`/sales/deals/${id}`);
  }

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="New Deal" subtitle="Create a new sales opportunity" accentVar="--mod-sales" />
      <div className="p-4 max-w-3xl space-y-4">
        <div className="bg-surface border border-border rounded-sm p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Deal Details</h3>
          <div className="space-y-1">
            <Label className="text-xs">Deal Name *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Acme – CRM Implementation" className="h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Company</Label>
              <select value={form.companyId} onChange={(e) => set("companyId", e.target.value)} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Primary Contact</Label>
              <select value={form.contactId} onChange={(e) => set("contactId", e.target.value)} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                {contacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Value</Label>
              <Input type="number" value={form.value} onChange={(e) => set("value", +e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Currency</Label>
              <select value={form.currency} onChange={(e) => set("currency", e.target.value as Currency)} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Expected Close</Label>
              <Input type="date" value={form.expectedCloseDate} onChange={(e) => set("expectedCloseDate", e.target.value)} className="h-8 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Stage</Label>
              <select value={form.stage} onChange={(e) => set("stage", e.target.value as DealStage)} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                {ALL_DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Probability %</Label>
              <Input type="number" min={0} max={100} value={form.probability} onChange={(e) => set("probability", +e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Owner</Label>
              <select value={form.ownerId} onChange={(e) => set("ownerId", e.target.value)} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                {PEOPLE.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="text-xs" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => nav(-1)}>Cancel</Button>
          <Button size="sm" className="h-8 text-xs" onClick={onSubmit}>Create Deal</Button>
        </div>
      </div>
    </div>
  );
}