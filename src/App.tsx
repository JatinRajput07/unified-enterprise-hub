import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CrmShell } from "@/components/shell/CrmShell";
import SalesDashboard from "@/pages/sales/SalesDashboard";
import SystemAdminDashboard from "@/pages/sysadmin/SystemAdminDashboard";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFound from "./pages/NotFound.tsx";
import { MODULES } from "@/lib/modules";

// WayOfWork
import WowDashboard from "@/pages/wayofwork/WowDashboard";
import MyWows from "@/pages/wayofwork/MyWows";
import CreateWow from "@/pages/wayofwork/CreateWow";
import ReviewQueue from "@/pages/wayofwork/ReviewQueue";
import AssignTraining from "@/pages/wayofwork/AssignTraining";
import MyTraining from "@/pages/wayofwork/MyTraining";
import WowLibrary from "@/pages/wayofwork/WowLibrary";
import WowAutomations from "@/pages/wayofwork/WowAutomations";

// Finance
import FinanceDashboard from "@/pages/finance/FinanceDashboard";
import Invoices from "@/pages/finance/Invoices";
import Expenses from "@/pages/finance/Expenses";
import Budget from "@/pages/finance/Budget";
import PnL from "@/pages/finance/PnL";
import FinanceReports from "@/pages/finance/Reports";
import Approvals from "@/pages/finance/Approvals";
import FinanceAutomations from "@/pages/finance/FinanceAutomations";

const queryClient = new QueryClient();

// Custom routes that override the auto-PlaceholderPage
const CUSTOM_ROUTES: Record<string, React.ComponentType> = {
  "/sales": SalesDashboard,
  "/system-admin": SystemAdminDashboard,
  "/wayofwork": WowDashboard,
  "/wayofwork/my-wows": MyWows,
  "/wayofwork/create": CreateWow,
  "/wayofwork/review": ReviewQueue,
  "/wayofwork/assign-training": AssignTraining,
  "/wayofwork/training": MyTraining,
  "/wayofwork/library": WowLibrary,
  "/wayofwork/automations": WowAutomations,
  "/finance": FinanceDashboard,
  "/finance/invoices": Invoices,
  "/finance/expenses": Expenses,
  "/finance/budget": Budget,
  "/finance/pl": PnL,
  "/finance/reports": FinanceReports,
  "/finance/approvals": Approvals,
  "/finance/automations": FinanceAutomations,
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<CrmShell />}>
              <Route path="/" element={<Navigate to="/sales" replace />} />

              {MODULES.flatMap(m => {
                const all = [{ label: m.name, path: m.path }, ...m.submenu.filter(s => s.path !== m.path)];
                return all.map(s => {
                  const Comp = CUSTOM_ROUTES[s.path] ?? PlaceholderPage;
                  return <Route key={s.path} path={s.path} element={<Comp />} />;
                });
              })}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
