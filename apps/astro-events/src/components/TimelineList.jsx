import React from 'react';
import * as Lucide from 'lucide-react';
import { getEventVisuals, formatEventDate } from '../utils/astroEventsReal';

const TimelineList = ({ events, centerDate, onEventClick }) => {
  if (!events.length) {
    return <p className="text-gray-700 text-center py-8">Không có sự kiện quan trọng nào trong giai đoạn này.</p>;
  }
  
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If start and end are the same day, show only one date
    if (start.toDateString() === end.toDateString()) {
      return formatEventDate(start);
    }
    
    // If different days, show range
    const startFormatted = start.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    });
    const endFormatted = end.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };
  
  return (
    <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-4">
      {events.map((event, idx) => {
        const eventDate = new Date(event.startDate);
        const isPast = eventDate < centerDate;
        const { icon, color } = getEventVisuals(event.type);
        const Icon = Lucide[icon] || Lucide.Sparkles;
        const dateRange = formatDateRange(event.startDate, event.endDate);
        
        return (
          <div
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-lg border-l-4 transition-colors duration-200 cursor-pointer bg-white shadow-sm hover:bg-gray-50 border-gray-200 ${isPast ? 'opacity-60' : ''}`}
            style={{ borderColor: color }}
            onClick={() => onEventClick(event.startDate)}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
              <Icon className="w-6 h-6" style={{ color, strokeWidth: 2.5 }} />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-900">{event.title}</p>
              <p className="text-sm text-gray-800">{event.description || ''}</p>
              <p className="text-xs text-gray-700 mt-2">{dateRange}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineList; 