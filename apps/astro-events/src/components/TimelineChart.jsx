import React, { useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getEventVisuals } from '../utils/astroEventsReal'; // Import the utility function

const TimelineChart = ({ events, onZoom }) => {
    const chartRef = useRef(null);

    // Chuẩn bị dữ liệu cho biểu đồ
    const seriesData = {};
    const eventColors = {};
    events.forEach(event => {
        // Use the imported getEventVisuals function
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
        name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        data: seriesData[type]
    }));

    const colors = Object.values(eventColors);

    // FIX: Cập nhật các tùy chọn màu sắc cho giao diện sáng
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
        plotOptions: {
            bar: {
                horizontal: true, barHeight: '50%', rangeBarGroupRows: true, colors: {
                    backgroundBarColors: ['#e2e8f0'],
                    backgroundBarOpacity: 1,
                    backgroundBarRadius: 4
                }
            }
        },
        colors: colors,
        fill: { type: 'solid', opacity: 0.9 },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#475569'
                }
            },
            axisBorder: { show: false },
            axisTicks: { color: '#475569' }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#1e293b',
                    fontWeight: 600
                }
            }
        },
        legend: { show: false },
        grid: {
            borderColor: '#e2e8f0' // Màu lưới nhạt
        },
        tooltip: {
            theme: 'light', // Chuyển tooltip sang theme sáng
            custom: function ( { series, seriesIndex, dataPointIndex, w }) {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                const start = new Date(data.y[0]).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                const end = new Date(data.y[1]).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                // Sử dụng class của Tailwind nếu có, nếu không thì dùng inline style
                return `<div class="p-2 bg-white rounded-md shadow-lg">
                            <strong class="text-slate-800">${data.x}</strong>
                            <p class="text-xs my-1 text-slate-600">${data.description}</p>
                            <p class="text-xs text-slate-500">Bắt đầu: ${start}</p>
                            <p class="text-xs text-slate-500">Kết thúc: ${end}</p>
                        </div>`;
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
