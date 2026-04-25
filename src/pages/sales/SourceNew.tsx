import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesStore, type SourcePlatform, type SourceAccount } from "@/store/salesStore";
import { PEOPLE } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const PLATFORMS: SourcePlatform[] = ["Upwork", "LinkedIn", "Fiverr", "Toptal", "Freelancer", "Twitter/X", "Facebook", "Instagram", "Google Ads", "Email", "Event", "Website", "Other"];

export default function SourceNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addSource = useSalesStore((s) => s.addSource);

  const [form, setForm] = useState<Partial<SourceAccount>>({
    platform: "Upwork", currency: "USD", rateType: "Hourly", status: "Active", tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.platform) e.platform = "Platform required";
    if (!form.url || !/^https?:\/\//.test(form.url)) e.url = "Valid URL required";
    if (!form.username || form.username.length < 2) e.username = "Min 2 chars";
    if (!form.ownerId) e.ownerId = "Owner required";
    if (form.rateType !== "Free" && (!form.rateAmount || form.rateAmount <= 0)) e.rateAmount = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) {
      toast({ title: "Please fix the errors", variant: "destructive" });
      return;
    }
    const id = addSource({
      platform: form.platform!,
      url: form.url!,
      username: form.username!,
      displayName: form.displayName || `${form.username} (${form.platform})`,
      ownerId: form.ownerId!,
      secondaryOwnerId: form.secondaryOwnerId,
      rateType: form.rateType as SourceAccount["rateType"],
      rateAmount: form.rateAmount,
      currency: form.currency as "INR" | "USD",
      status: form.status as SourceAccount["status"],
      jss: form.jss,
      rating: form.rating,
      notes: form.notes,
      tags: form.tags ?? [],
    });
    toast({ title: "Source account created", description: form.displayName });
    navigate(`/sales/sources/${id}`);
  }

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Add Source Account"
        subtitle="Sales › Sources › New"
        accentVar="--mod-sales"
        actions={
          <>
            <Link to="/sales/sources"><Button variant="outline" size="sm" className="h-7 text-xs gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Cancel</Button></Link>
            <Button size="sm" className="h-7 text-xs gap-1" onClick={submit}><Save className="w-3.5 h-3.5" /> Save</Button>
          </>
        }
      />
      <div className="p-4 max-w-3xl space-y-4">
        <Section title="1. Platform">
          <div>
            <Label>Platform *</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mt-1.5">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, platform: p })}
                  className={`h-9 px-2 rounded-sm border text-xs font-medium ${form.platform === p ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-surface-hover"}`}
                >{p}</button>
              ))}
            </div>
            {errors.platform && <p className="text-2xs text-destructive mt-1">{errors.platform}</p>}
          </div>
          <Field label="Platform Account URL *" error={errors.url}>
            <Input value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.upwork.com/freelancers/your-username" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username *" error={errors.username}>
              <Input value={form.username ?? ""} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="bhavya_dev" />
            </Field>
            <Field label="Display Name">
              <Input value={form.displayName ?? ""} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Bhavya Dev ($23/hr)" />
            </Field>
          </div>
        </Section>

        <Section title="2. Account Owner">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary Owner *" error={errors.ownerId}>
              <Select value={form.ownerId} onValueChange={(v) => setForm({ ...form, ownerId: v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>{PEOPLE.map(p => <SelectItem key={p.id} value={p.id}>{p.name} · {p.dept}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Secondary Owner">
              <Select value={form.secondaryOwnerId} onValueChange={(v) => setForm({ ...form, secondaryOwnerId: v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>{PEOPLE.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
        </Section>

        <Section title="3. Pricing & Cost">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rate Type *">
              <Select value={form.rateType} onValueChange={(v: any) => setForm({ ...form, rateType: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Monthly Subscription">Monthly Subscription</SelectItem>
                  <SelectItem value="Per Lead">Per Lead</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Currency">
              <Select value={form.currency} onValueChange={(v: any) => setForm({ ...form, currency: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="INR">INR (₹)</SelectItem></SelectContent>
              </Select>
            </Field>
          </div>
          {form.rateType !== "Free" && (
            <Field label="Rate Amount *" error={errors.rateAmount}>
              <Input type="number" min={0} value={form.rateAmount ?? ""} onChange={(e) => setForm({ ...form, rateAmount: Number(e.target.value) })} />
            </Field>
          )}
        </Section>

        <Section title="4. Account Details">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Status">
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="JSS / Success Score (0-100)">
              <Input type="number" min={0} max={100} value={form.jss ?? ""} onChange={(e) => setForm({ ...form, jss: Number(e.target.value) })} />
            </Field>
            <Field label="Rating (0-5)">
              <Input type="number" min={0} max={5} step={0.1} value={form.rating ?? ""} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </Field>
          </div>
        </Section>

        <Section title="5. Notes & Tags">
          <Field label="Tags (comma separated)">
            <Input value={form.tags?.join(", ") ?? ""} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} placeholder="high-performing, enterprise" />
          </Field>
          <Field label="Internal Notes">
            <Textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
        </Section>

        <div className="flex justify-end gap-2 pt-2 pb-6">
          <Link to="/sales/sources"><Button variant="outline" size="sm" className="h-8">Cancel</Button></Link>
          <Button size="sm" className="h-8" onClick={submit}>Create Source Account</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-sm p-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-2xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-2xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
