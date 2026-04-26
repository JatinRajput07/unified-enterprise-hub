import { ModuleHeader, FilterBar } from "@/components/ui/ModuleHeader";
import { Button } from "@/components/ui/button";
import { useDailyReportsStore } from "@/store/dailyReportsStore";
import { useCurrentUser } from "@/store/appStore";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Clock, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const ACCENT = "hsl(var(--mod-dailyreports))";

export default function MyReports() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { reports, deleteReport } = useDailyReportsStore();
  const mine = reports.filter(r => r.userId === user.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col min-h-full">
      <ModuleHeader
        title="My Reports"
        subtitle={`${mine.length} reports submitted`}
        accentVar="--mod-dailyreports"
        actions={
          <Button size="sm" className="h-7 text-xs gap-1" style={{ background: ACCENT }} onClick={() => navigate("/daily-reports/submit")}>
            <Plus className="w-3.5 h-3.5" /> New Report
          </Button>
        }
      />
      <FilterBar />

      <div className="p-3">
        {mine.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No reports yet"
            subtitle="Submit your first daily report to get started."
            cta={<Button size="sm" className="h-7 text-xs" style={{ background: ACCENT }} onClick={() => navigate("/daily-reports/submit")}>Submit Report</Button>}
          />
        ) : (
          <div className="space-y-2">
            {mine.map(r => (
              <div key={r.id} className="bg-surface border border-border rounded-lg p-4 hover:border-primary/40 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{r.date}</span>
                      <span className="text-2xs uppercase px-1.5 py-0.5 rounded" style={{ background: `${ACCENT}20`, color: ACCENT }}>{r.mood}</span>
                      <span className="text-2xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{r.totalHours}h</span>
                      <span className="text-2xs text-muted-foreground">• {r.tasks.length} tasks</span>
                    </div>
                    <p className="text-xs text-foreground line-clamp-2 mb-1"><span className="font-medium">Done:</span> {r.accomplishments}</p>
                    {r.blockers && <p className="text-xs text-destructive line-clamp-1"><span className="font-medium">Blocker:</span> {r.blockers}</p>}
                    {r.tomorrowPlan && <p className="text-xs text-muted-foreground line-clamp-1 mt-1"><span className="font-medium">Tomorrow:</span> {r.tomorrowPlan}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate("/daily-reports/submit")}>Edit</Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteReport(r.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}