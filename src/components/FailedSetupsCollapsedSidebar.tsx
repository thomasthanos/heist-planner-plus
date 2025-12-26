import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { SetupEntry } from '@/hooks/useHeistTimer';

interface FailedSetupsCollapsedSidebarProps {
  failedSetups: SetupEntry[];
}

export const FailedSetupsCollapsedSidebar = ({ failedSetups }: FailedSetupsCollapsedSidebarProps) => {
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
    <div className="space-y-2">
      {Object.entries(groupedSetups).map(([name, setups]) => (
        <div key={name}>
          {setups.length > 1 ? (
            <>
              <button
                onClick={() => toggleGroup(name)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-destructive/15 to-destructive/5 border border-destructive/25 transition-colors text-left"
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
                </div>
                <span className="text-xs font-bold bg-destructive/25 text-destructive px-2 py-0.5 rounded-full">
                  {setups.length}
                </span>
              </button>
              {expandedGroups.has(name) && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-destructive/20 pl-3 animate-fade-in">
                  {setups.map((setup, idx) => (
                    <div
                      key={setup.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded-md bg-destructive/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center text-[10px] text-destructive/70 font-medium">
                          {idx + 1}
                        </span>
                        <Clock className="w-3 h-3 text-destructive/50" />
                      </div>
                      <span className="font-mono font-semibold text-destructive">{setup.formatted}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-destructive/15 to-destructive/5 border border-destructive/25">
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
  );
};