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
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
        <XCircle className="w-3 h-3 text-destructive" />
        Failed Setups ({failedSetups.length})
      </h4>
      <div className="space-y-1">
        {Object.entries(groupedSetups).map(([name, setups]) => (
          <div key={name}>
            {setups.length > 1 ? (
              <>
                <button
                  onClick={() => toggleGroup(name)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups.has(name) ? (
                      <ChevronDown className="w-3 h-3 text-destructive" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-destructive/60" />
                    )}
                    <span className="text-sm text-muted-foreground truncate max-w-[80px]">
                      {name}
                    </span>
                    <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
                      x{setups.length}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-destructive">
                    {setups.reduce((acc, s) => acc + s.time, 0) > 0 
                      ? formatTimeFromMs(setups.reduce((acc, s) => acc + s.time, 0)) 
                      : '00:00'}
                  </span>
                </button>
                {expandedGroups.has(name) && (
                  <div className="ml-4 mt-1 space-y-1 animate-fade-in">
                    {setups.map((setup, idx) => (
                      <div
                        key={setup.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded bg-destructive/5 border border-destructive/10"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                          <Clock className="w-3 h-3 text-destructive/40" />
                        </div>
                        <span className="font-mono text-xs text-destructive">{setup.formatted}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between px-3 py-2 rounded bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-destructive/60" />
                  <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                    {name}
                  </span>
                </div>
                <span className="font-mono text-sm text-destructive">{setups[0].formatted}</span>
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
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {heistTimes.length > 0 ? (
          heistTimes.map((entry) => (
            <div key={entry.id} className="rounded-lg overflow-hidden">
              {/* Heist Header - Clickable */}
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full p-3 bg-success/10 border border-success/20 rounded-lg hover:bg-success/20 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {expandedHeist === entry.id ? (
                      <ChevronDown className="w-4 h-4 text-success" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-foreground truncate max-w-[120px]">
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-success">
                    {entry.formattedTotal}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pl-6">
                  <span>Setup: {entry.formattedSetup}</span>
                  <span>Heist: {entry.formattedHeist}</span>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedHeist === entry.id && (
                <div className="mt-1 p-3 bg-secondary/30 rounded-lg border border-border/30 animate-fade-in space-y-3">
                  {/* Setup Details */}
                  {entry.setupDetails && entry.setupDetails.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        Setups ({entry.setupDetails.length})
                      </h4>
                      <div className="space-y-1">
                        {entry.setupDetails.map((setup, index) => (
                          <div
                            key={setup.id}
                            className="flex items-center justify-between px-3 py-2 rounded bg-primary/10 border border-primary/20"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                              <Clock className="w-3 h-3 text-primary/60" />
                              <span className="text-sm text-foreground truncate max-w-[100px]">
                                {setup.name || 'Setup'}
                              </span>
                            </div>
                            <span className="font-mono text-sm text-primary">{setup.formatted}</span>
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
                  <div className="pt-2 border-t border-border/30">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Setup</p>
                        <p className="font-mono text-sm text-primary">{entry.formattedSetup}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Heist</p>
                        <p className="font-mono text-sm text-warning">{entry.formattedHeist}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-mono text-sm font-bold text-success">{entry.formattedTotal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            No heists completed
          </p>
        )}
      </div>
    </div>
  );
};
