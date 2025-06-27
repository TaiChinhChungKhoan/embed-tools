import React from 'react';
// These utility functions are imported in App.jsx, so we assume they are available here.
// We add checks to prevent errors if they are not.
import { getEventVisuals, formatEventDate } from '../utils/astroEventsReal';
import * as Lucide from 'lucide-react';

const UpcomingEvents = ({ events, onEventClick }) => {
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

  return (
    <div className="space-y-2 mb-6">
      {events.map((event, index) => {
        const { icon, color } = getEventVisuals(event.type);
        const Icon = Lucide[icon.charAt(0).toUpperCase() + icon.slice(1)] || Lucide.Sparkles;
        const dateRange = formatDateRange(event.startDate, event.endDate);

        return (
          <div
            key={index}
            onClick={() => onEventClick(event.startDate)}
            // This is the key change to match sample.html:
            // - Default state is clean with a transparent border to prevent layout shift.
            // - On hover, we apply a background, a shadow, and a visible border to create the "box".
            className="p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:bg-slate-50 hover:shadow-sm hover:border-slate-200"
          >
            <div className="flex items-center font-sans">
              <div className="w-6 h-6 mr-3 flex-shrink-0 flex items-center justify-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color, strokeWidth: 2.5 }} />
                </div>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-slate-800">{event.title}</p>
                <p className="text-sm text-slate-500">{dateRange}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingEvents;