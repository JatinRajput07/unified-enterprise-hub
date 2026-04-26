import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Button } from "@/components/ui/button";
import { useDailyReportsStore, todayDate } from "@/store/dailyReportsStore";
import { useCurrentUser } from "@/store/appStore";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ACCENT = "hsl(var(--mod-dailyreports))";

export default function DailyReportsDashboard() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const reports = useDailyReportsStore(s => s.reports);

  const today = todayDate();
  const todayReports = reports.filter(r => r.date === today);
  const myToday = reports.find(r => r.date === today && r.userId === user.id);
  const blockers = reports.filter(r => r.mood === "blocked").length;
  const totalHours = reports.reduce((sum, r) => sum + r.totalHours, 0);

  // Last 7 day chart
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const dayRs = reports.filter(r => r.date === ds);
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      reports: dayRs.length,
      hours: dayRs.reduce((s, r) => s + r.totalHours, 0),
    };
  });

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="Daily Reports"
        subtitle="End-of-day work reports across the team"
        accentVar="--mod-dailyreports"
        actions={
          <Button size="sm" className="h-7 text-xs gap-1" style={{ background: ACCENT }} onClick={() => navigate("/daily-reports/submit")}>
            <Plus className="w-3.5 h-3.5" /> Submit Today's Report
          </Button>
        }
      />

      <div className="p-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
        <KpiCard label="Reports Today" value={String(todayReports.length)} accent={ACCENT} sub="Submitted" />
        <KpiCard label="My Today" value={myToday ? "Submitted" : "Pending"} accent={myToday ? "hsl(var(--success))" : "hsl(var(--warning))"} sub={myToday ? `${myToday.totalHours}h logged` : "Submit before EOD"} />
        <KpiCard label="Total Hours" value={String(totalHours)} accent="hsl(var(--mod-finance))" sub="All reports" />
        <KpiCard label="Active Blockers" value={String(blockers)} accent="hsl(var(--destructive))" sub="Need attention" />
      </div>

      <div className="px-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="reports" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Today's Submissions</h3>
          {todayReports.length === 0 ? (
            <div className="text-xs text-muted-foreground py-8 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No reports yet today.
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {todayReports.map(r => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-surface-hover">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-2xs font-semibold flex items-center justify-center">{r.userAvatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{r.userName}</div>
                    <div className="text-2xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{r.totalHours}h • {r.tasks.length} tasks</div>
                  </div>
                  {r.mood === "blocked" ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <CheckCircle2 className="w-4 h-4 text-success" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {reports.slice(0, 8).map(r => (
              <div key={r.id} className="flex items-center gap-3 text-xs py-1.5 border-b border-border last:border-0">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-2xs font-semibold flex items-center justify-center">{r.userAvatar}</div>
                <span className="font-medium">{r.userName}</span>
                <span className="text-muted-foreground">submitted report for</span>
                <span className="font-mono text-2xs">{r.date}</span>
                <span className="text-muted-foreground">— {r.totalHours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}