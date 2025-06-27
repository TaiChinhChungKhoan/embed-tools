import React, { useEffect, useState } from 'react';
import AstroCalculator from './utils/astroEventsReal';
import TimelineChart from './components/TimelineChart';
import TimelineList from './components/TimelineList';
import UpcomingEvents from './components/UpcomingEvents';
import EventFinder from './components/EventFinder';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [events, setEvents] = useState([]);

  // Centralized event fetching and filtering
  useEffect(() => {
    setLoading(true);
    const startDate = new Date(focusDate);
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date(focusDate);
    endDate.setDate(endDate.getDate() + 60);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    let allRelevantEvents = [];
    for (let year = startYear; year <= endYear; year++) {
      const yearEvents = AstroCalculator.getAllEventsForYear(year);
      allRelevantEvents = allRelevantEvents.concat(yearEvents);
    }
    
    const eventsForDisplay = allRelevantEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      const isInRange = eventDate >= startDate && eventDate <= endDate;
      return isInRange;
    });
    
    eventsForDisplay.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    setEvents(eventsForDisplay);
    setLoading(false);
  }, [focusDate]);

  // Date picker handler
  const handleDateChange = (e) => {
    setFocusDate(new Date(e.target.value));
  };

  // Event click handler (from timeline or upcoming)
  const handleEventClick = (dateString) => {
    setFocusDate(new Date(dateString));
  };

  // Find next event by title
  const handleFindNextEvent = (title) => {
    const now = new Date();
    const searchLimit = new Date();
    searchLimit.setFullYear(now.getFullYear() + 40);
    let allFutureEvents = [];
    for (let year = now.getFullYear(); year <= searchLimit.getFullYear(); year++) {
      allFutureEvents = allFutureEvents.concat(AstroCalculator.getAllEventsForYear(year));
    }
    const nextEvent = allFutureEvents.find(e => e.title === title && new Date(e.startDate) > now);
    if (nextEvent) {
      setFocusDate(new Date(nextEvent.startDate));
    } else {
      alert(`Không tìm thấy sự kiện "${title}" trong 40 năm tới.`);
    }
  };

  // Upcoming events: next 6 months from now
  const now = new Date();
  const sixMonths = new Date();
  sixMonths.setMonth(now.getMonth() + 6);
  const upcomingEvents = events
    .filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate > now && eventDate <= sixMonths;
    })
    .slice(0, 5);

  // Event definitions for EventFinder (unique titles)
  const allEventDefs = Array.from(
    new Map(events.map(e => [e.title, { title: e.title, type: e.type }])).values()
  );

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
                    value={focusDate.toISOString().split('T')[0]}
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
              <EventFinder eventDefs={allEventDefs} onFind={handleFindNextEvent} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;