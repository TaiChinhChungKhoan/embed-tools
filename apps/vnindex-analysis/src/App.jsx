import React, { useState, useRef, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './App.css';
import MarketWave from './components/MarketWave';
import GreedFearGauge from './components/GreedFearGauge';
import MarketOverviewDashboard from './components/MarketOverviewDashboard';
import MarketFlowDashboard from './components/MarketFlowDashboard';
import MomentumInsightsWrapper from './components/MomentumInsightsWrapper';
import StockAbnormalSignals from './components/StockAbnormalSignals';
import IndustryAbnormalSignals from './components/IndustryAbnormalSignals';
import IndustryOverviewDashboard from './components/IndustryOverviewDashboard';
import TickerOverviewDashboard from './components/TickerOverviewDashboard';
import RelativeStrengthAnalysis from './components/RelativeStrengthAnalysis';
import ValuationReport from './components/ValuationReport';
import MarketOverviewReport from './components/MarketOverviewReport';
import MacroeconomicsReport from './components/MacroeconomicsReport';
import MarketInterconnectionReport from './components/MarketInterconnectionReport';
import VSAReport from './components/VSAReport';
import VCPAnalysis from './components/VCPAnalysis';
import GlobalReloadButton from './components/GlobalReloadButton';

import { DataReloadProvider, useDataReload } from './contexts/DataReloadContext';
import iframeUtils from '@embed-tools/iframe-utils';

// Report options for each tab
const reportOptions = {
    'Industries': [
        { id: 'rs_analysis', name: 'Phân tích Sức mạnh Tương đối', description: 'Phân tích RS/CRS, RRG và xu hướng sức mạnh của các ngành nghề' },
        { id: 'abnormal_signals', name: 'Tín hiệu Bất thường', description: 'Phát hiện các tín hiệu bất thường trong ngành' }
    ],
    'Tickers': [
        { id: 'abnormal_signals', name: 'Tín hiệu Bất thường', description: 'Phát hiện các tín hiệu bất thường trong mã chứng khoán' },
        { id: 'vsa_report', name: 'Báo cáo VSA', description: 'Phân tích Volume Spread Analysis cho từng mã chứng khoán' },
        { id: 'vcp_analysis', name: 'Phân tích VCP', description: 'Phân tích mẫu hình tích lũy VCP cho các mã chứng khoán' }
    ],
    'Market': [
        { id: 'market_interconnection', name: 'Liên thị trường', description: 'Phân tích top-down từ macro đến micro, xác định chế độ thị trường' },
        { id: 'market_overview', name: 'Tổng quan Thị trường', description: 'Báo cáo phân tích thị trường tổng hợp' },
        { id: 'macroeconomics', name: 'Báo cáo Vĩ mô', description: 'Phân tích các chỉ số kinh tế vĩ mô và xu hướng thị trường' },
        { id: 'valuation_report', name: 'Báo cáo Định giá', description: 'Phân tích tỷ lệ P/E và P/B của VN-Index' },
    ]
};

// Vietnamese translations
const tabTranslations = {
    'Market': 'Thị trường',
    'Industries': 'Ngành nghề',
    'Tickers': 'Mã chứng khoán'
};

const subTabTranslations = {
    'Overview': 'Tổng quan',
    'Reports': 'Báo cáo'
};

function AppLayout() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
    const [timeframe, setTimeframe] = useState('1D');
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isEmbedded = iframeUtils.isEmbedded();

    // Get essential data loading state from context
    const { essentialDataLoading, essentialDataError } = useDataReload();

    // Parse current route - using HashRouter for both embedded and standalone
    const getPathParts = () => {
        // HashRouter uses location.pathname after the hash
        return location.pathname.split('/').filter(Boolean);
    };
    
    const pathParts = getPathParts();
    const currentTab = pathParts[0] || 'market';
    const currentSubTab = pathParts[1] || 'overview';
    const currentReportId = pathParts[2] || null;

    // Convert route to display values
    const getDisplayTab = (tab) => {
        const tabMap = { market: 'Market', industries: 'Industries', tickers: 'Tickers' };
        return tabMap[tab] || 'Market';
    };

    const getDisplaySubTab = (subTab) => {
        const subTabMap = { overview: 'Overview', reports: 'Reports' };
        return subTabMap[subTab] || 'Overview';
    };

    const activeTab = getDisplayTab(currentTab);
    const activeSubTab = getDisplaySubTab(currentSubTab);

    // Notify parent when state changes
    useEffect(() => {
        if (!isEmbedded) return;
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                iframeUtils.sendResizeMessage(width, height);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [activeTab, activeSubTab, currentReportId, isMobileMenuOpen, isEmbedded]);

    // Listen for navigation messages from parent
    useEffect(() => {
        if (!isEmbedded) return;
        
        const handleMessage = (event) => {
            if (event.data.type === 'NAVIGATE') {
                const path = event.data.path;
                // For HashRouter, we need to ensure the path starts with /
                const normalizedPath = path.startsWith('/') ? path : `/${path}`;
                navigate(normalizedPath);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isEmbedded, navigate]);

    // Notify parent when route changes
    useEffect(() => {
        if (!isEmbedded) return;
        
        const currentHash = isEmbedded ? location.hash : '';
        window.parent.postMessage({
            type: 'ROUTE_CHANGE',
            hash: currentHash
        }, '*');
    }, [location, isEmbedded]);

    // Show loading screen while essential data is loading
    if (essentialDataLoading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-gray-600 dark:text-gray-400 text-lg">Đang tải dữ liệu cơ bản...</div>
                    <div className="text-gray-500 dark:text-gray-500 text-sm mt-2">Tải thông tin ngành nghề và mã chứng khoán</div>
                </div>
            </div>
        );
    }

    // Show error screen if essential data failed to load
    if (essentialDataError) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">Lỗi tải dữ liệu cơ bản</div>
                    <div className="text-gray-600 dark:text-gray-400 mb-4">{essentialDataError}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const tabs = ['Market', 'Industries', 'Tickers'];
    const subTabs = ['Overview', 'Reports'];

    const handleTabClick = (tab) => {
        const tabRoute = tab.toLowerCase();
        const path = `/${tabRoute}/overview`;
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleReportSelect = (reportId) => {
        const tabRoute = activeTab.toLowerCase();
        const path = `/${tabRoute}/reports/${reportId}`;
        navigate(path);
        setIsReportDropdownOpen(false);
    };

    const currentReportOptions = reportOptions[activeTab] || [];
    const currentReport = currentReportOptions.find(r => r.id === currentReportId) || currentReportOptions[0];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans" ref={containerRef}>
            {/* Header */}
            <header className="bg-white dark:bg-gray-800/90 backdrop-blur-sm sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <div className="ml-2">
                                {!isEmbedded && <span className="text-xl font-bold">Phân tích VN-Index</span>}
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Dữ liệu hàng ngày được cập nhật vào cuối ngày
                                </div>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center space-x-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        activeTab === tab 
                                            ? 'bg-blue-500 text-white' 
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {tabTranslations[tab]}
                                </button>
                            ))}
                            <GlobalReloadButton />
                        </nav>
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-3 border-t border-gray-200 dark:border-gray-700">
                        <nav className="px-2 space-y-1 mt-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                                        activeTab === tab 
                                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' 
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {tabTranslations[tab]}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <div className="relative">
                <main>
                    {/* Sub-tabs */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between">
                                <div className="flex -mb-px space-x-2 sm:space-x-4 items-center relative">
                                    {subTabs.map(subTab => {
                                        if (subTab === 'Reports' && currentReportOptions.length > 1) {
                                            return (
                                                <div key={subTab} className="relative">
                                                    <button
                                                        onClick={() => {
                                                            setIsReportDropdownOpen((open) => !open);
                                                        }}
                                                        className={`py-3 px-1 sm:px-4 text-sm sm:text-base font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
                                                            activeSubTab === subTab 
                                                                ? 'border-blue-500 text-blue-500' 
                                                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                                                        }`}
                                                        aria-haspopup="listbox"
                                                        aria-expanded={isReportDropdownOpen}
                                                    >
                                                        <span>{subTabTranslations[subTab]}</span>
                                                        <ChevronDown size={16} className={`transition-transform ${isReportDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isReportDropdownOpen && (
                                                        <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                                                            <div className="py-2">
                                                                {currentReportOptions.map((report) => (
                                                                    <button
                                                                        key={report.id}
                                                                        onClick={() => {
                                                                            handleReportSelect(report.id);
                                                                            setIsReportDropdownOpen(false);
                                                                        }}
                                                                        className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                                                                            currentReport?.id === report.id
                                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-semibold'
                                                                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                        }`}
                                                                    >
                                                                        <div className="font-medium">{report.name}</div>
                                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.description}</div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return (
                                            <button
                                                key={subTab}
                                                onClick={() => {
                                                    const tabRoute = activeTab.toLowerCase();
                                                    const subTabRoute = subTab.toLowerCase();
                                                    const path = `/${tabRoute}/${subTabRoute}`;
                                                    navigate(path);
                                                    setIsReportDropdownOpen(false);
                                                }}
                                                className={`py-3 px-1 sm:px-4 text-sm sm:text-base font-semibold border-b-2 transition-colors cursor-pointer ${
                                                    activeSubTab === subTab 
                                                        ? 'border-blue-500 text-blue-500' 
                                                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                                                }`}
                                            >
                                                {subTabTranslations[subTab]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Routes>
                            {/* Market Routes */}
                            <Route path="market" element={
                                <div className="space-y-8">
                                    <GreedFearGauge />
                                    {/* <MarketOverviewDashboard /> */}
                                    <MomentumInsightsWrapper />
                                    <MarketFlowDashboard />
                                    <MarketWave />
                                </div>
                            } />
                            <Route path="market/overview" element={
                                <div className="space-y-8">
                                    <GreedFearGauge />
                                    {/* <MarketOverviewDashboard /> */}
                                    <MomentumInsightsWrapper />
                                    <MarketFlowDashboard />
                                    <MarketWave />
                                </div>
                            } />
                            <Route path="market/reports" element={<MarketInterconnectionReport />} />
                            <Route path="market/reports/market_interconnection" element={<MarketInterconnectionReport />} />
                            <Route path="market/reports/market_overview" element={<MarketOverviewReport />} />
                            <Route path="market/reports/macroeconomics" element={<MacroeconomicsReport />} />
                            <Route path="market/reports/valuation_report" element={<ValuationReport />} />

                            {/* Industries Routes */}
                            <Route path="industries" element={
                                <div className="space-y-8">
                                    <IndustryOverviewDashboard />
                                </div>
                            } />
                            <Route path="industries/overview" element={
                                <div className="space-y-8">
                                    <IndustryOverviewDashboard />
                                </div>
                            } />
                            <Route path="industries/reports" element={
                                <>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian:</span>
                                        <div className="flex gap-2">
                                            <button
                                                className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                                                onClick={() => setTimeframe('1D')}
                                            >
                                                Hàng ngày (1D)
                                            </button>
                                            <button
                                                className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                                                onClick={() => setTimeframe('1W')}
                                            >
                                                Hàng tuần (1W)
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <RelativeStrengthAnalysis timeframe={timeframe} />
                                    </div>
                                </>
                            } />
                            <Route path="industries/reports/rs_analysis" element={
                                <>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian:</span>
                                        <div className="flex gap-2">
                                            <button
                                                className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                                                onClick={() => setTimeframe('1D')}
                                            >
                                                Hàng ngày (1D)
                                            </button>
                                            <button
                                                className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                                                onClick={() => setTimeframe('1W')}
                                            >
                                                Hàng tuần (1W)
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <RelativeStrengthAnalysis timeframe={timeframe} />
                                    </div>
                                </>
                            } />
                            <Route path="industries/reports/abnormal_signals" element={
                                <div className="space-y-8">
                                    <IndustryAbnormalSignals />
                                </div>
                            } />

                            {/* Tickers Routes */}
                            <Route path="tickers" element={
                                <div className="space-y-8">
                                    <TickerOverviewDashboard />
                                </div>
                            } />
                            <Route path="tickers/overview" element={
                                <div className="space-y-8">
                                    <TickerOverviewDashboard />
                                </div>
                            } />
                            <Route path="tickers/reports" element={
                                <div className="space-y-8">
                                    <StockAbnormalSignals />
                                </div>
                            } />
                            <Route path="tickers/reports/abnormal_signals" element={
                                <div className="space-y-8">
                                    <StockAbnormalSignals />
                                </div>
                            } />
                            <Route path="tickers/reports/vsa_report" element={
                                <div className="space-y-8">
                                    <VSAReport />
                                </div>
                            } />
                            <Route path="tickers/reports/vcp_analysis" element={
                                <div className="space-y-8">
                                    <VCPAnalysis />
                                </div>
                            } />

                            {/* Default redirect */}
                            <Route path="/" element={<Navigate to="/market/overview" replace />} />
                            <Route path="*" element={<Navigate to="/market/overview" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>

            {/* Click outside to close dropdown */}
            {isReportDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsReportDropdownOpen(false)}
                />
            )}

            {/* Data Source Attribution - Always Show */}
            <div className="text-center py-4 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700">
                <p>Sử dụng dữ liệu từ <a href="https://vnstocks.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline cursor-pointer">https://vnstocks.com/</a> Wichart.vn và Investing.com</p>
            </div>

            {!isEmbedded && (
                <footer className="text-center mt-8 text-xs text-gray-500">
                    <p>© 2025 Taichinhchungkhoan.com</p>
                    <p className="mt-1">Taichinhchungkhoan.com - Nền tảng kiến thức và công cụ tài chính cho người Việt</p>
                    <p className="mt-2">
                        <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Ứng dụng này được tạo ra cho mục đích tham khảo và giáo dục.
                        Thông tin cung cấp không được coi là lời khuyên đầu tư chuyên nghiệp.
                        Luôn tham khảo ý kiến chuyên gia tài chính trước khi ra quyết định.
                    </p>
                </footer>
            )}
        </div>
    );
}

export default function App() {
    return (
        <DataReloadProvider>
            <HashRouter>
                <AppLayout />
            </HashRouter>
        </DataReloadProvider>
    );
}