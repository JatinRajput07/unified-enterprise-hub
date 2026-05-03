import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { SAPage, SACard, SAButton, Pill } from "../components/SAPage";
import { useSuperAdminStore, ALL_MODULES } from "@/store/superAdminStore";
const tones: Record<string, any> = { new: "info", contacted: "purple", scheduled: "warning", demo_done: "teal", converted: "success", rejected: "danger", no_response: "neutral" };
export default function SADemoRequests() {
  const demos = useSuperAdminStore(s => s.demoRequests);
  const [q, setQ] = useState(""); const [statusF, setStatusF] = useState("all");
  const navigate = useNavigate();
  const filtered = demos.filter(d => (!q || d.company.toLowerCase().includes(q.toLowerCase())) && (statusF === "all" || d.status === statusF));
  return (
    <SAPage title="Demo Requests" subtitle={`${demos.length} total · ${demos.filter(d=>d.status==="new").length} new`}
      actions={<SAButton size="sm"><Plus className="w-3.5 h-3.5"/> Manual Entry</SAButton>}>
      <SACard>
        <div className="px-4 py-3 border-b flex gap-2">
          <input className="h-8 px-3 rounded-md border border-border text-xs" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
          <select className="h-8 px-2 text-xs rounded-md border border-border" value={statusF} onChange={e=>setStatusF(e.target.value)}>
            <option value="all">All Status</option><option value="new">New</option><option value="scheduled">Scheduled</option>
            <option value="demo_done">Demo Done</option><option value="converted">Converted</option><option value="rejected">Rejected</option>
          </select>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-muted-foreground"><tr className="text-2xs uppercase">
            <th className="text-left px-3 h-9 font-medium">Company</th><th className="text-left px-3 font-medium">Contact</th>
            <th className="text-left px-3 font-medium">Interest</th><th className="text-left px-3 font-medium">Source</th>
            <th className="text-left px-3 font-medium">Requested</th><th className="text-left px-3 font-medium">Status</th>
            <th className="text-left px-3 font-medium">Assigned</th>
          </tr></thead>
          <tbody>{filtered.map(d => (
            <tr key={d.id} className="border-t border-border hover:bg-slate-50 cursor-pointer" onClick={()=>navigate(`/super-admin/demo-requests/${d.id}`)}>
              <td className="px-3 h-11 font-medium">{d.company}</td>
              <td className="px-3"><div>{d.contact}</div><div className="text-2xs text-muted-foreground font-mono">{d.email}</div></td>
              <td className="px-3"><div className="flex gap-1 flex-wrap">{d.modules.map(m=><Pill key={m} tone="neutral">{ALL_MODULES.find(x=>x.key===m)?.name}</Pill>)}</div></td>
              <td className="px-3 text-muted-foreground">{d.source}</td>
              <td className="px-3 text-muted-foreground">{d.requested}</td>
              <td className="px-3"><Pill tone={tones[d.status]}>{d.status.replace("_"," ")}</Pill></td>
              <td className="px-3">{d.assignedTo || <span className="text-muted-foreground">Unassigned</span>}</td>
            </tr>))}</tbody>
        </table>
      </SACard>
    </SAPage>
  );
}