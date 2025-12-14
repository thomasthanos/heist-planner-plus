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
    <div className="space-y-1">
      {Object.entries(groupedSetups).map(([name, setups]) => (
        <div key={name}>
          {setups.length > 1 ? (
            <>
              <button
                onClick={() => toggleGroup(name)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors text-left"
              >
                <div className="flex items-center gap-1.5">
                  {expandedGroups.has(name) ? (
                    <ChevronDown className="w-3 h-3 text-destructive" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-destructive/60" />
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]">
                    {name}
                  </span>
                  <span className="text-[10px] bg-destructive/20 text-destructive px-1 py-0.5 rounded">
                    x{setups.length}
                  </span>
                </div>
              </button>
              {expandedGroups.has(name) && (
                <div className="ml-3 mt-1 space-y-0.5 animate-fade-in">
                  {setups.map((setup, idx) => (
                    <div
                      key={setup.id}
                      className="flex items-center justify-between px-2 py-1 rounded bg-destructive/5 border border-destructive/10 text-xs"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground w-3">{idx + 1}.</span>
                        <Clock className="w-2.5 h-2.5 text-destructive/40" />
                      </div>
                      <span className="font-mono text-destructive">{setup.formatted}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-destructive/60" />
                <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                  {name}
                </span>
              </div>
              <span className="font-mono text-xs text-destructive">{setups[0].formatted}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};