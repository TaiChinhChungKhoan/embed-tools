import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Separator } from '@embed-tools/components';
import { TrendingUp, BarChart3, Network, Grid3X3, ScatterChart, Activity } from 'lucide-react';
import MarketRegimeView from './components/MarketRegimeView';
import NetworkView from './components/NetworkView';
import MatrixView from './components/MatrixView';
import PCAView from './components/PCAView';
import PairsView from './components/PairsView';
import iframeUtils from '@embed-tools/iframe-utils';

const isEmbedded = iframeUtils.isEmbedded();

const App = () => {
  const [currentView, setCurrentView] = useState('regime');
  const [data, setData] = useState({
    correlationData: null,
    pcaData: null,
    marketRegimeData: null,
    filteredCorrelationData: null
  });
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [timeFilter, setTimeFilter] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [correlationData, pcaData, marketRegimeData] = await Promise.all([
        import('./data/correlation_matrix.json'),
        import('./data/pca_analysis.json'),
        import('./data/market_regime.json')
      ]);

      setData({
        correlationData: correlationData.default,
        pcaData: pcaData.default,
        marketRegimeData: marketRegimeData.default,
        filteredCorrelationData: correlationData.default
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTimeFilter = (selection) => {
    if (!selection) {
      setTimeFilter(null);
      setData(prev => ({ ...prev, filteredCorrelationData: prev.correlationData }));
    } else {
      setTimeFilter(selection);
      // For now, we'll simulate filtering by reducing correlations
      // In a real implementation, you'd filter based on actual time data
      const originalData = data.correlationData;
      const filteredCorrelations = originalData.significant_correlations.slice(0, Math.floor(originalData.significant_correlations.length * 0.7));
      setData(prev => ({
        ...prev,
        filteredCorrelationData: {
          ...originalData,
          significant_correlations: filteredCorrelations
        }
      }));
    }
  };

  const clearTimeFilter = () => {
    setTimeFilter(null);
    setData(prev => ({ ...prev, filteredCorrelationData: prev.correlationData }));
  };

  const selectSymbol = (symbol) => {
    setSelectedSymbol(selectedSymbol === symbol ? null : symbol);
  };

  const tabs = [
    { id: 'regime', label: 'Trạng Thái Thị Trường', icon: Activity },
    { id: 'network', label: 'Đồ Thị Mạng Lưới', icon: Network },
    { id: 'matrix', label: 'Ma Trận Tương Quan', icon: Grid3X3 },
    { id: 'pca', label: 'Phân Tích PCA', icon: ScatterChart },
    { id: 'pairs', label: 'Các cặp tương quan', icon: BarChart3 }
  ];

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    const currentData = data.filteredCorrelationData || data.correlationData;
    if (!currentData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Không có dữ liệu để hiển thị
        </div>
      );
    }

    switch (currentView) {
      case 'regime':
        return (
          <MarketRegimeView 
            data={data.marketRegimeData}
            onTimeFilter={applyTimeFilter}
            onClearFilter={clearTimeFilter}
            timeFilter={timeFilter}
          />
        );
      case 'network':
        return (
          <NetworkView 
            data={currentData}
            selectedSymbol={selectedSymbol}
            onSymbolSelect={selectSymbol}
          />
        );
      case 'matrix':
        return (
          <MatrixView 
            data={currentData}
            selectedSymbol={selectedSymbol}
            onSymbolSelect={selectSymbol}
          />
        );
      case 'pca':
        return (
          <PCAView 
            data={data.pcaData}
            selectedSymbol={selectedSymbol}
            onSymbolSelect={selectSymbol}
          />
        );
      case 'pairs':
        return (
          <PairsView 
            data={currentData}
            selectedSymbol={selectedSymbol}
            onSymbolSelect={selectSymbol}
          />
        );
      default:
        return null;
    }
  };

  const getStats = () => {
    const currentData = data.filteredCorrelationData || data.correlationData;
    if (!currentData) return { symbols: 0, correlations: 0, dataPoints: 0 };
    
    return {
      symbols: currentData.symbols?.length || 0,
      correlations: currentData.significant_correlations?.length || 0,
      dataPoints: currentData.metadata?.total_data_points || 'N/A'
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">
                Phân Tích Tương Quan Mã Cổ Phiếu
              </h1>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-xl font-semibold text-primary">{stats.symbols}</div>
                <div className="text-xs text-muted-foreground uppercase">Mã Cổ Phiếu</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-primary">{stats.correlations}</div>
                <div className="text-xs text-muted-foreground uppercase">Tương Quan</div>
              </div>
              {/* <div className="text-center">
                <div className="text-xl font-semibold text-primary">{stats.dataPoints}</div>
                <div className="text-xs text-muted-foreground uppercase">Điểm Dữ Liệu</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-muted/50 border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-none
                    ${isActive ? 'border-blue-600 text-blue-700 font-semibold bg-white' : 'border-transparent text-gray-500 hover:text-blue-700 hover:bg-gray-100'}
                    rounded-none shadow-none focus:outline-none focus:ring-0`}
                  style={{ boxShadow: 'none' }}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {renderCurrentView()}
      </div>

      {/* Copyright Footer */}
      {!isEmbedded && (
        <footer className="text-center mt-12 mb-8 text-xs text-gray-500 max-w-4xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} <a href="https://taichinhchungkhoan.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Taichinhchungkhoan.com</a>
          </p>
          <p className="mt-1">Taichinhchungkhoan.com - Nền tảng kiến thức và công cụ tài chính cho người Việt</p>
        </footer>
      )}
    </div>
  );
};

export default App;