import { useCallback, useRef } from 'react';

const playBeep = (frequency: number, duration: number, volume: number = 0.3) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    setTimeout(() => audioContext.close(), duration * 1000 + 100);
  } catch (e) {
    console.log('Audio not supported');
  }
};

const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const useAudioFeedback = (enabled: boolean = true) => {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const playSetupComplete = useCallback(() => {
    if (!enabledRef.current) return;
    playBeep(880, 0.15); // A5
    setTimeout(() => playBeep(1047, 0.2), 100); // C6
    vibrate([50, 30, 50]);
  }, []);

  const playHeistStart = useCallback(() => {
    if (!enabledRef.current) return;
    playBeep(523, 0.1); // C5
    setTimeout(() => playBeep(659, 0.1), 80); // E5
    setTimeout(() => playBeep(784, 0.15), 160); // G5
    vibrate([100]);
  }, []);

  const playHeistComplete = useCallback(() => {
    if (!enabledRef.current) return;
    // Victory sound
    playBeep(523, 0.12); // C5
    setTimeout(() => playBeep(659, 0.12), 100); // E5
    setTimeout(() => playBeep(784, 0.12), 200); // G5
    setTimeout(() => playBeep(1047, 0.3), 300); // C6
    vibrate([100, 50, 100, 50, 200]);
  }, []);

  const playClick = useCallback(() => {
    if (!enabledRef.current) return;
    playBeep(600, 0.05, 0.1);
    vibrate(10);
  }, []);

  return {
    playSetupComplete,
    playHeistStart,
    playHeistComplete,
    playClick,
  };
};
