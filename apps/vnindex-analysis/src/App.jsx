import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import './App.css';
import MarketOverview from './components/MarketOverview';
import MarketWave from './components/MarketWave';
import StockAbnormalSignals from './components/StockAbnormalSignals';
import IndustryAbnormalSignals from './components/IndustryAbnormalSignals';
import IndustryRSAnalysis from './components/IndustryRSAnalysis';
import TickerRSAnalysis from './components/TickerRSAnalysis';
import RRGAnalysis from './components/RRGAnalysis';
import ValuationReport from './components/ValuationReport';
import MarketOverviewReport from './components/MarketOverviewReport';
import MacroeconomicsReport from './components/MacroeconomicsReport';
import IndustryStrengthChart from './components/IndustryStrengthChart';
import iframeUtils from '@embed-tools/iframe-utils';

export default function App() {
    const [activeTab, setActiveTab] = useState('Market');
    const [activeSubTab, setActiveSubTab] = useState('Overview');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeReport, setActiveReport] = useState('rs_analysis');
    const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
    const containerRef = useRef(null);
    const isEmbedded = iframeUtils.isEmbedded();

    const tabs = ['Market', 'Industries', 'Tickers'];
    const subTabs = ['Overview', 'Reports'];

    // Report options for each tab
    const reportOptions = {
        'Industries': [
            { id: 'rs_analysis', name: 'Phân tích Sức mạnh Tương đối', description: 'Phân tích RS/CRS của các ngành nghề' },
            { id: 'abnormal_signals', name: 'Tín hiệu Bất thường', description: 'Phát hiện các tín hiệu bất thường trong ngành' },
            { id: 'rrg_analysis', name: 'Đồ thị Xoay Tương đối (RRG)', description: 'Phân tích sức mạnh tương đối và động lượng của các ngành' },
            { id: 'industry_strength', name: 'Biểu đồ Sức mạnh Ngành', description: 'Phân tích xu hướng sức mạnh và điểm yếu của từng ngành theo thời gian' }
        ],
        'Tickers': [
            { id: 'rs_analysis', name: 'Phân tích Sức mạnh Tương đối', description: 'Phân tích RS/CRS của các mã chứng khoán' },
            { id: 'abnormal_signals', name: 'Tín hiệu Bất thường', description: 'Phát hiện các tín hiệu bất thường trong mã chứng khoán' },
            { id: 'rrg_analysis', name: 'Đồ thị Xoay Tương đối (RRG)', description: 'Phân tích sức mạnh tương đối và động lượng của các mã chứng khoán' }
        ],
        'Market': [
            { id: 'market_overview', name: 'Tổng quan Thị trường', description: 'Báo cáo phân tích thị trường tổng hợp' },
            { id: 'macroeconomics', name: 'Báo cáo Vĩ mô', description: 'Phân tích các chỉ số kinh tế vĩ mô và xu hướng thị trường' },
            { id: 'valuation_report', name: 'Báo cáo Định giá', description: 'Phân tích tỷ lệ P/E và P/B của VN-Index' }
        ]
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setActiveSubTab('Overview');
        setMobileMenuOpen(false);
        // Reset to first report option for the new tab
        const firstReport = reportOptions[tab]?.[0]?.id || 'rs_analysis';
        setActiveReport(firstReport);
    };
    
    const handleSubTabClick = (subTab) => {
        setActiveSubTab(subTab);
        setIsReportDropdownOpen(false);
    };

    const handleReportSelect = (reportId) => {
        setActiveReport(reportId);
        setIsReportDropdownOpen(false);
    };

    const isReportsActive = activeSubTab === 'Reports';
    const currentReportOptions = reportOptions[activeTab] || [];
    const currentReport = currentReportOptions.find(r => r.id === activeReport) || currentReportOptions[0];

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

    // Notify parent when state changes (activeTab, activeSubTab, etc.)
    useEffect(() => {
        if (!isEmbedded) return;
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                iframeUtils.sendResizeMessage(width, height);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [activeTab, activeSubTab, activeReport, isMobileMenuOpen, isEmbedded]);

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
                            {!isEmbedded && <span className="ml-2 text-xl font-bold">Phân tích VN-Index</span>}
                        </div>
                        <nav className="hidden md:flex items-center space-x-2">
                            {tabs.map(tab => (
                                <button 
                                    key={tab} 
                                    onClick={() => handleTabClick(tab)} 
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {tabTranslations[tab]}
                                </button>
                            ))}
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
                                        activeTab === tab ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                                                            activeSubTab === subTab ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
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
                                                            setActiveSubTab('Reports');
                                                            setIsReportDropdownOpen(false);
                                                        }}
                                                                        className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                                                                            activeReport === report.id
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
                                                    setActiveSubTab(subTab);
                                                    setIsReportDropdownOpen(false);
                                                }}
                                                className={`py-3 px-1 sm:px-4 text-sm sm:text-base font-semibold border-b-2 transition-colors cursor-pointer ${
                                                    activeSubTab === subTab ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
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
                        {activeSubTab === 'Overview' && (
                            <>
                                {activeTab === 'Market' && (
                                    <div className="space-y-8">
                                        <MarketOverview />
                                        <MarketWave />
                                    </div>
                                )}
                                {activeTab === 'Industries' && (
                                    <div className="space-y-8">
                                        <IndustryAbnormalSignals />
                                    </div>
                                )}
                                {activeTab === 'Tickers' && (
                                    <div className="space-y-8">
                                        <StockAbnormalSignals />
                                    </div>
                                )}
                            </>
                        )}
                        {activeSubTab === 'Reports' && (
                            <>
                                {activeTab === 'Industries' && (
                                    <div className="space-y-8">
                                        {activeReport === 'rs_analysis' && <IndustryRSAnalysis />}
                                        {activeReport === 'abnormal_signals' && <IndustryAbnormalSignals />}
                                        {activeReport === 'rrg_analysis' && <RRGAnalysis />}
                                        {activeReport === 'industry_strength' && <IndustryStrengthChart />}
                                    </div>
                                )}
                                {activeTab === 'Tickers' && (
                                    <div className="space-y-8">
                                        {activeReport === 'rs_analysis' && <TickerRSAnalysis />}
                                        {activeReport === 'abnormal_signals' && <StockAbnormalSignals />}
                                        {activeReport === 'rrg_analysis' && <RRGAnalysis />}
                                    </div>
                                )}
                                {activeTab === 'Market' && (
                                    <div className="space-y-8">
                                        {activeReport === 'market_overview' && <MarketOverviewReport />}
                                        {activeReport === 'macroeconomics' && <MacroeconomicsReport />}
                                        {activeReport === 'valuation_report' && <ValuationReport />}
                                    </div>
                                )}
                            </>
                        )}
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

            {!isEmbedded && (
                <footer className="text-center mt-8 text-xs text-gray-500">
                    <p>© 2025 Taichinhchungkhoan.com</p>
                    <p className="mt-1">Taichinhchungkhoan.com - Nền tảng kiến thức và công cụ tài chính cho người Việt</p>
                    <p className="mt-2">Sử dụng dữ liệu từ Wichart.vn và Investing.com</p>
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