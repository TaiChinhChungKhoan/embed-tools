import React, { useEffect, useRef, useState } from 'react';
import { createChart, BarSeries, HistogramSeries } from 'lightweight-charts';
import Card from './Card';
import dataLoader from '../utils/dataLoader';

// Available index sources
const INDEX_SOURCES = [
    { value: 'VNINDEX', label: 'VNINDEX' },
    { value: 'VNINDEX_EW', label: 'VNINDEX Equal Weight' },
    { value: 'VN30', label: 'VN30' },
    { value: 'VN100', label: 'VN100' },
    { value: 'VNAllShare', label: 'VN All Share' },
    { value: 'VNMidCap', label: 'VN Mid Cap' },
    { value: 'VNSmallCap', label: 'VN Small Cap' },
];

const IndexChart = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSource, setSelectedSource] = useState('VNINDEX_EW');
    const [data, setData] = useState(null);
    const [chartInitialized, setChartInitialized] = useState(false);

    const loadDataAndCreateChart = async (source) => {
        try {
            setIsLoading(true);
            setError(null);

            // Load data for selected source
            const rawData = await dataLoader.loadTicker(source);
            setData(rawData);
        } catch (err) {
            console.error(`Error loading ${source} data:`, err);
            setError(`Không thể tải dữ liệu ${source}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;
        let ro;

        function tryInitChart() {
            if (chartContainerRef.current.clientWidth > 0 && !chartRef.current) {
                // Add a small delay to ensure container is fully ready
                setTimeout(() => {
                    if (chartContainerRef.current.clientWidth > 0 && !chartRef.current) {
                        try {
                            const chart = createChart(chartContainerRef.current, {
                                width: chartContainerRef.current.clientWidth,
                                height: 500,
                                layout: { background: { color: '#fff' }, textColor: '#222' },
                                grid: { vertLines: { color: '#e5e7eb' }, horzLines: { color: '#e5e7eb' } },
                                crosshair: { mode: 1 },
                                rightPriceScale: { borderColor: '#d1d5db' },
                                timeScale: { borderColor: '#d1d5db', timeVisible: true, secondsVisible: false },
                                overlayPriceScales: {
                                    borderColor: '#d1d5db',
                                },
                            });
                            chartRef.current = chart;
                            setChartInitialized(true);
                        } catch (error) {
                            console.error('Error creating chart:', error);
                            setChartInitialized(false);
                        }
                    }
                }, 50);
            }
        }

        ro = new window.ResizeObserver(() => {
            tryInitChart();
        });
        ro.observe(chartContainerRef.current);
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
    }, [selectedSource]); // Recreate chart when source changes

    // Draw series when ready
    useEffect(() => {
        if (!chartInitialized || !data) {
            return;
        }
        const chart = chartRef.current;

        if (!chart) {
            console.warn('Chart is not initialized yet, skipping series drawing');
            return;
        }

        // Clear series ref since we're recreating the chart
        seriesRef.current = [];

        // Transform data for TradingView chart
        const priceData = data.map(item => {
            const time = new Date(item.Time).toISOString().slice(0, 10);

            const o = Number(item.Open);
            const h = Number(item.High);
            const l = Number(item.Low);
            const c = Number(item.Close);
            
            if ([o, h, l, c].some(v => v == null || isNaN(v))) return null;
            
            return {
                time: time,
                open: o,
                high: h,
                low: l,
                close: c,
            };
        }).filter(Boolean);

        // Price series (pane 0)
        if (priceData.length) {
            try {
                const priceSeries = chart.addSeries(BarSeries, { 
                    upColor: '#26a69a', 
                    downColor: '#ef5350' 
                }, 0);
                priceSeries.setData(priceData);
                seriesRef.current.push(priceSeries);
            } catch (error) {
                console.error('Error adding price series:', error);
            }
        }

        // Volume series (pane 1)
        const volData = data.map(item => {
            const time = new Date(item.Time).toISOString().slice(0, 10);

            const v = Number(item.Volume);
            if (v == null || isNaN(v)) return null;
            return { time: time, value: v };
        }).filter(Boolean);
        
        if (volData.length) {
            try {
                const volumeSeries = chart.addSeries(HistogramSeries, {
                    color: '#c792ea',
                    priceFormat: { type: 'volume' },
                    scaleMargins: { top: 0.8, bottom: 0 },
                }, 1);
                volumeSeries.setData(volData);
                seriesRef.current.push(volumeSeries);
            } catch (error) {
                console.error('Error adding volume series:', error);
            }
        }

        try {
            chart.timeScale().fitContent();

            const panes = chart.panes();
            if (panes[0]) panes[0].setHeight(400); // Price
            if (panes[1]) panes[1].setHeight(150); // Volume
        } catch (error) {
            console.error('Error configuring chart:', error);
        }
    }, [data, chartInitialized]);

    useEffect(() => {
        loadDataAndCreateChart(selectedSource);
    }, [selectedSource]);

    const handleSourceChange = (event) => {
        setSelectedSource(event.target.value);
    };

    const getSelectedSourceLabel = () => {
        const source = INDEX_SOURCES.find(s => s.value === selectedSource);
        return source ? source.label : selectedSource;
    };

    if (error) {
        return (
            <Card>
                <div className="p-6 text-center">
                    <div className="text-red-500 mb-2">⚠️</div>
                    <h3 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {getSelectedSourceLabel()}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Biểu đồ giá và khối lượng giao dịch
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="source-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Chọn chỉ số:
                            </label>
                            <select
                                id="source-select"
                                value={selectedSource}
                                onChange={handleSourceChange}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={isLoading}
                            >
                                {INDEX_SOURCES.map((source) => (
                                    <option key={source.value} value={source.value}>
                                        {source.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {isLoading && (
                            <div className="flex items-center text-blue-500">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                <span className="text-sm">Đang tải...</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div 
                    ref={chartContainerRef} 
                    className="w-full h-[500px]"
                    style={{ minHeight: '500px' }}
                >
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p className="text-gray-600">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default IndexChart; 