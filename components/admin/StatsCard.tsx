import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({ label, value, change, icon: Icon, color = "bg-aloe-10" }: StatsCardProps) {
  return (
    <div className="bg-canvas-light rounded-lg p-6 border border-hairline-light">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={20} className="text-ink" />
        </div>
        {change && (
          <span className="text-caption text-aloe-10 bg-aloe-10/20 rounded-pill px-2 py-0.5">
            {change}
          </span>
        )}
      </div>
      <div className="font-display text-display-md text-ink">{value}</div>
      <p className="text-caption text-shade-50">{label}</p>
    </div>
  );
}
