import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { useDailyReportsStore } from "@/store/dailyReportsStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const ACCENT = "hsl(var(--mod-dailyreports))";
const COLORS = ["hsl(var(--success))", "hsl(var(--mod-finance))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export default function DailyReportsAnalytics() {
  const reports = useDailyReportsStore(s => s.reports);

  const byUser = Object.values(reports.reduce<Record<string, { name: string; reports: number; hours: number }>>((acc, r) => {
    acc[r.userId] = acc[r.userId] || { name: r.userName, reports: 0, hours: 0 };
    acc[r.userId].reports++;
    acc[r.userId].hours += r.totalHours;
    return acc;
  }, {}));

  const moodCounts = ["great", "good", "ok", "blocked"].map(m => ({
    name: m, value: reports.filter(r => r.mood === m).length,
  }));

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader title="Analytics" subtitle="Daily reports insights" accentVar="--mod-dailyreports" />

      <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Hours by Person</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="hours" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={moodCounts} dataKey="value" nameKey="name" outerRadius={90} label>
                {moodCounts.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Submission Streak</h3>
          <div className="space-y-2">
            {byUser.map(u => (
              <div key={u.name} className="flex items-center gap-3">
                <span className="text-xs font-medium w-32 truncate">{u.name}</span>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, u.reports * 14)}%`, background: ACCENT }} />
                </div>
                <span className="text-2xs font-mono text-muted-foreground w-20 text-right">{u.reports} reports</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}