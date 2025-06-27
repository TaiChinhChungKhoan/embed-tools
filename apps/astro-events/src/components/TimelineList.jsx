import React from 'react';
import * as Lucide from 'lucide-react';
import { getEventVisuals, formatEventDate } from '../utils/astroCalculator';

const TimelineList = ({ events, centerDate, onEventClick }) => {
  if (!events.length) {
    return <p className="text-gray-700 text-center py-8">Không có sự kiện quan trọng nào trong giai đoạn này.</p>;
  }
  return (
    <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-4">
      {events.map((event, idx) => {
        const eventDate = new Date(event.startDate);
        const isPast = eventDate < centerDate;
        const { icon, color } = getEventVisuals(event.type);
        const Icon = Lucide[icon] || Lucide.Sparkles;
        return (
          <div
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-lg border-l-4 transition-colors duration-200 cursor-pointer bg-white shadow-sm hover:bg-gray-50 border-gray-200 ${isPast ? 'opacity-60' : ''}`}
            style={{ borderColor: color }}
            onClick={() => onEventClick(event.startDate)}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-900">{event.title}</p>
              <p className="text-sm text-gray-800">{event.description}</p>
              <p className="text-xs text-gray-700 mt-2">{formatEventDate(eventDate)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineList; 