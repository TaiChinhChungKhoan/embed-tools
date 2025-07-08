import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Minus, RefreshCw, AlertCircle, Info, HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';
import { useDataLoader } from '../hooks/useDataLoader';
import { createChart, LineSeries } from 'lightweight-charts';

const MarketBreadth = ({ turnover, volume }) => {
    const [chartInitialized, setChartInitialized] = useState(false);
    const [containerEl, setContainerEl] = useState(null);
    const [showChart, setShowChart] = useState(true);

    const chartRef = useRef(null);
    const seriesRef = useRef([]);

    const { data, loading, error, lastUpdated, refresh } = useDataLoader('market_breadth_4', {
        refreshInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    });

    // Initialize chart
    useEffect(() => {
        if (!containerEl || !showChart) return;
        let ro;

        function tryInitChart() {
            if (containerEl.clientWidth > 0 && !chartRef.current) {
                // Add a small delay to ensure container is fully ready
                setTimeout(() => {
                    if (containerEl.clientWidth > 0 && !chartRef.current) {
                        try {
                            // Light theme options
                            const chart = createChart(containerEl, {
                                width: containerEl.clientWidth,
                                height: containerEl.clientHeight,
                                layout: { background: { color: '#fff' }, textColor: '#222' },
                                grid: { vertLines: { color: '#e5e7eb' }, horzLines: { color: '#e5e7eb' } },
                                crosshair: { mode: 1 },
                                rightPriceScale: { borderColor: '#d1d5db' },
                                timeScale: { borderColor: '#d1d5db', timeVisible: true, secondsVisible: false },
                            });
                            chartRef.current = chart;
                            setChartInitialized(true);
                        } catch (error) {
                            console.error('Error creating chart:', error);
                            setChartInitialized(false);
                        }
                    }
                }, 50); // Small delay to ensure DOM is ready
            }
        }

        ro = new window.ResizeObserver(() => {
            tryInitChart();
        });
        ro.observe(containerEl);
        // Try immediately in case it's already sized
        tryInitChart();

        return () => {
            if (ro) ro.disconnect();
            if (chartRef.current) {
                try {
                    chartRef.current.remove();
                } catch (error) {
                    console.error('Error removing chart:', error);
                }
                chartRef.current = null;
                setChartInitialized(false);
            }
        };
    }, [containerEl, showChart]);

    // Draw series when ready
    useEffect(() => {
        if (!chartInitialized || !data || !showChart) {
            return;
        }
        const chart = chartRef.current;

        // Add null check for chart
        if (!chart) {
            console.warn('Chart is not initialized yet, skipping series drawing');
            return;
        }

        // clear previous
        if (chart) {
            try {
                seriesRef.current.forEach(s => {
                    if (s && typeof s.remove === 'function') {
                        chart.removeSeries(s);
                    }
                });
                seriesRef.current = [];
            } catch (error) {
                console.error('Error clearing previous series:', error);
                seriesRef.current = [];
            }
        }

        // --- Up/Down Smoothed Counts (pane 0) ---
        if (data.daily_data && data.daily_data.length > 0) {
            const upSmoothedData = data.daily_data.map(d => ({
                time: d.date.slice(0, 10),
                value: d.up_smoothed
            })).filter(d => d.value != null && !isNaN(d.value));

            const downSmoothedData = data.daily_data.map(d => ({
                time: d.date.slice(0, 10),
                value: d.down_smoothed
            })).filter(d => d.value != null && !isNaN(d.value));

            const unchangedData = data.daily_data.map(d => ({
                time: d.date.slice(0, 10),
                value: d.unchanged_count // still use raw for unchanged
            })).filter(d => d.value != null && !isNaN(d.value));

            if (upSmoothedData.length) {
                try {
                    const upSeries = chart.addSeries(LineSeries, { 
                        color: '#10b981', 
                        lineWidth: 2,
                        title: 'Tăng (mượt hóa)'
                    }, 0);
                    upSeries.setData(upSmoothedData);
                    seriesRef.current.push(upSeries);
                } catch (error) {
                    console.error('Error adding up series:', error);
                }
            }

            if (downSmoothedData.length) {
                try {
                    const downSeries = chart.addSeries(LineSeries, { 
                        color: '#ef4444', 
                        lineWidth: 2,
                        title: 'Giảm (mượt hóa)'
                    }, 0);
                    downSeries.setData(downSmoothedData);
                    seriesRef.current.push(downSeries);
                } catch (error) {
                    console.error('Error adding down series:', error);
                }
            }

            if (unchangedData.length) {
                try {
                    const unchangedSeries = chart.addSeries(LineSeries, { 
                        color: '#6b7280', 
                        lineWidth: 1,
                        lineStyle: 1, // Dashed line
                        title: 'Đứng'
                    }, 0);
                    unchangedSeries.setData(unchangedData);
                    seriesRef.current.push(unchangedSeries);
                } catch (error) {
                    console.error('Error adding unchanged series:', error);
                }
            }
        }

        // --- Smoothed Ratio (pane 1) ---
        if (data.daily_data && data.daily_data.length > 0) {
            const smoothedRatioData = data.daily_data.map(d => ({
                time: d.date.slice(0, 10),
                value: d.smoothed_ratio * 100 // Convert to percentage
            })).filter(d => d.value != null && !isNaN(d.value));

            if (smoothedRatioData.length) {
                try {
                    const ratioSeries = chart.addSeries(LineSeries, { 
                        color: '#3b82f6', 
                        lineWidth: 3,
                        title: 'Tỷ lệ Tăng/Giảm (mượt hóa) (%)'
                    }, 1);
                    ratioSeries.setData(smoothedRatioData);
                    seriesRef.current.push(ratioSeries);
                } catch (error) {
                    console.error('Error adding ratio series:', error);
                }
            }
        }

        try {
            chart.timeScale().fitContent();

            const panes = chart.panes();
            if (panes[0]) panes[0].setHeight(300); // Counts
            if (panes[1]) panes[1].setHeight(150); // Ratio
        } catch (error) {
            console.error('Error configuring chart:', error);
        }
    }, [data, chartInitialized, showChart]);

    // Calculate current statistics
    const getCurrentStats = () => {
        if (!data?.daily_data?.length) return null;
        
        const latest = data.daily_data[data.daily_data.length - 1];
        const prev = data.daily_data[data.daily_data.length - 2];
        
        return {
            current: latest,
            upChange: prev ? latest.up_count - prev.up_count : 0,
            downChange: prev ? latest.down_count - prev.down_count : 0,
            ratioChange: prev ? (latest.ratio - prev.ratio) * 100 : 0
        };
    };

    // Get summary statistics
    const getSummaryStats = () => {
        if (!data?.summary) return null;
        
        const { averages, extremes, most_bullish_day, most_bearish_day } = data.summary;
        
        return {
            averages,
            extremes,
            most_bullish_day,
            most_bearish_day
        };
    };

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="text-center py-6">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                        Lỗi tải dữ liệu
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {error}
                    </p>
                    <button
                        onClick={refresh}
                        className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Thử lại
                    </button>
                </div>
            </Card>
        );
    }

    if (!data?.daily_data?.length) {
        return (
            <Card>
                <div className="text-center py-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Không có dữ liệu độ rộng thị trường
                    </p>
                </div>
            </Card>
        );
    }

    // Get the latest data
    const latestData = data.daily_data[data.daily_data.length - 1];
    const { up_count, down_count, unchanged_count, total_count, ratio } = latestData;
    const stats = getCurrentStats();
    const summaryStats = getSummaryStats();

    const upPercent = (up_count / total_count) * 100;
    const downPercent = (down_count / total_count) * 100;
    const unchangedPercent = (unchanged_count / total_count) * 100;

    // Determine market sentiment based on ratio
    const getSentiment = (ratio) => {
        if (ratio > 0.6) return { sentiment: 'bullish', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
        if (ratio < 0.4) return { sentiment: 'bearish', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' };
        return { sentiment: 'neutral', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' };
    };

    const sentiment = getSentiment(ratio);

    return (
        <Card>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">Độ rộng thị trường</h3>
                <div className="flex items-center space-x-2">
                    {lastUpdated && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                    <button
                        onClick={refresh}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                        title="Làm mới dữ liệu"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Market Sentiment Indicator */}
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${sentiment.bg} ${sentiment.color}`}>
                {sentiment.sentiment === 'bullish' && <ArrowUp className="w-3 h-3 mr-1" />}
                {sentiment.sentiment === 'bearish' && <ArrowDown className="w-3 h-3 mr-1" />}
                {sentiment.sentiment === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
                {sentiment.sentiment === 'bullish' ? 'Tích cực' : 
                 sentiment.sentiment === 'bearish' ? 'Tiêu cực' : 'Trung tính'}
                <span className="ml-1">({(ratio * 100).toFixed(1)}%)</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex h-2 rounded-full overflow-hidden mb-3">
                <div style={{ width: `${upPercent}%` }} className="bg-green-500"></div>
                <div style={{ width: `${downPercent}%` }} className="bg-red-500"></div>
                <div style={{ width: `${unchangedPercent}%` }} className="bg-gray-400 dark:bg-gray-500"></div>
            </div>

            {/* Counts */}
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 flex-wrap gap-2 mb-3">
                <div className="flex items-center">
                    <ArrowUp size={14} className="text-green-500 mr-1"/>
                    Tăng: <span className="text-gray-800 dark:text-gray-200 font-semibold ml-1">{up_count}</span>
                </div>
                <div className="flex items-center">
                    <Minus size={14} className="text-gray-400 mr-1"/>
                    Đứng: <span className="text-gray-800 dark:text-gray-200 font-semibold ml-1">{unchanged_count}</span>
                </div>
                <div className="flex items-center">
                    <ArrowDown size={14} className="text-red-500 mr-1"/>
                    Giảm: <span className="text-gray-800 dark:text-gray-200 font-semibold ml-1">{down_count}</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left: Chart and main stats */}
                <div className="flex-1 min-w-0">
                    {showChart && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {/* Current Statistics Cards */}
                            {stats && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                            <h5 className="text-xs font-medium text-green-700 dark:text-green-300">Tăng</h5>
                                        </div>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.current.up_count}</p>
                                        {stats.upChange !== 0 && (
                                            <p className={`text-xs ${stats.upChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stats.upChange > 0 ? '+' : ''}{stats.upChange}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                            <h5 className="text-xs font-medium text-red-700 dark:text-red-300">Giảm</h5>
                                        </div>
                                        <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.current.down_count}</p>
                                        {stats.downChange !== 0 && (
                                            <p className={`text-xs ${stats.downChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stats.downChange > 0 ? '+' : ''}{stats.downChange}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Minus className="w-4 h-4 text-gray-500 mr-1" />
                                            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Đứng</h5>
                                        </div>
                                        <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{stats.current.unchanged_count}</p>
                                    </div>

                                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Info className="w-4 h-4 text-blue-500 mr-1" />
                                            <h5 className="text-xs font-medium text-blue-700 dark:text-blue-300">Tỷ lệ</h5>
                                        </div>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(stats.current.ratio * 100).toFixed(1)}%</p>
                                        {stats.ratioChange !== 0 && (
                                            <p className={`text-xs ${stats.ratioChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stats.ratioChange > 0 ? '+' : ''}{stats.ratioChange.toFixed(1)}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Chart */}
                            <div className="relative">
                                <div
                                    ref={setContainerEl}
                                    className="border rounded"
                                    style={{ width: '100%', background: '#fff', minHeight: '450px' }}
                                />
                                {!chartInitialized && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
                                        <div className="animate-spin h-6 w-6 border-b-2 border-blue-500 rounded-full" />
                                        <p className="mt-2 text-sm text-gray-500">Đang tải biểu đồ...</p>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-4 mt-3 text-xs">
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full" />
                                    Tăng
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full" />
                                    Giảm
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-gray-500 rounded-full" />
                                    Đứng
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full" />
                                    Tỷ lệ (%)
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {/* Right: Wider, with 2-column grid for cards */}
                <div className="lg:w-[600px] flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Liquidity Metrics */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <h5 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Thanh khoản thị trường</h5>
                            <div className="flex flex-col gap-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Giá trị:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{turnover}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Khối lượng:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{volume}</span>
                                </div>
                            </div>
                        </div>
                        {/* Data Coverage Information */}
                        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3">
                            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Thông tin dữ liệu</h5>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tổng ngày:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{data.metadata.total_trading_days}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Từ:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(data.metadata.date_range.start).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Đến:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(data.metadata.date_range.end).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Cập nhật:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(data.metadata.analysis_date).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                        {/* Summary Statistics (Thống kê tổng quan) */}
                        {summaryStats && (
                            <>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Trung bình lịch sử</h5>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tăng:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.averages.up_count.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Giảm:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.averages.down_count.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Đứng:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.averages.unchanged_count.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{(summaryStats.averages.ratio * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-2">Cực trị lịch sử</h5>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tăng cao nhất:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.extremes.max_up_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Giảm cao nhất:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.extremes.max_down_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ cao nhất:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{(summaryStats.extremes.max_ratio * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ thấp nhất:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{(summaryStats.extremes.min_ratio * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">Ngày tích cực nhất</h5>
                                    <div className="space-y-1 text-xs">
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {new Date(summaryStats.most_bullish_day.date).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tăng:</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">{summaryStats.most_bullish_day.up_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Giảm:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.most_bullish_day.down_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ:</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">{(summaryStats.most_bullish_day.ratio * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">Ngày tiêu cực nhất</h5>
                                    <div className="space-y-1 text-xs">
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {new Date(summaryStats.most_bearish_day.date).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tăng:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{summaryStats.most_bearish_day.up_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Giảm:</span>
                                            <span className="font-semibold text-red-600 dark:text-red-400">{summaryStats.most_bearish_day.down_count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ:</span>
                                            <span className="font-semibold text-red-600 dark:text-red-400">{(summaryStats.most_bearish_day.ratio * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Current vs Historical Comparison */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-2">So sánh hiện tại</h5>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tăng vs TB:</span>
                                            <span className={`font-semibold ${up_count > summaryStats.averages.up_count ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {up_count > summaryStats.averages.up_count ? '+' : ''}{(up_count - summaryStats.averages.up_count).toFixed(0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Giảm vs TB:</span>
                                            <span className={`font-semibold ${down_count < summaryStats.averages.down_count ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {down_count < summaryStats.averages.down_count ? '-' : '+'}{(down_count - summaryStats.averages.down_count).toFixed(0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ vs TB:</span>
                                            <span className={`font-semibold ${ratio > summaryStats.averages.ratio ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {ratio > summaryStats.averages.ratio ? '+' : ''}{((ratio - summaryStats.averages.ratio) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Market Breadth Percentile */}
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-2">Phân vị thị trường</h5>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ hiện tại:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{(ratio * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">So với lịch sử:</span>
                                            <span className={`font-semibold ${ratio > 0.6 ? 'text-green-600 dark:text-green-400' : ratio < 0.4 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {ratio > 0.6 ? 'Cao' : ratio < 0.4 ? 'Thấp' : 'Trung bình'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Khoảng:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                {(summaryStats.extremes.min_ratio * 100).toFixed(1)}% - {(summaryStats.extremes.max_ratio * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MarketBreadth; 