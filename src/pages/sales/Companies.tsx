import { useMemo, useState } from "react";
import { Plus, Search, Globe } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/ui/StatusPill";
import { SlideOver } from "@/components/ui/SlideOver";
import { useSalesStore } from "@/store/salesStore";
import { PEOPLE, inr } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function Companies() {
  const companies = useSalesStore((s) => s.companies);
  const deals = useSalesStore((s) => s.deals);
  const contacts = useSalesStore((s) => s.contacts);
  const addCompany = useSalesStore((s) => s.addCompany);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", website: "", industry: "Technology", size: "11-50", country: "India", ownerId: "p2", arr: 0, status: "Prospect" as const, tags: [] as string[] });

  const filtered = useMemo(() => search ? companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : companies, [companies, search]);

  function submit() {
    if (!form.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    addCompany(form);
    toast({ title: "Company added" });
    setOpen(false);
  }

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Companies"
        subtitle={`${companies.length} accounts`}
        accentVar="--mod-sales"
        actions={<Button size="sm" className="h-7 text-xs gap-1" onClick={() => setOpen(true)}><Plus className="w-3.5 h-3.5" /> New Company</Button>}
      />
      <div className="h-10 px-3 flex items-center gap-2 border-b border-border bg-surface/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies…" className="h-7 pl-7 w-56 text-xs" />
        </div>
      </div>
      <div className="p-3 flex-1">
        <div className="bg-surface border border-border rounded-sm overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40">
              <tr className="text-2xs uppercase text-muted-foreground tracking-wider">
                <th className="text-left px-3 h-8 font-medium">Company</th>
                <th className="text-left px-3 h-8 font-medium">Industry</th>
                <th className="text-left px-3 h-8 font-medium">Size</th>
                <th className="text-left px-3 h-8 font-medium">Country</th>
                <th className="text-center px-3 h-8 font-medium">Contacts</th>
                <th className="text-center px-3 h-8 font-medium">Deals</th>
                <th className="text-right px-3 h-8 font-medium">ARR</th>
                <th className="text-left px-3 h-8 font-medium">Status</th>
                <th className="text-left px-3 h-8 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const owner = PEOPLE.find(p => p.id === c.ownerId);
                const dealCount = deals.filter(d => d.companyId === c.id).length;
                const ctCount = contacts.filter(x => x.companyId === c.id).length;
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-hover">
                    <td className="px-3 h-10">
                      <div className="font-medium">{c.name}</div>
                      {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-3xs text-muted-foreground hover:text-primary flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{c.website.replace(/https?:\/\//, "")}</a>}
                    </td>
                    <td className="px-3 h-10 text-muted-foreground">{c.industry}</td>
                    <td className="px-3 h-10 font-mono text-2xs">{c.size}</td>
                    <td className="px-3 h-10 text-muted-foreground">{c.country}</td>
                    <td className="px-3 h-10 text-center font-mono">{ctCount}</td>
                    <td className="px-3 h-10 text-center font-mono">{dealCount}</td>
                    <td className="px-3 h-10 text-right font-mono">{c.arr ? inr(c.arr) : "—"}</td>
                    <td className="px-3 h-10"><StatusPill variant={c.status === "Customer" ? "success" : c.status === "Churned" ? "danger" : "info"}>{c.status}</StatusPill></td>
                    <td className="px-3 h-10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-3xs font-bold">{owner?.initials}</div>
                        <span className="truncate max-w-[100px]">{owner?.name}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)} title="New Company" footer={<><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setOpen(false)}>Cancel</Button><Button size="sm" className="h-8 text-xs" onClick={submit}>Create</Button></>}>
        <div className="space-y-3 p-1">
          <div><Label className="text-xs">Company Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-8 text-xs" /></div>
          <div><Label className="text-xs">Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="h-8 text-xs" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Industry</Label>
              <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                {["Technology","E-commerce","Healthcare","Finance","Education","Retail"].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Size</Label>
              <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
                {["1-10","11-50","51-200","201-1000","1000+"].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="h-8 text-xs" /></div>
            <div><Label className="text-xs">ARR (₹)</Label><Input type="number" value={form.arr} onChange={(e) => setForm({ ...form, arr: +e.target.value })} className="h-8 text-xs" /></div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}