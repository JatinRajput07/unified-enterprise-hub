import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Panel, ActivityFeed } from "@/components/ui/DashboardLayout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import { useWowStore, peopleById, type WowStatus } from "@/store/wowStore";
import { Plus, ClipboardList } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const statusVariant: Record<WowStatus, any> = {
  Draft: "neutral", Submitted: "info", Approved: "success", Rejected: "danger", "Training Assigned": "purple",
};

export default function WowDashboard() {
  const { wows, trainings } = useWowStore();

  const kpis = useMemo(() => {
    const byStatus = (s: WowStatus) => wows.filter(w => w.status === s).length;
    const myTrainingPending = trainings.filter(t => t.status !== "Completed").length;
    const avgTime = Math.round(wows.reduce((a, w) => a + w.estTime, 0) / Math.max(wows.length, 1));
    return [
      { label: "Total WoWs", value: String(wows.length), delta: 8.2 },
      { label: "Approved", value: String(byStatus("Approved")), delta: 12.5 },
      { label: "Pending Review", value: String(byStatus("Submitted")), delta: 4.0 },
      { label: "Rejected", value: String(byStatus("Rejected")), delta: -2.1 },
      { label: "Assigned Training", value: String(trainings.length), delta: 15.0 },
      { label: "Training Pending", value: String(myTrainingPending), delta: 0 },
      { label: "Avg Time (min)", value: String(avgTime), delta: -3.4 },
    ];
  }, [wows, trainings]);

  const freqData = useMemo(() => {
    const freqs = ["Daily","Weekly","Bi-weekly","Monthly","Quarterly","Ad-hoc"];
    return freqs.map(f => ({ frequency: f, count: wows.filter(w => w.frequency === f).length }));
  }, [wows]);

  const typeData = useMemo(() => {
    const types = ["Workflow","Activity","Process","SOP","Checklist","Report","Meeting"];
    const colors = ["hsl(var(--mod-wayofwork))","hsl(var(--mod-finance))","hsl(var(--mod-pms))","hsl(var(--mod-mastersheet))","hsl(var(--mod-sales))","hsl(var(--mod-frd))","hsl(var(--mod-portfolio))"];
    return types.map((t, i) => ({ name: t, value: wows.filter(w => w.type === t).length, fill: colors[i] })).filter(d => d.value > 0);
  }, [wows]);

  const myRecent = wows.slice(0, 6);
  const pendingReview = wows.filter(w => w.status === "Submitted");

  const activity = [
    { who: "PM", text: "Priya Mehta submitted Daily Standup WoW", when: "2m ago" },
    { who: "RS", text: "Rahul Sharma approved Code Review Process", when: "15m ago" },
    { who: "DT", text: "WoW assigned to Dev Tiwari as training", when: "1h ago" },
    { who: "AK", text: "Anita Kapoor completed P&L Review training", when: "3h ago" },
    { who: "SJ", text: "Sara Joshi created Customer Onboarding SOP", when: "yesterday" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="WayOfWork Dashboard"
        subtitle={`${wows.length} WoWs · ${trainings.length} active training assignments`}
        accentVar="--mod-wayofwork"
        actions={
          <Link to="/wayofwork/create">
            <Button size="sm" className="h-7 text-xs gap-1" style={{ background: "hsl(var(--mod-wayofwork))" }}>
              <Plus className="w-3.5 h-3.5" /> Create WoW
            </Button>
          </Link>
        }
      />
      <FilterBar />

      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {kpis.map(k => <KpiCard key={k.label} {...k} accent="hsl(var(--mod-wayofwork))" />)}
      </div>

      <div className="px-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">WoWs by Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={freqData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
              <XAxis dataKey="frequency" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="count" fill="hsl(var(--mod-wayofwork))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">By Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                {typeData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
        <Panel title="My Recent WoWs" className="lg:col-span-2 min-h-[300px]">
          <DataTable
            rowKey={(r) => r.id} rows={myRecent}
            columns={[
              { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "type", label: "Type", render: (r) => <StatusPill variant="info">{r.type}</StatusPill> },
              { key: "frequency", label: "Frequency", render: (r) => <span className="text-muted-foreground">{r.frequency}</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill variant={statusVariant[r.status]}>{r.status}</StatusPill> },
              { key: "createdAt", label: "Created", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.createdAt}</span> },
            ]}
          />
        </Panel>

        <Panel title="Activity" className="min-h-[300px]"><ActivityFeed items={activity} /></Panel>
      </div>

      {pendingReview.length > 0 && (
        <div className="p-3 pt-0">
          <Panel title="Pending My Review" action={<Link to="/wayofwork/review" className="text-2xs text-primary hover:underline">Open queue</Link>}>
            <DataTable
              rowKey={(r) => r.id} rows={pendingReview}
              columns={[
                { key: "title", label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
                { key: "owner", label: "Owner", render: (r) => peopleById(r.ownerId).name },
                { key: "type", label: "Type", render: (r) => <StatusPill variant="info">{r.type}</StatusPill> },
                { key: "submittedAt", label: "Submitted", render: (r) => <span className="font-mono text-2xs text-muted-foreground">{r.submittedAt}</span> },
                { key: "actions", label: "", render: () => (
                  <Link to="/wayofwork/review" className="text-2xs text-primary hover:underline">Review →</Link>
                )},
              ]}
            />
          </Panel>
        </div>
      )}
    </div>
  );
}
