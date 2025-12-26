interface StatDisplayProps {
  label: string;
  value: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

export const StatDisplay = ({ label, value, variant = 'default' }: StatDisplayProps) => {
  const valueClass = {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  }[variant];

  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-secondary/30 border border-border/30 border-b-4 border-b-border/50 stat-3d">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`font-mono text-2xl font-bold ${valueClass}`}>{value}</span>
    </div>
  );
};
