import React, { useEffect, useRef, useState } from 'react';
import { createChart, BarSeries, HistogramSeries } from 'lightweight-charts';
import Card from './Card';
import dataLoader from '../utils/dataLoader';

const TickerChart = ({ ticker, title, description }) => {
    const [chartInitialized, setChartInitialized] = useState(false);
    const [containerEl, setContainerEl] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const chartRef = useRef(null);
    const seriesRef = useRef([]);

    // Load data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const rawData = await dataLoader.loadTicker(ticker);
                setData(rawData);
            } catch (err) {
                console.error(`Error loading ${ticker} data:`, err);
                setError(`Không thể tải dữ liệu ${ticker}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [ticker]);

    // Initialize chart
    useEffect(() => {
        if (!containerEl) return;
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
                                // Ensure proper pane separation
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
    }, [containerEl]);

    // Draw series when ready
    useEffect(() => {
        if (!chartInitialized || !data) {
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

        // Transform data for TradingView chart - using Unix timestamps as per BarSeries docs
        const priceData = data.map(item => {
            const time = new Date(item.Time).toISOString().slice(0, 10);

            const o = Number(item.Open);
            const h = Number(item.High);
            const l = Number(item.Low);
            const c = Number(item.Close);
            
            // Same validation as MarketWave
            if ([o, h, l, c].some(v => v == null || isNaN(v))) return null;
            
            return {
                time: time,
                open: o,
                high: h,
                low: l,
                close: c,
            };
        }).filter(Boolean);

        // --- Price series (pane 0) ---
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

        // --- Volume series (pane 1) ---
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
                }, 1);  // Pane 1, no priceScaleId override
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
                            {title || ticker}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {description || 'Biểu đồ giá và khối lượng giao dịch'}
                        </p>
                    </div>
                    {isLoading && (
                        <div className="flex items-center text-blue-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                            <span className="text-sm">Đang tải...</span>
                        </div>
                    )}
                </div>
                
                <div 
                    ref={setContainerEl} 
                    className="w-full h-[550px]"
                    style={{ minHeight: '550px' }}
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

export default TickerChart; 