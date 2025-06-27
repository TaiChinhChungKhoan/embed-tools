import React, { useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getEventVisuals } from '../utils/astroCalculator';

const TimelineChart = ({ events, focusDate, onZoom }) => {
  const chartRef = useRef(null);

  // Prepare data
  const seriesData = {};
  const eventColors = {};
  events.forEach(event => {
    const visuals = getEventVisuals(event.type);
    if (!seriesData[event.type]) {
      seriesData[event.type] = [];
      eventColors[event.type] = visuals.color;
    }
    seriesData[event.type].push({
      x: event.title,
      y: [new Date(event.startDate).getTime(), new Date(event.endDate).getTime()],
      description: event.description
    });
  });
  const series = Object.keys(seriesData).map(type => ({
    name: type,
    data: seriesData[type]
  }));
  const colors = Object.values(eventColors);

  const options = {
    chart: {
      height: 350,
      type: 'rangeBar',
      background: 'transparent',
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      events: {
        zoomed: (chartContext, { xaxis }) => {
          const newCenterTimestamp = (xaxis.min + xaxis.max) / 2;
          onZoom(new Date(newCenterTimestamp));
        }
      }
    },
    plotOptions: { bar: { horizontal: true, barHeight: '50%', rangeBarGroupRows: true } },
    colors: colors,
    fill: { type: 'solid', opacity: 0.6 },
    xaxis: { type: 'datetime', labels: { style: { colors: '#94a3b8' } }, axisBorder: { show: false }, axisTicks: { color: '#475569' } },
    yaxis: { labels: { style: { colors: '#e2e8f0' } } },
    legend: { show: false },
    grid: { borderColor: '#1e293b' },
    tooltip: {
      theme: 'dark',
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const start = new Date(data.y[0]).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const end = new Date(data.y[1]).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        return `<div class="p-2"><strong>${data.x}</strong><p class="text-xs my-1">${data.description}</p><p class="text-xs text-slate-400">Bắt đầu: ${start}</p><p class="text-xs text-slate-400">Kết thúc: ${end}</p></div>`;
      }
    }
  };

  return (
    <div className="mb-8">
      <ReactApexChart ref={chartRef} options={options} series={series} type="rangeBar" height={350} />
    </div>
  );
};

export default TimelineChart; 