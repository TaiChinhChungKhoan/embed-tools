import React, { useEffect, useState, useMemo, useCallback } from 'react';
import AstroCalculator from './utils/astroEventsReal';
import TimelineChart from './components/TimelineChart';
import TimelineList from './components/TimelineList';
import UpcomingEvents from './components/UpcomingEvents';
import EventFinder from './components/EventFinder';
import iframeUtils from '@embed-tools/iframe-utils';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [focusDate, setFocusDate] = useState(() => new Date());
  const isEmbedded = iframeUtils.isEmbedded();

  // Pre-compute all events for the next 2 years once
  const allFutureEvents = useMemo(() => {
    const now = new Date();
    const searchLimit = new Date();
    searchLimit.setFullYear(now.getFullYear() + 2);
    
    let allEvents = [];
    for (let year = now.getFullYear(); year <= searchLimit.getFullYear(); year++) {
      const yearEvents = AstroCalculator.getAllEventsForYear(year);
      allEvents = allEvents.concat(yearEvents);
    }
    return allEvents;
  }, []); // Empty dependency array - compute once on mount

  // Comprehensive event indexing system with multiple hash tables
  const eventIndex = useMemo(() => {
    const index = {
      // Title-based lookup (existing functionality)
      byTitle: {},
      
      // Type-based lookup for filtering events by category
      byType: {},
      
      // Date-based lookup for quick range queries
      byDate: {},
      
      // Planet-based lookup for astronomical events
      byPlanet: {},
      
      // Month-based lookup for seasonal patterns
      byMonth: {},
      
      // Quick access to all events
      allEvents: allFutureEvents,
      
      // Statistics
      stats: {
        totalEvents: allFutureEvents.length,
        uniqueTitles: 0,
        uniqueTypes: 0,
        dateRange: { start: null, end: null }
      }
    };

    // Build all indexes
    allFutureEvents.forEach(event => {
      const eventDate = new Date(event.startDate);
      const month = eventDate.getMonth();
      const year = eventDate.getFullYear();
      const dateKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      // Title index
      if (!index.byTitle[event.title]) {
        index.byTitle[event.title] = [];
      }
      index.byTitle[event.title].push(event);
      
      // Type index
      if (!index.byType[event.type]) {
        index.byType[event.type] = [];
      }
      index.byType[event.type].push(event);
      
      // Date index (by month for quick range queries)
      if (!index.byDate[dateKey]) {
        index.byDate[dateKey] = [];
      }
      index.byDate[dateKey].push(event);
      
      // Month index (for seasonal patterns)
      if (!index.byMonth[month]) {
        index.byMonth[month] = [];
      }
      index.byMonth[month].push(event);
      
      // Planet index (extract planet names from titles)
      const planetMatch = event.title.match(/(Sao Thủy|Kim Tinh|Hỏa Tinh|Mộc Tinh|Thổ Tinh|Hải Vương Tinh)/);
      if (planetMatch) {
        const planet = planetMatch[1];
        if (!index.byPlanet[planet]) {
          index.byPlanet[planet] = [];
        }
        index.byPlanet[planet].push(event);
      }
    });

    // Pre-sort all arrays by date for binary search
    Object.keys(index.byTitle).forEach(title => {
      index.byTitle[title].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    });
    
    Object.keys(index.byType).forEach(type => {
      index.byType[type].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    });
    
    Object.keys(index.byPlanet).forEach(planet => {
      index.byPlanet[planet].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    });

    // Calculate statistics
    index.stats.uniqueTitles = Object.keys(index.byTitle).length;
    index.stats.uniqueTypes = Object.keys(index.byType).length;
    
    if (allFutureEvents.length > 0) {
      const dates = allFutureEvents.map(e => new Date(e.startDate)).sort((a, b) => a - b);
      index.stats.dateRange = {
        start: dates[0],
        end: dates[dates.length - 1]
      };
    }

    return index;
  }, [allFutureEvents]);

  // Binary search function to find next event after a given date
  const findNextEventAfter = useCallback((events, targetDate) => {
    let left = 0;
    let right = events.length - 1;
    let result = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const eventDate = new Date(events[mid].startDate);
      
      if (eventDate > targetDate) {
        result = mid;
        right = mid - 1; // Look for earlier event that's still after target
      } else {
        left = mid + 1;
      }
    }
    
    return result >= 0 ? events[result] : null;
  }, []);

  // Advanced lookup functions using the comprehensive index
  const eventLookup = useMemo(() => ({
    // Find next event by title (existing functionality)
    findNextByTitle: (title) => {
      const events = eventIndex.byTitle[title];
      if (!events || events.length === 0) return null;
      return findNextEventAfter(events, new Date());
    },

    // Find next event by type (e.g., all retrogrades)
    findNextByType: (type) => {
      const events = eventIndex.byType[type];
      if (!events || events.length === 0) return null;
      return findNextEventAfter(events, new Date());
    },

    // Find next event by planet
    findNextByPlanet: (planet) => {
      const events = eventIndex.byPlanet[planet];
      if (!events || events.length === 0) return null;
      return findNextEventAfter(events, new Date());
    },

    // Find events in a date range
    findInDateRange: (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const results = [];
      
      // Use date index for efficient range queries
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      
      for (let year = startYear; year <= endYear; year++) {
        for (let month = 0; month < 12; month++) {
          const dateKey = `${year}-${month.toString().padStart(2, '0')}`;
          const monthEvents = eventIndex.byDate[dateKey];
          if (monthEvents) {
            monthEvents.forEach(event => {
              const eventDate = new Date(event.startDate);
              if (eventDate >= start && eventDate <= end) {
                results.push(event);
              }
            });
          }
        }
      }
      
      return results.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    },

    // Find events by month (seasonal patterns)
    findByMonth: (month) => {
      return eventIndex.byMonth[month] || [];
    },

    // Get statistics
    getStats: () => eventIndex.stats,

    // Get all events of a specific type
    getAllByType: (type) => eventIndex.byType[type] || [],

    // Get all events for a specific planet
    getAllByPlanet: (planet) => eventIndex.byPlanet[planet] || []
  }), [eventIndex, findNextEventAfter]);

  // Optimized find next event by title - uses binary search
  const handleFindNextEvent = useCallback((title) => {
    setFinding(true);
    
    // Use setTimeout to allow the UI to update before the search
    setTimeout(() => {
      const nextEvent = eventLookup.findNextByTitle(title);
      
      if (nextEvent) {
        setFocusDate(new Date(nextEvent.startDate));
      } else {
        alert(`Không tìm thấy sự kiện "${title}" trong 2 năm tới.`);
      }
      
      setFinding(false);
    }, 10); // Small delay to ensure UI updates
  }, [eventLookup]);

  // Set loading to false once initial computation is complete
  useEffect(() => {
    if (allFutureEvents.length > 0) {
      setLoading(false);
    }
  }, [allFutureEvents]);

  // Date picker handler
  const handleDateChange = (e) => {
    setFocusDate(new Date(e.target.value));
  };

  // Event click handler (from timeline or upcoming)
  const handleEventClick = useCallback((dateString) => {
    setFocusDate(new Date(dateString));
  }, []);

  // Memoize events for the timeline view. This is much faster than re-calculating.
  const events = useMemo(() => {
    const startDate = new Date(focusDate);
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date(focusDate);
    endDate.setDate(endDate.getDate() + 60);
    // Use the pre-indexed lookup function for high performance
    return eventLookup.findInDateRange(startDate, endDate);
  }, [focusDate, eventLookup]);

  // Memoize upcoming events based on the full future list, not the focused view
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(now.getMonth() + 6);
    return allFutureEvents
      .filter(e => {
        const eventDate = new Date(e.startDate);
        return eventDate > now && eventDate <= sixMonthsLater;
      })
      .slice(0, 5);
  }, [allFutureEvents]);

  // Event definitions for EventFinder (comprehensive list)
  const allEventDefs = useMemo(() => AstroCalculator.getAllKnownEventDefinitions(), []);

  // Notify parent when state changes (for iframe embedding)
  useEffect(() => {
    if (!isEmbedded) return;
    const timer = setTimeout(() => {
      const container = document.querySelector('.min-h-screen');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        iframeUtils.sendResizeMessage(width, height);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [events, finding, focusDate, isEmbedded]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50 transition-opacity duration-500">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-300 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Đang khởi tạo Công cụ Thiên thể...</p>
        </div>
      )}
      <div className={`max-w-7xl mx-auto p-4 lg:p-8 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Các sự kiện thiên văn tài chính</h1>
          <p className="text-slate-500 mt-2">Theo dõi các chu kỳ hành tinh và các sự kiện thiên thể quan trọng.</p>
        </header>
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="w-full lg:w-2/3">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">Tổng Quan Sự Kiện</h2>
                <div className="relative">
                  <label htmlFor="date-picker" className="text-slate-600 mr-2">Chọn Ngày:</label>
                  <input
                    type="date"
                    id="date-picker"
                    className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-slate-900"
                    value={isNaN(focusDate) ? '' : focusDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <TimelineChart events={events} focusDate={focusDate} onZoom={setFocusDate} />
              <h3 className="text-xl font-semibold text-slate-900 mb-4 border-t border-slate-200 pt-6">Chi Tiết Dòng Thời Gian</h3>
              <TimelineList events={events} centerDate={focusDate} onEventClick={handleEventClick} />
            </div>
          </main>
          <aside className="w-full lg:w-1/3">
            <div className="p-6 sticky top-8 bg-white border border-slate-200 rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Sự Kiện Sắp Tới</h2>
              <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 border-t border-slate-200 pt-6">Tìm Sự Kiện</h2>
              <EventFinder eventDefs={allEventDefs} onFind={handleFindNextEvent} finding={finding} />
            </div>
          </aside>
        </div>
      </div>
      
      {!isEmbedded && (
        <footer className="text-center mt-12 mb-8 text-xs text-gray-500 max-w-4xl mx-auto px-4">
          <p>© 2025 Taichinhchungkhoan.com</p>
          <p className="mt-1">Taichinhchungkhoan.com - Nền tảng kiến thức và công cụ tài chính cho người Việt</p>
          <p className="mt-2">Sử dụng thư viện astronomia cho tính toán thiên văn chính xác.</p>
          <p className="mt-2">
            <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Ứng dụng này được tạo ra cho mục đích tham khảo và giáo dục về thiên văn học tài chính.
            Thông tin cung cấp không được coi là lời khuyên đầu tư chuyên nghiệp.
            Luôn tham khảo ý kiến chuyên gia tài chính và nghiên cứu kỹ lưỡng trước khi ra quyết định đầu tư.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;