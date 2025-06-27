import React from 'react';
// These utility functions are imported in App.jsx, so we assume they are available here.
// We add checks to prevent errors if they are not.
import { getEventVisuals, formatEventDate } from '../utils/astroCalculator';
import * as Lucide from 'lucide-react';

const UpcomingEvents = ({ events, onEventClick }) => {
  if (!events || events.length === 0) {
    return <p className="text-slate-500 mb-6">Không có sự kiện nào sắp diễn ra.</p>;
  }

  return (
    <div className="space-y-2 mb-6">
      {events.map((event, index) => {
        const { icon, color } = getEventVisuals(event.type);
        const Icon = Lucide[icon.charAt(0).toUpperCase() + icon.slice(1)] || Lucide.Sparkles;

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
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-slate-800">{event.title}</p>
                <p className="text-sm text-slate-500">{typeof formatEventDate === 'function' ? formatEventDate(event.startDate) : new Date(event.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingEvents;