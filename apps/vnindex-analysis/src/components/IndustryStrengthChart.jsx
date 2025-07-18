import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Calendar } from 'lucide-react';
import Card from './Card';
import { useDataLoader } from '../utils/dataLoader';

const IndustryStrengthChart = () => {
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const chartRef = useRef(null);

    // Load data using the data loader
    const { data: timeSeriesData, loading: dataLoading, error: dataError } = useDataLoader('industry_strength_time_series');

    const industries = useMemo(() => {
        if (!timeSeriesData?.industries) return [];
        return timeSeriesData.industries.map(item => item.industry);
    }, [timeSeriesData]);

    // Set default selected industry
    useEffect(() => {
        if (industries.length > 0 && !selectedIndustry) {
            setSelectedIndustry(industries[0]);
        }
    }, [industries, selectedIndustry]);

    // Prepare chart data when industry changes
    useEffect(() => {
        if (!selectedIndustry || !timeSeriesData?.industries) return;

        const industryData = timeSeriesData.industries.find(
            item => item.industry === selectedIndustry
        );

        if (!industryData) return;

        setLoading(true);

        // Prepare data for Highcharts
        const seriesData = industryData.data_points.map(point => ({
            x: new Date(point.date).getTime(),
            y: point.net_flow,
            strong_strength: point.smoothed_signals.strong_strength,
            medium_strength: point.smoothed_signals.medium_strength,
            early_strength: point.smoothed_signals.early_strength,
            strong_weakness: point.smoothed_signals.strong_weakness,
            medium_weakness: point.smoothed_signals.medium_weakness,
            early_weakness: point.smoothed_signals.early_weakness,
        }));

        setChartData(seriesData);
        setLoading(false);
    }, [selectedIndustry]);

    // Initialize chart when data is ready
    useEffect(() => {
        if (!chartData || !chartRef.current) return;

        // Load Highcharts if not already loaded
        if (typeof Highcharts === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://code.highcharts.com/11.1/highcharts.js';
            script.onload = () => renderChart();
            document.head.appendChild(script);
        } else {
            renderChart();
        }
    }, [chartData]);

    const renderChart = () => {
        if (!chartData || !chartRef.current) return;

        const config = {
            chart: {
                type: 'line',
                height: 400,
                style: { fontSize: '14px' },
            },
            title: {
                text: `Sức mạnh ngành: ${selectedIndustry}`,
                align: 'center',
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function () {
                        return Highcharts.dateFormat('%d/%m/%Y', this.value);
                    },
                },
            },
            yAxis: {
                title: {
                    text: 'Net Flow',
                },
                plotLines: [{
                    value: 0,
                    color: '#666',
                    dashStyle: 'shortdash',
                    width: 1,
                    label: {
                        text: 'Neutral'
                    }
                }]
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    const point = this.points[0];
                    const data = point.point;
                    
                    return `
                        <div style="font-size: 12px;">
                            <strong>${Highcharts.dateFormat('%d/%m/%Y', point.x)}</strong><br/>
                            <strong>Net Flow:</strong> ${data.y.toFixed(3)}<br/>
                            <strong>Strong Strength:</strong> ${data.strong_strength.toFixed(3)}<br/>
                            <strong>Medium Strength:</strong> ${data.medium_strength.toFixed(3)}<br/>
                            <strong>Early Strength:</strong> ${data.early_strength.toFixed(3)}<br/>
                            <strong>Strong Weakness:</strong> ${data.strong_weakness.toFixed(3)}<br/>
                            <strong>Medium Weakness:</strong> ${data.medium_weakness.toFixed(3)}<br/>
                            <strong>Early Weakness:</strong> ${data.early_weakness.toFixed(3)}
                        </div>
                    `;
                }
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    name: 'Net Flow',
                    data: chartData.map(point => [point.x, point.y]),
                    color: '#3b82f6',
                    lineWidth: 3,
                    zIndex: 1
                },
                {
                    name: 'Strong Strength',
                    data: chartData.map(point => [point.x, point.strong_strength]),
                    color: '#10b981',
                    lineWidth: 2,
                    visible: false
                },
                {
                    name: 'Medium Strength',
                    data: chartData.map(point => [point.x, point.medium_strength]),
                    color: '#059669',
                    lineWidth: 2,
                    visible: false
                },
                {
                    name: 'Early Strength',
                    data: chartData.map(point => [point.x, point.early_strength]),
                    color: '#047857',
                    lineWidth: 2,
                    visible: false
                },
                {
                    name: 'Strong Weakness',
                    data: chartData.map(point => [point.x, point.strong_weakness]),
                    color: '#ef4444',
                    lineWidth: 2,
                    visible: false
                },
                {
                    name: 'Medium Weakness',
                    data: chartData.map(point => [point.x, point.medium_weakness]),
                    color: '#dc2626',
                    lineWidth: 2,
                    visible: false
                },
                {
                    name: 'Early Weakness',
                    data: chartData.map(point => [point.x, point.early_weakness]),
                    color: '#b91c1c',
                    lineWidth: 2,
                    visible: false
                }
            ],
            credits: {
                enabled: false
            }
        };

        Highcharts.chart(chartRef.current, config);
    };

    if (!timeSeriesData) {
        return (
            <Card>
                <div className="text-center py-8">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Không thể tải dữ liệu sức mạnh ngành
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Vui lòng kiểm tra lại file dữ liệu
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Biểu đồ sức mạnh ngành
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {timeSeriesData.metadata?.date_range?.start && 
                             timeSeriesData.metadata?.date_range?.end && 
                             `${new Date(timeSeriesData.metadata.date_range.start).toLocaleDateString('vi-VN')} - ${new Date(timeSeriesData.metadata.date_range.end).toLocaleDateString('vi-VN')}`
                            }
                        </span>
                    </div>
                </div>

                {/* Industry Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chọn ngành:
                    </label>
                    <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                        {industries.map((industry) => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chart Container */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    <div ref={chartRef} className="w-full h-96"></div>
                </div>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Net Flow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Strong Strength</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                        <span>Medium Strength</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-700 rounded"></div>
                        <span>Early Strength</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Strong Weakness</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded"></div>
                        <span>Medium Weakness</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-700 rounded"></div>
                        <span>Early Weakness</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Giải thích:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• <strong>Net Flow:</strong> Chỉ số tổng hợp sức mạnh/điểm yếu của ngành</li>
                        <li>• <strong>Strong Strength/Weakness:</strong> Tín hiệu mạnh về sức mạnh/điểm yếu</li>
                        <li>• <strong>Medium Strength/Weakness:</strong> Tín hiệu trung bình về sức mạnh/điểm yếu</li>
                        <li>• <strong>Early Strength/Weakness:</strong> Tín hiệu sớm về sức mạnh/điểm yếu</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default IndustryStrengthChart; 