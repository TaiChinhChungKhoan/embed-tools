import React, { useMemo, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { getEventVisuals } from '../utils/astroEventsReal';

const EventFinder = React.memo(({ eventDefs, onFind, finding = false }) => {
  // Pre-compute all possible icon components to avoid dynamic imports
  const iconComponents = useMemo(() => {
    const components = {};
    Object.keys(Lucide).forEach(key => {
      components[key.toLowerCase()] = Lucide[key];
    });
    return components;
  }, []);

  // Memoize the icon/color lookup so it doesn't run on every render
  const items = useMemo(() => {
    return eventDefs.map(def => {
      const { icon, color } = getEventVisuals(def.type);
      // Use pre-computed icon components for faster lookup
      const IconComponent = iconComponents[icon.toLowerCase()] || Lucide.Sparkles;
      return { 
        title: def.title, 
        IconComponent, 
        color 
      };
    });
  }, [eventDefs, iconComponents]);

  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback((title) => {
    onFind(title);
  }, [onFind]);

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {finding && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang tìm kiếm...</span>
        </div>
      )}
      {items.map(({ title, IconComponent, color }, idx) => (
        <button
          key={title}
          className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 
                     border border-transparent hover:bg-slate-50 hover:shadow-sm hover:border-slate-200 text-left
                     ${finding ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleClick(title)}
          type="button"
          disabled={finding}
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
});

EventFinder.displayName = 'EventFinder';

export default EventFinder;
