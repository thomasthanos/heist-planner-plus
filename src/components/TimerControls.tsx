import { Play, CheckCircle, Rocket, Flag, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Phase } from '@/hooks/useHeistTimer';

interface TimerControlsProps {
  phase: Phase;
  onStartSetup: () => void;
  onCompleteSetup: () => void;
  onStartHeist: () => void;
  onCompleteHeist: () => void;
  onReset: () => void;
}

export const TimerControls = ({
  phase,
  onStartSetup,
  onCompleteSetup,
  onStartHeist,
  onCompleteHeist,
  onReset,
}: TimerControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md animate-fade-in">
      <Button
        variant="default"
        size="lg"
        onClick={onStartSetup}
        disabled={phase !== 'ready' && phase !== 'heist-ready'}
        className="group"
      >
        <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
        Start Setup
      </Button>
      
      <Button
        variant="success"
        size="lg"
        onClick={onCompleteSetup}
        disabled={phase !== 'setup'}
        className="group"
      >
        <CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
        Complete Setup
      </Button>
      
      <Button
        variant="warning"
        size="lg"
        onClick={onStartHeist}
        disabled={phase !== 'heist-ready'}
        className="group"
      >
        <Rocket className="w-5 h-5 transition-transform group-hover:scale-110" />
        Start Heist
      </Button>
      
      <Button
        variant="destructive"
        size="lg"
        onClick={onCompleteHeist}
        disabled={phase !== 'heist'}
        className="group"
      >
        <Flag className="w-5 h-5 transition-transform group-hover:scale-110" />
        Complete Heist
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        className="col-span-2 group"
      >
        <RotateCcw className="w-5 h-5 transition-transform group-hover:-rotate-180 duration-500" />
        Reset Timer
      </Button>
    </div>
  );
};
