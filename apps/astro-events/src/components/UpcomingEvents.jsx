import React from 'react';
import * as Lucide from 'lucide-react';
import { getEventVisuals, formatEventDate } from '../utils/astroCalculator';

const UpcomingEvents = ({ events, onEventClick }) => {
  if (!events.length) {
    return <p className="text-slate-400 text-sm">Không có sự kiện lớn nào trong 6 tháng tới.</p>;
  }
  return (
    <div className="space-y-4 mb-8">
      {events.map((event, idx) => {
        const eventDate = new Date(event.startDate);
        const { icon, color } = getEventVisuals(event.type);
        const Icon = Lucide[icon] || Lucide.Sparkles;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-slate-800/50"
            onClick={() => onEventClick(event.startDate)}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="font-medium text-sm text-white">{event.title}</p>
              <p className="text-xs text-slate-400">{formatEventDate(eventDate)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingEvents; 