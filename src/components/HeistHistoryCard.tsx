import { useState, useRef, useMemo } from 'react';
import { ChevronDown, ChevronRight, Download, Upload, Clock, XCircle, Wrench } from 'lucide-react';
import { HeistEntry, SetupEntry } from '@/hooks/useHeistTimer';
import { Button } from '@/components/ui/button';

interface HeistHistoryCardProps {
  heistTimes: HeistEntry[];
  formatTime: (ms: number) => string;
  onExport: () => void;
  onImport: (file: File) => void;
}

interface FailedSetupsCollapsedProps {
  failedSetups: SetupEntry[];
}

const FailedSetupsCollapsed = ({ failedSetups }: FailedSetupsCollapsedProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupedSetups = useMemo(() => {
    const groups: { [key: string]: SetupEntry[] } = {};
    failedSetups.forEach(setup => {
      const name = setup.name || 'Failed';
      if (!groups[name]) groups[name] = [];
      groups[name].push(setup);
    });
    return groups;
  }, [failedSetups]);

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      <h4 className="text-xs font-bold text-destructive/80 uppercase tracking-widest mb-3 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
          <XCircle className="w-3 h-3 text-destructive" />
        </div>
        Failed Setups ({failedSetups.length})
      </h4>
      <div className="space-y-2">
        {Object.entries(groupedSetups).map(([name, setups]) => (
          <div key={name}>
            {setups.length > 1 ? (
              <>
                <button
                  onClick={() => toggleGroup(name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-destructive/15 to-destructive/5 border border-destructive/25 border-b-2 border-b-destructive/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
                      {expandedGroups.has(name) ? (
                        <ChevronDown className="w-3 h-3 text-destructive" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-destructive" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground/80 truncate max-w-[80px]">
                      {name}
                    </span>
                    <span className="text-xs font-bold bg-destructive/25 text-destructive px-2 py-0.5 rounded-full">
                      {setups.length}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-destructive">
                    {setups.reduce((acc, s) => acc + s.time, 0) > 0 
                      ? formatTimeFromMs(setups.reduce((acc, s) => acc + s.time, 0)) 
                      : '00:00'}
                  </span>
                </button>
                {expandedGroups.has(name) && (
                  <div className="ml-4 mt-2 border-l-2 border-destructive/20 pl-3 space-y-1 animate-fade-in">
                    {setups.map((setup, idx) => (
                      <div
                        key={setup.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-md bg-destructive/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center text-[10px] text-destructive/70 font-medium">
                            {idx + 1}
                          </span>
                          <Clock className="w-3 h-3 text-destructive/50" />
                        </div>
                        <span className="font-mono text-xs font-semibold text-destructive">{setup.formatted}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-destructive/15 to-destructive/5 border border-destructive/25 border-b-2 border-b-destructive/40">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-destructive" />
                  </div>
                  <span className="text-sm font-medium text-foreground/80 truncate max-w-[100px]">
                    {name}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-destructive">{setups[0].formatted}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const formatTimeFromMs = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const HeistHistoryCard = ({ heistTimes, formatTime, onExport, onImport }: HeistHistoryCardProps) => {
  const [expandedHeist, setExpandedHeist] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = (id: number) => {
    setExpandedHeist(expandedHeist === id ? null : id);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Export/Import buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={heistTimes.length === 0}
          className="flex-1 text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="flex-1 text-xs"
        >
          <Upload className="w-3 h-3 mr-1" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Heist list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {heistTimes.length > 0 ? (
          heistTimes.map((entry) => (
            <div key={entry.id} className="rounded-xl overflow-hidden">
              {/* Heist Header - Clickable */}
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full p-3 bg-gradient-to-r from-success/15 to-success/5 border border-success/25 border-b-2 border-b-success/40 rounded-xl transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      {expandedHeist === entry.id ? (
                        <ChevronDown className="w-4 h-4 text-success" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-success/70" />
                      )}
                    </div>
                    <span className="font-semibold text-foreground truncate max-w-[120px]">
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-lg text-success">
                    {entry.formattedTotal}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pl-8">
                  <span>Setup: {entry.formattedSetup}</span>
                  <span>Heist: {entry.formattedHeist}</span>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedHeist === entry.id && (
                <div className="mt-2 p-4 bg-gradient-to-b from-secondary/40 to-secondary/20 rounded-xl border border-border/40 animate-fade-in space-y-4">
                  {/* Setup Details */}
                  {entry.setupDetails && entry.setupDetails.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-primary/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Wrench className="w-3 h-3 text-primary" />
                        </div>
                        Setups ({entry.setupDetails.length})
                      </h4>
                      <div className="space-y-2">
                        {entry.setupDetails.map((setup, index) => (
                          <div
                            key={setup.id}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/25 border-b-2 border-b-primary/40"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                                {index + 1}
                              </span>
                              <Clock className="w-3 h-3 text-primary/60" />
                              <span className="text-sm font-medium text-foreground/80 truncate max-w-[100px]">
                                {setup.name || 'Setup'}
                              </span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-primary">{setup.formatted}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Failed Setups - Grouped by name */}
                  {entry.failedSetups && entry.failedSetups.length > 0 && (
                    <FailedSetupsCollapsed failedSetups={entry.failedSetups} />
                  )}

                  {/* Summary */}
                  <div className="pt-3 border-t border-border/30">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Setup</p>
                        <p className="font-mono text-sm text-primary">{entry.formattedSetup}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Heist</p>
                        <p className="font-mono text-sm text-warning">{entry.formattedHeist}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Total</p>
                        <p className="font-mono text-sm font-bold text-success">{entry.formattedTotal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-6">
            No heists completed
          </p>
        )}
      </div>
    </div>
  );
};
