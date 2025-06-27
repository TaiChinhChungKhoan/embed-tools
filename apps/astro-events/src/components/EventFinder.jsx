import React from 'react';
import * as Lucide from 'lucide-react';
import { getEventVisuals } from '../utils/astroCalculator';

const EventFinder = ({ eventDefs, onFind }) => {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {eventDefs.map((def, idx) => {
        const { icon, color } = getEventVisuals(def.type);
        const Icon = Lucide[icon.charAt(0).toUpperCase() + icon.slice(1)] || Lucide.Sparkles;
        return (
          <button
            key={idx}
            className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:bg-slate-50 hover:shadow-sm hover:border-slate-200 text-left"
            onClick={() => onFind(def.title)}
            type="button"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <span className="text-sm text-gray-900">{def.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default EventFinder;