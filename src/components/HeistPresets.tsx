import { useState } from 'react';
import { ChevronDown, ChevronRight, Target, Wrench } from 'lucide-react';

interface HeistPreset {
  name: string;
  setups: string[];
  finalHeist: string;
}

const presets: HeistPreset[] = [
  {
    name: "Knowway Out",
    setups: ["Negative Press", "Inside Jobs", "Tunnel Vision", "Trash Talking"],
    finalHeist: "A Clean Break"
  },
  {
    name: "Oscar Guman Flies Again",
    setups: ["Up and Running", "Mogul", "Intel", "Iron Mule", "Ammunation"],
    finalHeist: "The Titan Job"
  },
  {
    name: "The Cluckin Bell Farm Raid",
    setups: ["Slush Fund", "Breaking and Entering", "Concealed Weapons", "Hit and Run", "Disorganized Crime"],
    finalHeist: "Scene of the Crime"
  }
];

interface HeistPresetsProps {
  onSelectName: (name: string) => void;
}

export const HeistPresets = ({ onSelectName }: HeistPresetsProps) => {
  const [expandedHeist, setExpandedHeist] = useState<string | null>(null);

  const toggleExpand = (heistName: string) => {
    setExpandedHeist(expandedHeist === heistName ? null : heistName);
  };

  const handleSelect = (name: string) => {
    onSelectName(name);
  };

  return (
    <div className="glass rounded-xl p-4 animate-fade-in">
      <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">
        Heist Presets
      </h3>
      <div className="space-y-3">
        {presets.map((preset) => (
          <div key={preset.name} className="rounded-xl overflow-hidden">
            {/* Heist Header */}
            <button
              onClick={() => toggleExpand(preset.name)}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-secondary/70 to-secondary/40 border-2 border-border/40 border-b-4 border-b-border/60 rounded-xl transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                {expandedHeist === preset.name ? (
                  <ChevronDown className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-primary/60" />
                )}
              </div>
              <span className="font-semibold text-foreground">{preset.name}</span>
            </button>

            {/* Expanded Content */}
            {expandedHeist === preset.name && (
              <div className="mt-2 ml-4 border-l-2 border-primary/30 pl-4 space-y-2 animate-fade-in py-2">
                {/* Setups */}
                {preset.setups.map((setup, index) => (
                  <button
                    key={setup}
                    onClick={() => handleSelect(setup)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-secondary/50 to-transparent border border-border/30 border-b-2 border-b-border/50 transition-colors text-left group"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                      <Wrench className="w-3 h-3 text-primary/70 group-hover:text-primary" />
                    </div>
                    <span className="text-sm text-foreground/70 group-hover:text-foreground">
                      {index + 1}. {setup}
                    </span>
                  </button>
                ))}
                
                {/* Final Heist */}
                <button
                  onClick={() => handleSelect(preset.finalHeist)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-success/20 to-success/5 border border-success/30 border-b-2 border-b-success/50 transition-colors text-left group mt-3"
                >
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Target className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-sm font-medium text-success/80 group-hover:text-success">
                    {preset.finalHeist}
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
