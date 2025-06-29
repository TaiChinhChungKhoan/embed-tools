import React, { useState, useMemo, useCallback, useEffect } from 'react';
import TimelineChart from './components/TimelineChart';
import TimelineList from './components/TimelineList';
import UpcomingEvents from './components/UpcomingEvents';
import EventFinder from './components/EventFinder';
import InstrumentSelector from './components/InstrumentSelector';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';
import TimeZonePicker from './components/TimeZonePicker';
import TransitPlanetSelector from './components/TransitPlanetSelector';
import NatalPointsFilterSelector from './components/NatalPointsFilterSelector';
import { Button, Card, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Switch } from '@embed-tools/components';
import { NatalCalculator } from '@embed-tools/astro-utils';
import iframeUtils from '@embed-tools/iframe-utils';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [timelineRange, setTimelineRange] = useState(60); // Days on each side of focus date
  const [natalChart, setNatalChart] = useState(null);
  const [events, setEvents] = useState([]);
  const [retroWindows, setRetroWindows] = useState([]);
  const [aspectWindows, setAspectWindows] = useState([]);
  const isEmbedded = iframeUtils.isEmbedded();

  // Form state
  const [formData, setFormData] = useState({
    instrument: '',
    birthDate: new Date(),
    birthTime: '09:00',
    birthLocation: '',
    lat: '',
    lon: '',
    timeZone: { value: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh" },
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    orbDays: 2,
    minScore: 4.0,
    topN: 3,
    transitPlanets: ['Sun', 'Moon'],
    natalPointsFilter: ['Ascendant', 'Midheaven', 'Mercury', 'Jupiter', 'Neptune']
  });

  // Only include transit aspect events as in analyze_natal.py
  const ASPECT_NAMES = [
    'Conjunction (0°)',
    'Square (90°)',
    'Trine (120°)',
    'Opposition (180°)'
  ];

  // Utility to normalize events: ensure all have startDate and endDate
  function normalizeEvents(events) {
    return events.map(e => {
      if (!e.startDate && e.date) {
        return { ...e, startDate: new Date(e.date), endDate: new Date(e.date) };
      }
      return e;
    });
  }

  // After events are generated, normalize them
  const normalizedEvents = useMemo(() => normalizeEvents(events), [events]);

  // Filtered events for display
  const filteredEvents = useMemo(() => {
    const filtered = normalizedEvents.filter(e =>
      e.type === 'transit' &&
      e.aspect &&
      ASPECT_NAMES.includes(e.aspect.name) &&
      e.startDate && !isNaN(new Date(e.startDate))
    );

    return filtered;
  }, [normalizedEvents]);

  // Memoize events for the timeline view with limited range
  const timelineEvents = useMemo(() => {
    if (!filteredEvents.length) return [];
    const startDate = new Date(focusDate);
    startDate.setDate(startDate.getDate() - timelineRange);
    const endDate = new Date(focusDate);
    endDate.setDate(endDate.getDate() + timelineRange);
    return filteredEvents.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }, [focusDate, timelineRange, filteredEvents]);

  // Memoize upcoming events
  const upcomingEvents = useMemo(() => {
    if (!filteredEvents.length) return [];
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(now.getMonth() + 6);
    return filteredEvents
      .filter(e => {
        const eventDate = new Date(e.startDate);
        return eventDate > now && eventDate <= sixMonthsLater;
      })
      .slice(0, 5);
  }, [filteredEvents]);

  // Utility to convert timezone name to UTC offset string
  const getUTCOffset = (timezoneName) => {
    // Common timezone mappings
    const timezoneOffsets = {
      'Asia/Ho_Chi_Minh': '+07:00',
      'Asia/Bangkok': '+07:00',
      'Asia/Singapore': '+08:00',
      'America/New_York': '-05:00',
      'America/Los_Angeles': '-08:00',
      'Europe/London': '+00:00',
      'Europe/Paris': '+01:00',
      'Asia/Tokyo': '+09:00',
      'UTC': '+00:00'
    };
    
    return timezoneOffsets[timezoneName] || '+00:00';
  };

  // Utility to format date as YYYY-MM-DD string
  const formatDateString = (date) => {
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  // Utility to format time as HH:MM string
  const formatTimeString = (time) => {
    if (typeof time === 'string') return time;
    if (time instanceof Date) {
      return time.toTimeString().slice(0, 5);
    }
    return '09:00';
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInstrumentSelect = (instrument) => {
    setFormData(prev => ({
      ...prev,
      instrument: instrument.name,
      birthDate: instrument.birthDate,
      birthTime: instrument.birthTime,
      birthLocation: instrument.birthLocation,
      lat: instrument.lat,
      lon: instrument.lon,
      timeZone: { value: instrument.utcOffset || 'Asia/Ho_Chi_Minh' }
    }));
  };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    
    try {
      // Format date and time as strings
      const birthDateStr = formatDateString(formData.birthDate);
      const birthTimeStr = formatTimeString(formData.birthTime);
      
      // Convert timezone name to UTC offset string
      const utcOffset = getUTCOffset(formData.timeZone.value);
     
      const calculator = new NatalCalculator(
        formData.instrument,
        birthDateStr,
        birthTimeStr,
        formData.birthLocation,
        formData.lat,
        formData.lon,
        utcOffset
      );

      // Calculate natal chart
      const natal = calculator.getNatalChart();
      setNatalChart(natal);

      // Calculate transits
      const results = calculator.calculateTransits(
        formData.startDate,
        formData.endDate,
        formData.orbDays,
        formData.transitPlanets,
        formData.natalPointsFilter
      );

      // Prepare outputs
      const outputs = calculator.prepareOutputs(
        results.events,
        results.retroDays,
        180.0,
        formData.topN
      );

      setEvents(outputs.events);
      setRetroWindows(outputs.retroWindows);
      setAspectWindows(outputs.aspectWindows);
      setFocusDate(new Date()); // Reset to current date
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Handle timeline navigation
  const handleNavigate = useCallback((newFocusDate) => {
    setFocusDate(newFocusDate);
  }, []);

  // Handle timeline zoom (change range)
  const handleZoom = useCallback((newFocusDate) => {
    setFocusDate(newFocusDate);
  }, []);

  // Handle timeline range change
  const handleRangeChange = useCallback((newRange) => {
    setTimelineRange(newRange);
  }, []);

  // Event click handler
  const handleEventClick = useCallback((date) => {
    if (!date) return;
    const dateObj = new Date(date);
    if (!dateObj || isNaN(dateObj)) return;
    setFocusDate(dateObj);
  }, []);

  // Event finder handler
  const handleFindEvent = useCallback((eventType) => {
    if (!events.length) return;
    const now = new Date();
    const nextEvent = events.find(e => {
      if (!e.date) return false;
      const eventDate = new Date(e.date);
      return e.type === eventType && eventDate > now;
    });
    if (nextEvent && nextEvent.date) {
      const dateObj = new Date(nextEvent.date);
      if (!isNaN(dateObj)) setFocusDate(dateObj);
    } else {
      alert(`No upcoming ${eventType} events found in the analysis period.`);
    }
  }, [events]);

  // Notify parent when state changes (for iframe embedding)
  React.useEffect(() => {
    if (!isEmbedded) return;
    const timer = setTimeout(() => {
      const container = document.querySelector('.min-h-screen');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        iframeUtils.sendResizeMessage(width, height);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [timelineEvents, focusDate, natalChart, isEmbedded]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50 transition-opacity duration-500">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-300 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Analyzing natal chart...</p>
        </div>
      )}
      
      <div className={`max-w-7xl mx-auto p-4 lg:p-8 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
            Natal Chart Events
          </h1>
          <p className="text-slate-500 mt-2">
            Analyze natal chart transits and planetary events for financial instruments.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Instrument Details</h2>
              
              <div className="space-y-4">
                <InstrumentSelector 
                  value={formData.instrument}
                  onChange={handleInstrumentSelect}
                />

                <div>
                  <Label htmlFor="instrument">Instrument Name</Label>
                  <Input
                    id="instrument"
                    value={formData.instrument}
                    onChange={(e) => handleFormChange('instrument', e.target.value)}
                    placeholder="e.g., VNIndex, BTC, AAPL"
                  />
                </div>

                <DatePicker
                  label="Birth Date"
                  value={formData.birthDate}
                  onChange={(date) => handleFormChange('birthDate', date)}
                  id="birthDate"
                />

                <TimePicker
                  label="Birth Time"
                  value={formData.birthTime}
                  onChange={(time) => handleFormChange('birthTime', time)}
                  id="birthTime"
                />

                <div>
                  <Label htmlFor="birthLocation">Birth Location</Label>
                  <Input
                    id="birthLocation"
                    value={formData.birthLocation}
                    onChange={(e) => handleFormChange('birthLocation', e.target.value)}
                    placeholder="e.g., Ho Chi Minh City"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      value={formData.lat}
                      onChange={(e) => handleFormChange('lat', e.target.value)}
                      placeholder="e.g., 10.7769N"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lon">Longitude</Label>
                    <Input
                      id="lon"
                      value={formData.lon}
                      onChange={(e) => handleFormChange('lon', e.target.value)}
                      placeholder="e.g., 106.7009E"
                    />
                  </div>
                </div>

                <TimeZonePicker
                  value={formData.timeZone}
                  onChange={(tz) => handleFormChange('timeZone', tz)}
                />
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Analysis Parameters</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(date) => handleFormChange('startDate', date)}
                    id="startDate"
                  />
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => handleFormChange('endDate', date)}
                    id="endDate"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orbDays">Orb Days</Label>
                    <Input
                      id="orbDays"
                      type="number"
                      value={formData.orbDays}
                      onChange={(e) => handleFormChange('orbDays', parseInt(e.target.value))}
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minScore">Min Score</Label>
                    <Input
                      id="minScore"
                      type="number"
                      step="0.1"
                      value={formData.minScore}
                      onChange={(e) => handleFormChange('minScore', parseFloat(e.target.value))}
                      min="0"
                      max="10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="topN">Top N Results</Label>
                  <Input
                    id="topN"
                    type="number"
                    value={formData.topN}
                    onChange={(e) => handleFormChange('topN', parseInt(e.target.value))}
                    min="1"
                    max="20"
                  />
                </div>

                <TransitPlanetSelector
                  value={formData.transitPlanets}
                  onChange={(planets) => handleFormChange('transitPlanets', planets)}
                  id="transitPlanets"
                />

                <NatalPointsFilterSelector
                  value={formData.natalPointsFilter}
                  onChange={(points) => handleFormChange('natalPointsFilter', points)}
                  id="natalPointsFilter"
                />

                <Button 
                  onClick={handleAnalyze}
                  disabled={loading || !formData.instrument}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Analyze Natal Chart'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {natalChart && (
              <>
                {/* Natal Chart Display */}
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Natal Chart</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(natalChart).map(([planet, data]) => (
                      <div key={planet} className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-semibold">{planet}</div>
                        <div className="text-sm text-gray-600">
                          {data.sign} {data.degree}°
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {events.length > 0 && (
              <>
                {/* Timeline Chart */}
                <Card className="p-6 mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold mb-4 sm:mb-0">Transit Timeline</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-slate-600 text-sm">Range:</label>
                        <select
                          value={timelineRange}
                          onChange={(e) => handleRangeChange(Number(e.target.value))}
                          className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                        >
                          <option value={30}>30 days</option>
                          <option value={60}>60 days</option>
                          <option value={90}>90 days</option>
                          <option value={120}>120 days</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label htmlFor="date-picker" className="text-slate-600 mr-2 text-sm">Focus Date:</label>
                        <input
                          type="date"
                          id="date-picker"
                          className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                          value={focusDate.toISOString().split('T')[0]}
                          onChange={(e) => setFocusDate(new Date(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  <TimelineChart 
                    events={timelineEvents} 
                    focusDate={focusDate} 
                    onZoom={handleZoom}
                    onNavigate={handleNavigate}
                  />
                </Card>

                {/* Events List */}
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Transit Events</h2>
                  <TimelineList 
                    events={timelineEvents} 
                    centerDate={focusDate} 
                    onEventClick={handleEventClick} 
                  />
                </Card>

                {/* Upcoming Events */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                  <UpcomingEvents 
                    events={upcomingEvents} 
                    onEventClick={handleEventClick}
                  />
                </Card>
              </>
            )}
          </div>
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