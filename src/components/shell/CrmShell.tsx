import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { L1Sidebar } from "./L1Sidebar";
import { L2Sidebar } from "./L2Sidebar";
import { RightStrip, RightPanel } from "./RightStrip";
import { Footer } from "./Footer";
import { GlobalSearch } from "./GlobalSearch";

export function CrmShell() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0 relative">
        <L1Sidebar />
        <L2Sidebar />
        <main className="flex-1 min-w-0 overflow-auto">
          <Outlet />
        </main>
        <RightStrip />
        <RightPanel />
      </div>
      <Footer />
      <GlobalSearch />
    </div>
  );
}
