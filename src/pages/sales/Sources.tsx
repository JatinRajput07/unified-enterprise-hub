import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Download, Eye, PauseCircle, Edit2 } from "lucide-react";
import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/StatusPill";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useSalesStore, type SourceAccount } from "@/store/salesStore";
import { PEOPLE } from "@/lib/mockData";

const peopleById = (id: string) => PEOPLE.find(p => p.id === id);

export default function Sources() {
  const sources = useSalesStore((s) => s.sources);
  const leads = useSalesStore((s) => s.leads);
  const [filter, setFilter] = useState<string>("all");

  const rows = sources
    .filter(s => filter === "all" || s.platform === filter)
    .map(s => {
      const linkedLeads = leads.filter(l => l.sourceAccountId === s.id);
      const won = linkedLeads.filter(l => l.status === "Won").length;
      return {
        ...s,
        leadCount: linkedLeads.length,
        winRate: linkedLeads.length ? Math.round((won / linkedLeads.length) * 100) : 0,
      };
    });

  const platforms = Array.from(new Set(sources.map(s => s.platform)));

  const cols: Column<typeof rows[number]>[] = [
    { key: "platform", label: "Platform", render: (r) => <span className="font-medium">{r.platform}</span> },
    {
      key: "name", label: "Account",
      render: (r) => (
        <Link to={`/sales/sources/${r.id}`} className="hover:text-primary">
          <div className="font-medium">{r.displayName}</div>
          <div className="text-3xs text-muted-foreground font-mono">@{r.username}</div>
        </Link>
      ),
    },
    {
      key: "owner", label: "Owner",
      render: (r) => {
        const p = peopleById(r.ownerId);
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-sm bg-primary/15 text-primary flex items-center justify-center font-mono text-3xs font-bold">{p?.initials}</div>
            <span>{p?.name}</span>
          </div>
        );
      },
    },
    {
      key: "rate", label: "Rate", align: "right",
      render: (r) => r.rateAmount ? <span className="font-mono">{r.currency === "USD" ? "$" : "₹"}{r.rateAmount}{r.rateType === "Hourly" ? "/hr" : r.rateType === "Monthly Subscription" ? "/mo" : ""}</span> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: "status", label: "Status",
      render: (r) => <StatusPill variant={r.status === "Active" ? "success" : r.status === "Paused" ? "warning" : "neutral"}>{r.status}</StatusPill>,
    },
    { key: "leadCount", label: "Leads", align: "right", render: (r) => <span className="font-mono font-medium">{r.leadCount}</span> },
    {
      key: "winRate", label: "Win Rate", align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <span className="font-mono">{r.winRate}%</span>
          <div className="w-12 h-1 bg-surface-hover rounded-full overflow-hidden">
            <div className="h-full bg-success" style={{ width: `${r.winRate}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: "actions", label: "", className: "w-20",
      render: (r) => (
        <div className="flex items-center gap-0.5">
          <Link to={`/sales/sources/${r.id}`} className="w-6 h-6 rounded-sm hover:bg-surface-hover flex items-center justify-center text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></Link>
          <button className="w-6 h-6 rounded-sm hover:bg-surface-hover flex items-center justify-center text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
          <button className="w-6 h-6 rounded-sm hover:bg-surface-hover flex items-center justify-center text-muted-foreground"><PauseCircle className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Source Accounts"
        subtitle={`${sources.length} accounts across ${platforms.length} platforms`}
        accentVar="--mod-sales"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3.5 h-3.5" /> Export</Button>
            <Link to="/sales/sources/new"><Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3.5 h-3.5" /> Add Source Account</Button></Link>
          </>
        }
      />
      <div className="h-9 px-3 flex items-center gap-2 border-b border-border bg-surface/50 text-xs">
        <span className="text-2xs uppercase text-muted-foreground tracking-wider">Platform:</span>
        <button
          onClick={() => setFilter("all")}
          className={`h-6 px-2 rounded-sm text-2xs font-medium ${filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-surface-hover"}`}
        >All ({sources.length})</button>
        {platforms.map(p => (
          <button key={p} onClick={() => setFilter(p)}
            className={`h-6 px-2 rounded-sm text-2xs font-medium ${filter === p ? "bg-primary text-primary-foreground" : "hover:bg-surface-hover"}`}
          >{p} ({sources.filter(s => s.platform === p).length})</button>
        ))}
      </div>
      <div className="p-3 flex-1">
        <div className="bg-surface border border-border rounded-sm">
          <DataTable columns={cols} rows={rows} rowKey={(r) => r.id} />
        </div>
      </div>
    </div>
  );
}
