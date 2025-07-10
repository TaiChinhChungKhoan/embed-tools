import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import Card from './Card';
import dataLoader from '../utils/dataLoader';

const VNINDEXEWChart = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDataAndCreateChart = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load VNINDEX_EW data
                const rawData = await dataLoader.loadTicker('VNINDEX_EW');

                // Transform data for TradingView chart
                const chartData = rawData.map(item => ({
                    time: new Date(item.Time).getTime() / 1000, // Convert to Unix timestamp
                    open: item.Open,
                    high: item.High,
                    low: item.Low,
                    close: item.Close,
                    volume: item.Volume
                }));

                // Create chart
                if (chartContainerRef.current) {
                    const chart = createChart(chartContainerRef.current, {
                        width: chartContainerRef.current.clientWidth,
                        height: 500,
                        layout: {
                            background: { color: '#ffffff' },
                            textColor: '#333333',
                        },
                        grid: {
                            vertLines: { color: '#f0f0f0' },
                            horzLines: { color: '#f0f0f0' },
                        },
                        crosshair: {
                            mode: 1,
                        },
                        rightPriceScale: {
                            borderColor: '#cccccc',
                        },
                        timeScale: {
                            borderColor: '#cccccc',
                            timeVisible: true,
                            secondsVisible: false,
                        },
                    });

                    // Create candlestick series
                    const candlestickSeries = chart.addCandlestickSeries({
                        upColor: '#26a69a',
                        downColor: '#ef5350',
                        borderDownColor: '#ef5350',
                        borderUpColor: '#26a69a',
                        wickDownColor: '#ef5350',
                        wickUpColor: '#26a69a',
                    });

                    // Create volume series
                    const volumeSeries = chart.addHistogramSeries({
                        color: '#26a69a',
                        priceFormat: {
                            type: 'volume',
                        },
                        priceScaleId: '', // Set to overlay
                        scaleMargins: {
                            top: 0.8,
                            bottom: 0,
                        },
                    });

                    // Set data
                    candlestickSeries.setData(chartData);
                    volumeSeries.setData(chartData.map(item => ({
                        time: item.time,
                        value: item.volume,
                        color: item.close >= item.open ? '#26a69a' : '#ef5350',
                    })));

                    // Handle resize
                    const handleResize = () => {
                        if (chartContainerRef.current) {
                            chart.applyOptions({
                                width: chartContainerRef.current.clientWidth,
                            });
                        }
                    };

                    window.addEventListener('resize', handleResize);
                    chartRef.current = chart;

                    // Cleanup function
                    return () => {
                        window.removeEventListener('resize', handleResize);
                        chart.remove();
                    };
                }
            } catch (err) {
                console.error('Error loading VNINDEX_EW data:', err);
                setError('Không thể tải dữ liệu VNINDEX_EW');
            } finally {
                setIsLoading(false);
            }
        };

        loadDataAndCreateChart();
    }, []);

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
                            VNINDEX Equal Weight
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Biểu đồ giá và khối lượng giao dịch
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

export default VNINDEXEWChart; 