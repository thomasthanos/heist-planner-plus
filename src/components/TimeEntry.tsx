import { Clock } from 'lucide-react';

interface TimeEntryProps {
  time: string;
  name?: string;
  variant?: 'default' | 'failed' | 'success';
}

export const TimeEntry = ({ time, name, variant = 'default' }: TimeEntryProps) => {
  const bgClass = {
    default: 'bg-secondary/50 border-border/30',
    failed: 'bg-destructive/10 border-destructive/20',
    success: 'bg-success/10 border-success/20',
  }[variant];

  const textClass = {
    default: 'text-foreground',
    failed: 'text-destructive',
    success: 'text-success',
  }[variant];

  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${bgClass} transition-all hover:scale-[1.01]`}>
      <div className="flex items-center gap-3">
        <Clock className={`w-4 h-4 ${textClass} opacity-60`} />
        {name && <span className="text-sm text-muted-foreground truncate max-w-[120px]">{name}</span>}
      </div>
      <span className={`font-mono font-semibold ${textClass}`}>{time}</span>
    </div>
  );
};
