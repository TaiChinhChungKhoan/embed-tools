import React from 'react';
import { getEventVisuals, formatEventDate, getEventMeaning, getMeaningClasses } from '../utils/eventVisuals';
import * as Icons from 'lucide-react';

const TimelineList = ({ events, centerDate, onEventClick }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg font-medium mb-2">No events in this period</div>
        <div className="text-sm">Try selecting a different date range</div>
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="max-h-96 overflow-y-auto pr-2">
      <div className="space-y-4">
        {sortedEvents.map((event, index) => {
          const eventDate = event.startDate ? new Date(event.startDate) : null;
          const isToday = eventDate && eventDate.toDateString() === new Date().toDateString();
          const isCenterDate = centerDate && eventDate && eventDate.toDateString() === centerDate.toDateString();
          const meaning = getEventMeaning(event.type);
          const meaningClasses = getMeaningClasses(meaning);
          const visuals = getEventVisuals(event.type);
          const IconComponent = Icons[visuals.icon] || Icons.Sparkles;
          if (!eventDate || isNaN(eventDate)) return null;
          return (
            <div
              key={`${event.title}-${event.startDate}-${index}`}
              className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${meaningClasses} ${
                isToday ? 'ring-2 ring-blue-500' : ''
              } ${isCenterDate ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => onEventClick(event.startDate)}
            >
              {/* Event indicator line */}
              <div className="absolute left-0 top-0 bottom-0 w-1"></div>
              
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: visuals.color }}
                >
                  <IconComponent size={20} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {/* Meaning badge */}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        meaning === 'harmonious' ? 'bg-green-100 text-green-800' :
                        meaning === 'challenging' ? 'bg-red-100 text-red-800' :
                        meaning === 'powerful' ? 'bg-orange-100 text-orange-800' :
                        meaning === 'significant' ? 'bg-purple-100 text-purple-800' :
                        meaning === 'new_beginning' ? 'bg-blue-100 text-blue-800' :
                        meaning === 'culmination' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {(meaning || 'neutral').replace('_', ' ')}
                      </span>
                      
                      {/* Today indicator */}
                      {isToday && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description || 'Natal chart transit event'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">
                        {formatEventDate(eventDate)}
                      </span>
                      {event.score && (
                        <span className="text-gray-500">
                          Score: {event.score.toFixed(1)}
                        </span>
                      )}
                    </div>
                    
                    {/* Event type */}
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {event.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  {/* Additional details */}
                  {event.details && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      {event.details}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineList; 