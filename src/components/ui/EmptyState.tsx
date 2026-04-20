import { Search } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center mb-3 text-muted-foreground">
          {icon ?? <Search className="w-6 h-6" />}
        </div>
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>}
        {cta}
      </div>
    </div>
  );
}
