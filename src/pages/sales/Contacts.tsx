import { useMemo, useState } from "react";
import { Plus, Search, Mail, Phone, Linkedin } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlideOver } from "@/components/ui/SlideOver";
import { useSalesStore } from "@/store/salesStore";
import { PEOPLE } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function Contacts() {
  const contacts = useSalesStore((s) => s.contacts);
  const companies = useSalesStore((s) => s.companies);
  const addContact = useSalesStore((s) => s.addContact);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", designation: "", companyId: companies[0]?.id ?? "", ownerId: "p2", linkedin: "", tags: [] as string[] });

  const filtered = useMemo(() => {
    if (!search) return contacts;
    const s = search.toLowerCase();
    return contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
  }, [contacts, search]);

  function submit() {
    if (!form.firstName || !form.email) { toast({ title: "Name & email required", variant: "destructive" }); return; }
    addContact(form);
    toast({ title: "Contact created" });
    setOpen(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", designation: "", companyId: companies[0]?.id ?? "", ownerId: "p2", linkedin: "", tags: [] });
  }

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Contacts"
        subtitle={`${contacts.length} contacts`}
        accentVar="--mod-sales"
        actions={<Button size="sm" className="h-7 text-xs gap-1" onClick={() => setOpen(true)}><Plus className="w-3.5 h-3.5" /> New Contact</Button>}
      />
      <div className="h-10 px-3 flex items-center gap-2 border-b border-border bg-surface/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts…" className="h-7 pl-7 w-56 text-xs" />
        </div>
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map(c => {
          const co = companies.find(x => x.id === c.companyId);
          const owner = PEOPLE.find(p => p.id === c.ownerId);
          return (
            <div key={c.id} className="bg-surface border border-border rounded-sm p-3 hover:border-primary">
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-xs font-bold">
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{c.firstName} {c.lastName}</div>
                  <div className="text-3xs text-muted-foreground truncate">{c.designation} · {co?.name}</div>
                </div>
              </div>
              <div className="mt-2 space-y-1 text-2xs text-muted-foreground">
                <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-primary truncate"><Mail className="w-3 h-3" />{c.email}</a>
                {c.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{c.phone}</div>}
                {c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary"><Linkedin className="w-3 h-3" />LinkedIn</a>}
              </div>
              <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                <div className="flex gap-1">{c.tags.map(t => <span key={t} className="text-3xs px-1.5 h-4 rounded-sm bg-muted">{t}</span>)}</div>
                <span className="text-3xs text-muted-foreground font-mono">{owner?.initials}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">No contacts</div>}
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)} title="New Contact" footer={<><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setOpen(false)}>Cancel</Button><Button size="sm" className="h-8 text-xs" onClick={submit}>Create</Button></>}>
        <div className="space-y-3 p-1">
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">First Name *</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Last Name</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="h-8 text-xs" /></div>
          </div>
          <div><Label className="text-xs">Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-8 text-xs" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-8 text-xs" /></div>
          <div><Label className="text-xs">Designation</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="h-8 text-xs" /></div>
          <div><Label className="text-xs">Company</Label>
            <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className="w-full h-8 px-2 rounded-sm bg-background border border-border text-xs">
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">LinkedIn URL</Label><Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="h-8 text-xs" /></div>
        </div>
      </SlideOver>
    </div>
  );
}