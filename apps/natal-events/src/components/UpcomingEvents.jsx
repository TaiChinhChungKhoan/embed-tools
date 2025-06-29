import React, { useMemo } from 'react';
import { getEventVisuals, formatEventDate, getEventMeaning } from '../utils/eventVisuals';
import * as Lucide from 'lucide-react';

const UpcomingEvents = ({ events, onEventClick }) => {
  // Pre-compute a map of lowercase icon names to Lucide components for performance.
  // This avoids dynamic lookups inside the render loop.
  const iconComponents = useMemo(() => {
    const components = {};
    Object.keys(Lucide).forEach(key => {
      components[key.toLowerCase()] = Lucide[key];
    });
    return components;
  }, []);

  if (!events || events.length === 0) {
    return (
      <div className="text-slate-500 text-center py-8">
        <p>Không có sự kiện sắp tới trong 6 tháng tới.</p>
      </div>
    );
  }

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If start and end are the same day, show only one date
    if (start.toDateString() === end.toDateString()) {
      return typeof formatEventDate === 'function' ? formatEventDate(start) : start.toLocaleDateString();
    }
    
    // If different days, show range
    const startFormatted = start.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    });
    const endFormatted = end.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="space-y-2 mb-6">
      {sortedEvents.slice(0, 5).map((event, index) => {
        const eventDate = event.startDate ? new Date(event.startDate) : null;
        if (!eventDate || isNaN(eventDate)) return null;
        
        const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
        const { icon, color } = getEventVisuals(event.type) || { icon: 'Sparkles', color: '#6b7280' };
        const IconComponent = iconComponents[icon.toLowerCase()] || Lucide.Sparkles;
        const dateRange = formatDateRange(event.startDate, event.endDate);

        return (
          <div
            key={`${event.title}-${event.startDate}-${index}`}
            onClick={() => onEventClick(event.startDate)}
            // This is the key change to match astro-events:
            // - Default state is clean with a transparent border to prevent layout shift.
            // - On hover, we apply a background, a shadow, and a visible border to create the "box".
            className="p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:bg-slate-50 hover:shadow-md hover:border-slate-200"
          >
            <div className="flex items-center font-sans">
              <div className="w-6 h-6 mr-3 flex-shrink-0 flex items-center justify-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <IconComponent className="w-4 h-4" style={{ color, strokeWidth: 2.5 }} />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-800">{event.title}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    daysUntil <= 7 ? 'bg-red-100 text-red-800' :
                    daysUntil <= 30 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {daysUntil === 0 ? 'Hôm nay' :
                     daysUntil === 1 ? 'Ngày mai' :
                     `${daysUntil} ngày`}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{dateRange}</p>
                {event.score && (
                  <p className="text-xs text-slate-400 mt-1">Điểm: {event.score.toFixed(1)}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {events.length > 5 && (
        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">
            +{events.length - 5} sự kiện khác
          </span>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents; 