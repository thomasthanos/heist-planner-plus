interface StatDisplayProps {
  label: string;
  value: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

export const StatDisplay = ({ label, value, variant = 'default' }: StatDisplayProps) => {
  const styles = {
    default: {
      bg: 'bg-secondary/40',
      border: 'border-border/40',
      text: 'text-foreground',
      label: 'text-muted-foreground',
    },
    primary: {
      bg: 'bg-gradient-to-br from-primary/20 to-primary/5',
      border: 'border-primary/30',
      text: 'text-primary',
      label: 'text-primary/70',
    },
    success: {
      bg: 'bg-gradient-to-br from-success/20 to-success/5',
      border: 'border-success/30',
      text: 'text-success',
      label: 'text-success/70',
    },
    warning: {
      bg: 'bg-gradient-to-br from-warning/20 to-warning/5',
      border: 'border-warning/30',
      text: 'text-warning',
      label: 'text-warning/70',
    },
    destructive: {
      bg: 'bg-gradient-to-br from-destructive/20 to-destructive/5',
      border: 'border-destructive/30',
      text: 'text-destructive',
      label: 'text-destructive/70',
    },
  }[variant];

  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${styles.bg} border ${styles.border}`}>
      <span className={`text-[10px] font-semibold uppercase tracking-widest ${styles.label}`}>
        {label}
      </span>
      <span className={`font-mono text-2xl font-bold tracking-tight ${styles.text}`}>
        {value}
      </span>
    </div>
  );
};
