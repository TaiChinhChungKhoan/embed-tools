import React, { useEffect, useRef, useState } from 'react';
import { createChart, BarSeries, HistogramSeries } from 'lightweight-charts';
import { HelpCircle } from 'lucide-react';
import Card from './Card';
import dataLoader from '../utils/dataLoader';

// Available index sources
const INDEX_SOURCES = [
    { 
        value: 'VNINDEX', 
        label: 'VNINDEX',
        description: 'Chỉ số tổng hợp của thị trường chứng khoán Việt Nam, phản ánh xu hướng chung của toàn bộ thị trường.'
    },
    { 
        value: 'VNINDEX_EW', 
        label: 'VNINDEX Equal Weight',
        description: 'VNINDEX_EW là một chỉ số riêng của TCCK, được tính bằng cách tính trung bình giá và khối lượng của các cổ phiếu có lượng giao dịch trung bình trên 50000 đơn vị 1 ngày trong 20 ngày. Chỉ số này giúp loại bỏ sự ảnh hưởng của các cổ phiếu trụ có vốn hóa lớn làm méo mó thị trường.'
    },
    { 
        value: 'VN30', 
        label: 'VN30',
        description: 'Chỉ số của 30 cổ phiếu có vốn hóa thị trường lớn nhất và thanh khoản tốt nhất trên HOSE.'
    },
    { 
        value: 'VN100', 
        label: 'VN100',
        description: 'Chỉ số của 100 cổ phiếu có vốn hóa thị trường lớn nhất và thanh khoản tốt trên HOSE.'
    },
    { 
        value: 'VNALL', 
        label: 'VN All Share',
        description: 'Chỉ số tổng hợp của tất cả cổ phiếu niêm yết trên HOSE và HNX.'
    },
    { 
        value: 'VNMID', 
        label: 'VN Mid Cap',
        description: 'Chỉ số của các cổ phiếu có vốn hóa thị trường trung bình trên thị trường chứng khoán Việt Nam.'
    },
    { 
        value: 'VNSML', 
        label: 'VN Small Cap',
        description: 'Chỉ số của các cổ phiếu có vốn hóa thị trường nhỏ trên thị trường chứng khoán Việt Nam.'
    },
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
    const [showHelp, setShowHelp] = useState(false);

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

    const getSelectedSourceDescription = () => {
        const source = INDEX_SOURCES.find(s => s.value === selectedSource);
        return source ? source.description : '';
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
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {getSelectedSourceLabel()}
                                </h3>
                                <button 
                                    onClick={() => setShowHelp(!showHelp)} 
                                    className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    title="Hướng dẫn đọc biểu đồ"
                                >
                                    <HelpCircle className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Biểu đồ giá và khối lượng giao dịch
                            </p>
                        </div>
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

                {/* Help Section */}
                {showHelp && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                            <p className="font-medium">
                                Biểu đồ này hiển thị giá và khối lượng giao dịch của các chỉ số thị trường chứng khoán Việt Nam.
                            </p>
                            
                            <div>
                                <h4 className="font-semibold mb-2">Ý nghĩa các chỉ số</h4>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <strong>VNINDEX:</strong> Chỉ số tổng hợp của thị trường chứng khoán Việt Nam, phản ánh xu hướng chung của toàn bộ thị trường.
                                    </div>
                                    <div>
                                        <strong>VNINDEX_EW:</strong> VNINDEX_EW là một chỉ số riêng của TCCK, được tính bằng cách tính trung bình giá và khối lượng của các cổ phiếu có lượng giao dịch trung bình trên 50000 đơn vị 1 ngày trong 20 ngày. Chỉ số này giúp loại bỏ sự ảnh hưởng của các cổ phiếu trụ có vốn hóa lớn làm méo mó thị trường.
                                    </div>
                                    <div>
                                        <strong>VN30:</strong> Chỉ số của 30 cổ phiếu có vốn hóa thị trường lớn nhất và thanh khoản tốt nhất trên HOSE.
                                    </div>
                                    <div>
                                        <strong>VN100:</strong> Chỉ số của 100 cổ phiếu có vốn hóa thị trường lớn nhất và thanh khoản tốt trên HOSE.
                                    </div>
                                    <div>
                                        <strong>VNALL (VNAllShare):</strong> Chỉ số vốn hóa bao gồm các mã cổ phiếu được niêm yết trên sàn HOSE, thỏa mãn 4 tiêu chí bắt buộc:
                                        <ul className="mt-1 ml-4 space-y-1">
                                            <li><strong>Tư cách:</strong> Cổ phiếu hoạt động bình thường, niêm yết tối thiểu 6 tháng (3 tháng nếu thuộc top 5 vốn hóa)</li>
                                            <li><strong>Free-float:</strong> Tối thiểu 10% (5% nếu thuộc top 10 vốn hóa)</li>
                                            <li><strong>Thanh khoản:</strong> ≥ 0.05%</li>
                                            <li><strong>Tỷ trọng vốn hóa:</strong> Giới hạn 10%</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>VNMID:</strong> Chỉ số của các cổ phiếu có vốn hóa thị trường trung bình trên thị trường chứng khoán Việt Nam.
                                    </div>
                                    <div>
                                        <strong>VNSML:</strong> Chỉ số của các cổ phiếu có vốn hóa thị trường nhỏ trên thị trường chứng khoán Việt Nam.
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                )}
                
                <div 
                    ref={chartContainerRef} 
                    className="w-full"
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