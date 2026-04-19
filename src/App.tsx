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

const queryClient = new QueryClient();

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

              {/* Sales — fully built */}
              <Route path="/sales" element={<SalesDashboard />} />
              {MODULES.find(m => m.key === "sales")!.submenu
                .filter(s => s.path !== "/sales")
                .map(s => <Route key={s.path} path={s.path} element={<PlaceholderPage />} />)}

              {/* System Admin — fully built dashboard */}
              <Route path="/system-admin" element={<SystemAdminDashboard />} />
              {MODULES.find(m => m.key === "sysadmin")!.submenu
                .filter(s => s.path !== "/system-admin")
                .map(s => <Route key={s.path} path={s.path} element={<PlaceholderPage />} />)}

              {/* Other modules — placeholders */}
              {MODULES.filter(m => m.key !== "sales" && m.key !== "sysadmin").flatMap(m => [
                <Route key={m.path} path={m.path} element={<PlaceholderPage />} />,
                ...m.submenu.filter(s => s.path !== m.path).map(s => (
                  <Route key={s.path} path={s.path} element={<PlaceholderPage />} />
                )),
              ])}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
