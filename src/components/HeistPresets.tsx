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
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Heist Presets
      </h3>
      <div className="space-y-2">
        {presets.map((preset) => (
          <div key={preset.name} className="rounded-lg overflow-hidden">
            {/* Heist Header */}
            <button
              onClick={() => toggleExpand(preset.name)}
              className="w-full flex items-center gap-2 p-3 bg-secondary/50 hover:bg-secondary/80 transition-colors text-left"
            >
              {expandedHeist === preset.name ? (
                <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="font-medium text-foreground">{preset.name}</span>
            </button>

            {/* Expanded Content */}
            {expandedHeist === preset.name && (
              <div className="bg-secondary/30 p-2 space-y-1 animate-fade-in">
                {/* Setups */}
                {preset.setups.map((setup, index) => (
                  <button
                    key={setup}
                    onClick={() => handleSelect(setup)}
                    className="w-full flex items-center gap-2 p-2 pl-8 rounded hover:bg-primary/20 transition-colors text-left group"
                  >
                    <Wrench className="w-3 h-3 text-primary/60 group-hover:text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">
                      {index + 1}. {setup}
                    </span>
                  </button>
                ))}
                
                {/* Final Heist */}
                <button
                  onClick={() => handleSelect(preset.finalHeist)}
                  className="w-full flex items-center gap-2 p-2 pl-8 rounded hover:bg-success/20 transition-colors text-left group mt-2 border-t border-border/30 pt-3"
                >
                  <Target className="w-3 h-3 text-success/60 group-hover:text-success flex-shrink-0" />
                  <span className="text-sm font-medium text-success/80 group-hover:text-success">
                    Heist: {preset.finalHeist}
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
