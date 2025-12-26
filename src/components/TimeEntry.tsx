import { Clock } from 'lucide-react';

interface TimeEntryProps {
  time: string;
  name?: string;
  variant?: 'default' | 'failed' | 'success';
}

export const TimeEntry = ({ time, name, variant = 'default' }: TimeEntryProps) => {
  const styles = {
    default: {
      bg: 'bg-gradient-to-r from-secondary/60 to-secondary/30',
      border: 'border-border/40 border-b-border/60',
      icon: 'bg-primary/20 text-primary',
      text: 'text-foreground',
    },
    failed: {
      bg: 'bg-gradient-to-r from-destructive/15 to-destructive/5',
      border: 'border-destructive/25 border-b-destructive/40',
      icon: 'bg-destructive/20 text-destructive',
      text: 'text-destructive',
    },
    success: {
      bg: 'bg-gradient-to-r from-success/15 to-success/5',
      border: 'border-success/25 border-b-success/40',
      icon: 'bg-success/20 text-success',
      text: 'text-success',
    },
  }[variant];

  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border border-b-4 ${styles.bg} ${styles.border}`}>
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-full ${styles.icon} flex items-center justify-center`}>
          <Clock className="w-3.5 h-3.5" />
        </div>
        {name && <span className="text-sm font-medium text-foreground/80 truncate max-w-[120px]">{name}</span>}
      </div>
      <span className={`font-mono text-lg font-bold ${styles.text}`}>{time}</span>
    </div>
  );
};
