import React, { useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { getEventVisuals } from '../utils/astroEventsReal';

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const EventFinder = ({ eventDefs, onFind }) => {
  // Memoize the icon/color lookup so it doesn't run on every render
  const items = useMemo(() => {
    return eventDefs.map(def => {
      const { icon, color } = getEventVisuals(def.type);
      const IconComponent = Lucide[capitalize(icon)] || Lucide.Sparkles;
      return { 
        title: def.title, 
        IconComponent, 
        color 
      };
    });
  }, [eventDefs]);

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {items.map(({ title, IconComponent, color }, idx) => (
        <button
          key={idx}
          className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                     border border-transparent hover:bg-slate-50 hover:shadow-sm hover:border-slate-200 text-left"
          onClick={() => onFind(title)}
          type="button"
        >
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: color + '20' }}
          >
            <IconComponent className="w-4 h-4" style={{ color, strokeWidth: 2.5 }} />
          </div>
          <span className="text-sm text-gray-900">{title}</span>
        </button>
      ))}
    </div>
  );
};

export default EventFinder;
