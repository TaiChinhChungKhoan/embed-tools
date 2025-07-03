import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AstroCalculator, getEventVisuals, formatEventDate } from '@embed-tools/astro-utils';
import TimelineChart from './components/TimelineChart';
import TimelineList from './components/TimelineList';
import UpcomingEvents from './components/UpcomingEvents';
import EventFinder from './components/EventFinder';
import iframeUtils from '@embed-tools/iframe-utils';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [finding, setFinding] = useState(false);
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const isEmbedded = iframeUtils.isEmbedded();

  // Calculate events for a specific date range when needed
  const calculateEventsForRange = useCallback((startDate, endDate) => {
    setLoading(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        
        let allEvents = [];
        for (let year = startYear; year <= endYear; year++) {
          const yearEvents = AstroCalculator.getAllEventsForYear(year);
          allEvents = allEvents.concat(yearEvents);
        }
        
        // Filter events within the specified range
        const filteredEvents = allEvents.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate >= startDate && eventDate <= endDate;
        });
        
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error calculating events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }, 10);
  }, []);

  // Calculate upcoming events when needed
  const calculateUpcomingEvents = useCallback(() => {
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(now.getMonth() + 6);
    
    setLoading(true);
    
    setTimeout(() => {
      try {
        const currentYear = now.getFullYear();
        const nextYear = sixMonthsLater.getFullYear();
        
        let allEvents = [];
        for (let year = currentYear; year <= nextYear; year++) {
          const yearEvents = AstroCalculator.getAllEventsForYear(year);
          allEvents = allEvents.concat(yearEvents);
        }
        
        const upcoming = allEvents
          .filter(e => {
            const eventDate = new Date(e.startDate);
            return eventDate > now && eventDate <= sixMonthsLater;
          })
          .slice(0, 5);
        
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error calculating upcoming events:', error);
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    }, 10);
  }, []);

  // Calculate events for timeline view when focusDate changes
  useEffect(() => {
    const startDate = new Date(focusDate);
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date(focusDate);
    endDate.setDate(endDate.getDate() + 60);
    
    calculateEventsForRange(startDate, endDate);
  }, [focusDate, calculateEventsForRange]);

  // Calculate upcoming events on mount
  useEffect(() => {
    calculateUpcomingEvents();
  }, [calculateUpcomingEvents]);

  // Find next event by title
  const handleFindNextEvent = useCallback((title) => {
    setFinding(true);
    
    setTimeout(() => {
      try {
        const now = new Date();
        const searchLimit = new Date();
        searchLimit.setFullYear(now.getFullYear() + 2);
        
        let allEvents = [];
        for (let year = now.getFullYear(); year <= searchLimit.getFullYear(); year++) {
          const yearEvents = AstroCalculator.getAllEventsForYear(year);
          allEvents = allEvents.concat(yearEvents);
        }
        
        const nextEvent = allEvents.find(event => 
          event.title === title && new Date(event.startDate) > now
        );
        
        if (nextEvent) {
          setFocusDate(new Date(nextEvent.startDate));
        } else {
          alert(`Không tìm thấy sự kiện "${title}" trong 2 năm tới.`);
        }
      } catch (error) {
        console.error('Error finding next event:', error);
        alert('Có lỗi xảy ra khi tìm kiếm sự kiện.');
      } finally {
        setFinding(false);
      }
    }, 10);
  }, []);

  // Date picker handler
  const handleDateChange = (e) => {
    setFocusDate(new Date(e.target.value));
  };

  // Event click handler (from timeline or upcoming)
  const handleEventClick = useCallback((dateString) => {
    setFocusDate(new Date(dateString));
  }, []);

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
          <p className="mt-4 text-lg text-gray-600">Đang tính toán sự kiện...</p>
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
          <p>
            © {new Date().getFullYear()} <a href="https://taichinhchungkhoan.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Taichinhchungkhoan.com</a>
          </p>
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