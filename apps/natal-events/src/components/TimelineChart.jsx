import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { getEventColor, getEventMeaning, getMeaningDescription } from '../utils/eventVisuals';

const TimelineChart = ({ events, focusDate, onZoom, onNavigate }) => {
  // Prepare data for Gantt-style chart
  const chartData = useMemo(() => {
    if (!events || events.length === 0) {
      return { series: [], categories: [] };
    }

    // Group events by title (event type)
    const eventsByTitle = {};
    events.forEach(event => {
      const title = event.title || `${event.transitPlanet} ${event.aspect?.name || ''} ${event.natalPoint || ''}`;
      if (!eventsByTitle[title]) eventsByTitle[title] = [];
      eventsByTitle[title].push(event);
    });

    // Each data point: { x: title, y: [start, end], ... }
    const data = [];
    Object.entries(eventsByTitle).forEach(([title, evts]) => {
      evts.forEach(event => {
        const start = event.startDate ? new Date(event.startDate).getTime() : null;
        const end = event.endDate ? new Date(event.endDate).getTime() : null;
        if (!start || !end) return;
        
        // Add minimum duration for single-day events (1 day = 24 * 60 * 60 * 1000 ms)
        const minDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        const adjustedEnd = end === start ? start + minDuration : end;
        
        data.push({
          x: title,
          y: [start, adjustedEnd],
          fillColor: getEventColor(event.type, event.aspect?.name),
          event
        });
      });
    });

    return {
      series: [{ data }],
      categories: Object.keys(eventsByTitle)
    };
  }, [events]);

  const chartOptions = {
    chart: {
      type: 'rangeBar',
      height: 400,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        rangeBarGroupRows: true
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const d = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const event = d.event;
        const start = event.startDate ? new Date(event.startDate).toLocaleString() : '';
        const end = event.endDate ? new Date(event.endDate).toLocaleString() : '';
        const meaning = getEventMeaning(event.type);
        const meaningDesc = getMeaningDescription(meaning);
        return `
          <div class="p-2 bg-white rounded-md shadow-lg">
            <strong class="text-slate-800">${event.title}</strong>
            <p class="text-xs my-1 text-slate-600">${event.description || ''}</p>
            <p class="text-xs text-slate-500">Score: ${event.score?.toFixed(1) || 'N/A'}</p>
            <p class="text-xs text-slate-500">Start: ${start}</p>
            <p class="text-xs text-slate-500">End: ${end}</p>
            <p class="text-xs text-slate-500">${meaningDesc}</p>
          </div>
        `;
      }
    },
    colors: chartData.series[0]?.data.map(d => d.fillColor) || [],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    legend: { show: false }
  };

  const handleZoomIn = () => {
    const newFocusDate = new Date(focusDate);
    newFocusDate.setDate(newFocusDate.getDate() - 30);
    onZoom(newFocusDate);
  };

  const handleZoomOut = () => {
    const newFocusDate = new Date(focusDate);
    newFocusDate.setDate(newFocusDate.getDate() + 30);
    onZoom(newFocusDate);
  };

  const handleNavigate = (direction) => {
    const newFocusDate = new Date(focusDate);
    if (direction === 'prev') {
      newFocusDate.setDate(newFocusDate.getDate() - 30);
    } else {
      newFocusDate.setDate(newFocusDate.getDate() + 30);
    }
    onNavigate(newFocusDate);
  };

  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavigate('prev')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Previous 30 days"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleNavigate('next')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Next 30 days"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom in (shorter timeline)"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom out (longer timeline)"
          >
            <ZoomOut size={20} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {chartData.series[0]?.data.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type="rangeBar"
            height={400}
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <p>No events in this time period</p>
              <p className="text-sm">Try navigating to a different date range</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend with meanings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Event Meanings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Harmonious - Generally positive influence</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Challenging - May bring difficulties or tension</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm">Powerful - Strong influence, can be positive or negative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm">Significant - Important turning point</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineChart; 