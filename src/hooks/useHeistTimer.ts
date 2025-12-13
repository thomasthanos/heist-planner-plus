import { useState, useEffect, useCallback, useRef } from 'react';

export type Phase = 'ready' | 'setup' | 'heist-ready' | 'heist' | 'complete';

export interface SetupEntry {
  id: number;
  time: number;
  formatted: string;
  timestamp: number;
  name: string;
}

export interface HeistEntry {
  id: number;
  name: string;
  setupTime: number;
  heistTime: number;
  totalTime: number;
  formattedSetup: string;
  formattedHeist: string;
  formattedTotal: string;
  timestamp: number;
  setupDetails: SetupEntry[];
  failedSetups: SetupEntry[];
}

interface TimerState {
  currentPhase: Phase;
  elapsedTime: number;
  currentSetupTime: number;
  heistName: string;
  setupTimes: SetupEntry[];
  heistTimes: HeistEntry[];
  failedSetupTimes: SetupEntry[];
  setupElapsedTotal: number;
  failedElapsedTotal: number;
  heistPhaseTime: number;
}

const STORAGE_KEY = 'heistTimerState';

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

const formatTimeShort = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const useHeistTimer = () => {
  const [state, setState] = useState<TimerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      currentPhase: 'ready' as Phase,
      elapsedTime: 0,
      currentSetupTime: 0,
      heistName: '',
      setupTimes: [],
      heistTimes: [],
      failedSetupTimes: [],
      setupElapsedTotal: 0,
      failedElapsedTotal: 0,
      heistPhaseTime: 0,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const heistStartTimeRef = useRef<number>(0);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Timer interval
  useEffect(() => {
    if (state.currentPhase === 'setup' || state.currentPhase === 'heist') {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        
        if (state.currentPhase === 'setup') {
          const elapsed = now - startTimeRef.current;
          setState(prev => ({
            ...prev,
            currentSetupTime: elapsed,
            elapsedTime: prev.setupElapsedTotal + elapsed,
          }));
        } else if (state.currentPhase === 'heist') {
          const heistElapsed = now - heistStartTimeRef.current;
          setState(prev => ({
            ...prev,
            heistPhaseTime: heistElapsed,
            elapsedTime: prev.setupElapsedTotal + heistElapsed,
          }));
        }
      }, 50);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.currentPhase]);

  const startSetup = useCallback(() => {
    if (state.currentPhase !== 'ready' && state.currentPhase !== 'heist-ready') return;

    // Handle failed setup if retrying with same name
    if (state.currentPhase === 'heist-ready' && state.setupTimes.length > 0) {
      const currentName = state.heistName.trim();
      const lastName = state.setupTimes[0]?.name?.trim() || '';
      
      if (lastName && currentName && currentName === lastName) {
        const failedSetup = state.setupTimes[0];
        setState(prev => ({
          ...prev,
          setupTimes: prev.setupTimes.slice(1),
          setupElapsedTotal: prev.setupElapsedTotal - failedSetup.time,
          failedSetupTimes: [
            {
              ...failedSetup,
              formatted: formatTimeShort(failedSetup.time),
            },
            ...prev.failedSetupTimes,
          ],
          failedElapsedTotal: prev.failedElapsedTotal + failedSetup.time,
        }));
      }
    }

    startTimeRef.current = Date.now();
    setState(prev => ({
      ...prev,
      currentPhase: 'setup',
      currentSetupTime: 0,
    }));
  }, [state.currentPhase, state.heistName, state.setupTimes]);

  const completeSetup = useCallback(() => {
    if (state.currentPhase !== 'setup') return;

    const setupDuration = Date.now() - startTimeRef.current;
    const newSetup: SetupEntry = {
      id: Date.now(),
      time: setupDuration,
      formatted: formatTimeShort(setupDuration),
      timestamp: Date.now(),
      name: state.heistName,
    };

    setState(prev => ({
      ...prev,
      currentPhase: 'heist-ready',
      setupTimes: [newSetup, ...prev.setupTimes],
      setupElapsedTotal: prev.setupElapsedTotal + setupDuration,
      currentSetupTime: setupDuration,
    }));
  }, [state.currentPhase, state.heistName]);

  const startHeist = useCallback(() => {
    if (state.currentPhase !== 'heist-ready') return;

    heistStartTimeRef.current = Date.now();
    setState(prev => ({
      ...prev,
      currentPhase: 'heist',
      heistPhaseTime: 0,
    }));
  }, [state.currentPhase]);

  const completeHeist = useCallback(() => {
    if (state.currentPhase !== 'heist') return;

    const heistDuration = Date.now() - heistStartTimeRef.current;
    const totalTime = state.setupElapsedTotal + heistDuration;

    const newHeist: HeistEntry = {
      id: Date.now(),
      name: state.heistName || 'Unnamed Heist',
      setupTime: state.setupElapsedTotal,
      heistTime: heistDuration,
      totalTime,
      formattedSetup: formatTimeShort(state.setupElapsedTotal),
      formattedHeist: formatTimeShort(heistDuration),
      formattedTotal: formatTimeShort(totalTime),
      timestamp: Date.now(),
      setupDetails: [...state.setupTimes],
      failedSetups: [...state.failedSetupTimes],
    };

    setState(prev => ({
      ...prev,
      currentPhase: 'complete',
      heistTimes: [newHeist, ...prev.heistTimes],
      heistPhaseTime: heistDuration,
    }));
  }, [state.currentPhase, state.heistName, state.setupElapsedTotal, state.setupTimes, state.failedSetupTimes]);

  const reset = useCallback((full = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (full) {
      setState({
        currentPhase: 'ready',
        elapsedTime: 0,
        currentSetupTime: 0,
        heistName: '',
        setupTimes: [],
        heistTimes: [],
        failedSetupTimes: [],
        setupElapsedTotal: 0,
        failedElapsedTotal: 0,
        heistPhaseTime: 0,
      });
    } else {
      setState(prev => ({
        ...prev,
        currentPhase: 'ready',
        elapsedTime: 0,
        currentSetupTime: 0,
        setupElapsedTotal: 0,
        heistPhaseTime: 0,
        setupTimes: [],
        failedSetupTimes: [],
        failedElapsedTotal: 0,
      }));
    }
  }, []);

  const setHeistName = useCallback((name: string) => {
    setState(prev => ({ ...prev, heistName: name }));
  }, []);

  const getDisplayTime = () => {
    if (state.currentPhase === 'setup') {
      return formatTime(state.currentSetupTime);
    }
    if (state.currentPhase === 'heist') {
      return formatTime(state.heistPhaseTime);
    }
    if (state.currentPhase === 'complete') {
      return formatTime(state.heistPhaseTime);
    }
    return '00:00.00';
  };

  const getProgress = () => {
    const maxTime = 7 * 60 * 1000; // 7 minutes
    const time = state.currentPhase === 'setup' ? state.currentSetupTime : state.heistPhaseTime;
    return Math.min((time / maxTime) * 100, 100);
  };

  const exportHeistData = useCallback(() => {
    const exportData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      heists: state.heistTimes,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heist-times-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.heistTimes]);

  const importHeistData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.heists && Array.isArray(data.heists)) {
          setState(prev => ({
            ...prev,
            heistTimes: [...data.heists, ...prev.heistTimes],
          }));
        }
      } catch (error) {
        console.error('Failed to import heist data:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    ...state,
    displayTime: getDisplayTime(),
    progress: getProgress(),
    startSetup,
    completeSetup,
    startHeist,
    completeHeist,
    reset,
    setHeistName,
    formatTime: formatTimeShort,
    exportHeistData,
    importHeistData,
  };
};
