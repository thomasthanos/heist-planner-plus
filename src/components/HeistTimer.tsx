import { useState, useMemo, useEffect, useRef } from 'react';
import { Timer, XCircle, BarChart3, Target, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import { useHeistTimer } from '@/hooks/useHeistTimer';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useFullscreen } from '@/hooks/useFullscreen';
import { TimerCircle } from './TimerCircle';
import { TimerControls } from './TimerControls';
import { TimeCard } from './TimeCard';
import { TimeEntry } from './TimeEntry';
import { StatDisplay } from './StatDisplay';
import { ResetModal } from './ResetModal';
import { HeistPresets } from './HeistPresets';
import { HeistHistoryCard } from './HeistHistoryCard';
import { FailedSetupsCollapsedSidebar } from './FailedSetupsCollapsedSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const HeistTimer = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('heistSoundEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { playSetupComplete, playHeistStart, playHeistComplete, playClick, playWarning } = useAudioFeedback(soundEnabled);
  const warningPlayedRef = useRef(false);
  
  // Save sound preference
  useEffect(() => {
    localStorage.setItem('heistSoundEnabled', String(soundEnabled));
  }, [soundEnabled]);
  
  const {
    currentPhase,
    displayTime,
    currentTime,
    progress,
    heistName,
    setupTimes,
    heistTimes,
    failedSetupTimes,
    setupElapsedTotal,
    failedElapsedTotal,
    heistPhaseTime,
    currentSetupTime,
    startSetup,
    completeSetup,
    startHeist,
    completeHeist,
    reset,
    setHeistName,
    formatTime,
    exportHeistData,
    importHeistData,
  } = useHeistTimer();

  // Warning at 10 minutes
  const TEN_MINUTES = 10 * 60 * 1000;
  useEffect(() => {
    if (currentTime >= TEN_MINUTES && !warningPlayedRef.current) {
      playWarning();
      warningPlayedRef.current = true;
    }
    if (currentTime < TEN_MINUTES) {
      warningPlayedRef.current = false;
    }
  }, [currentTime, playWarning]);

  // Flash state for 7+ minutes
  const SEVEN_MINUTES = 7 * 60 * 1000;
  const isFlashing = currentTime >= SEVEN_MINUTES;

  const status = useMemo(() => {
    switch (currentPhase) {
      case 'ready': return 'Ready';
      case 'setup': return 'Setup in Progress';
      case 'heist-ready': return 'Ready for Heist';
      case 'heist': return 'Heist Active';
      case 'complete': return 'Heist Complete';
      default: return 'Ready';
    }
  }, [currentPhase]);

  const handleReset = () => {
    setResetModalOpen(true);
  };

  const confirmReset = () => {
    reset(false);
    setResetModalOpen(false);
  };

  // Handle audio feedback on phase changes
  const handleStartSetup = () => {
    playClick();
    startSetup();
  };

  const handleCompleteSetup = () => {
    playSetupComplete();
    completeSetup();
  };

  const handleStartHeist = () => {
    playHeistStart();
    startHeist();
  };

  const handleCompleteHeist = () => {
    playHeistComplete();
    completeHeist();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in relative">
        {/* Floating controls */}
        <div className="absolute right-0 top-0 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-9 w-9"
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-9 w-9"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mb-2">
          Career Challenges
        </h1>
        <p className="text-muted-foreground">Heist Timer & Progress Tracker</p>
      </header>

      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Main Timer Card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 md:p-8 animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <Timer className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Heist Timer</h2>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
              currentPhase === 'ready' ? 'bg-muted text-muted-foreground' :
              currentPhase === 'setup' ? 'bg-primary/20 text-primary' :
              currentPhase === 'heist-ready' ? 'bg-warning/20 text-warning' :
              currentPhase === 'heist' ? 'bg-destructive/20 text-destructive' :
              'bg-success/20 text-success'
            }`}>
              {status}
            </span>
          </div>

          {/* Heist Name Input */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Enter heist name..."
              value={heistName}
              onChange={(e) => setHeistName(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary text-center text-lg"
            />
          </div>

          {/* Heist Presets */}
          <div className="mb-8">
            <HeistPresets onSelectName={setHeistName} />
          </div>

          {/* Timer Display */}
          <div className="flex justify-center mb-8">
            <TimerCircle
              displayTime={displayTime}
              progress={progress}
              phase={currentPhase}
              status={status}
              isFlashing={isFlashing}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <TimerControls
              phase={currentPhase}
              onStartSetup={handleStartSetup}
              onCompleteSetup={handleCompleteSetup}
              onStartHeist={handleStartHeist}
              onCompleteHeist={handleCompleteHeist}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex flex-col gap-6">
          {/* Failed Setups */}
          <TimeCard icon={<XCircle className="w-5 h-5 text-destructive" />} title="Failed Setups">
            <StatDisplay 
              label="Total Failed Time" 
              value={failedElapsedTotal > 0 ? formatTime(failedElapsedTotal) : '00:00'}
              variant="destructive"
            />
            <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
              {failedSetupTimes.length > 0 ? (
                <FailedSetupsCollapsedSidebar failedSetups={failedSetupTimes} />
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No failed setups
                </p>
              )}
            </div>
          </TimeCard>

          {/* Setup Times */}
          <TimeCard icon={<BarChart3 className="w-5 h-5 text-primary" />} title="Setup Times">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatDisplay 
                label="Current" 
                value={currentPhase === 'setup' ? formatTime(currentSetupTime) : 
                       setupTimes[0]?.formatted || '00:00'}
                variant="primary"
              />
              <StatDisplay 
                label="Total" 
                value={setupElapsedTotal > 0 ? formatTime(setupElapsedTotal) : '00:00'}
              />
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {setupTimes.length > 0 ? (
                setupTimes.map((entry) => (
                  <TimeEntry
                    key={entry.id}
                    time={entry.formatted}
                    name={entry.name}
                  />
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No setups recorded
                </p>
              )}
            </div>
          </TimeCard>

          {/* Heist Times */}
          <TimeCard icon={<Target className="w-5 h-5 text-success" />} title="Heist Times">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatDisplay 
                label="Total" 
                value={heistTimes[0]?.formattedTotal || '00:00'}
                variant="success"
              />
              <StatDisplay 
                label="Heist Phase" 
                value={currentPhase === 'heist' ? formatTime(heistPhaseTime) : 
                       heistTimes[0]?.formattedHeist || '00:00'}
                variant="warning"
              />
            </div>
            <HeistHistoryCard
              heistTimes={heistTimes}
              formatTime={formatTime}
              onExport={exportHeistData}
              onImport={importHeistData}
            />
          </TimeCard>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
        <p>Career Challenges Heist Timer v2.0</p>
      </footer>

      {/* Reset Confirmation Modal */}
      <ResetModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        onConfirm={confirmReset}
      />
    </div>
  );
};
