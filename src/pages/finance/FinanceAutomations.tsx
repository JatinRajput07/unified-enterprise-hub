import { useFinanceStore } from "@/store/financeStore";
import { AutomationsPage } from "@/pages/wayofwork/WowAutomations";

export default function FinanceAutomations() {
  const { automations, toggleAutomation } = useFinanceStore();
  return <AutomationsPage moduleAccent="--mod-finance" moduleName="Finance" automations={automations} onToggle={toggleAutomation} />;
}
