import { useMemo } from 'react';
import type { Phase } from '@/hooks/useHeistTimer';

interface TimerCircleProps {
  displayTime: string;
  progress: number;
  phase: Phase;
  status: string;
  isFlashing?: boolean;
}

export const TimerCircle = ({ displayTime, progress, phase, status, isFlashing }: TimerCircleProps) => {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const ringClass = useMemo(() => {
    if (progress >= 100) return 'danger';
    if (progress >= 70) return 'warning';
    if (phase === 'complete') return 'success';
    return '';
  }, [progress, phase]);

  const statusColor = useMemo(() => {
    switch (phase) {
      case 'ready': return 'text-muted-foreground';
      case 'setup': return 'text-primary';
      case 'heist-ready': return 'text-warning';
      case 'heist': return 'text-destructive';
      case 'complete': return 'text-success';
      default: return 'text-muted-foreground';
    }
  }, [phase]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div className={`absolute w-56 h-56 rounded-full transition-all duration-500 ${
        phase === 'setup' || phase === 'heist' ? 'glow-primary animate-pulse-glow' : ''
      } ${isFlashing ? 'warning-blink' : ''}`} />
      
      {/* SVG Timer Ring */}
      <svg 
        className="w-52 h-52 transform -rotate-90" 
        viewBox="0 0 200 200"
      >
        {/* Background ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          className="opacity-30"
        />
        
        {/* Progress ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={`timer-ring-progress ${ringClass} transition-all duration-100`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: phase === 'ready' ? circumference : strokeDashoffset,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xs font-medium uppercase tracking-widest mb-2 ${statusColor}`}>
          {status}
        </span>
        <span className={`font-mono text-4xl font-bold tracking-tight transition-all duration-200 ${
          phase === 'ready' ? 'text-muted-foreground' : 
          isFlashing ? 'text-destructive' : 'text-foreground text-glow-primary'
        }`}>
          {displayTime}
        </span>
      </div>
    </div>
  );
};
