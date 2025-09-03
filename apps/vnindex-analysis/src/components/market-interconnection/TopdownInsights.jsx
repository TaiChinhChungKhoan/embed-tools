import React, { useState } from 'react';
import Card from '../Card';
import TopdownInsightsHeader from './TopdownInsightsHeader';
import TopdownInsightsProgress from './TopdownInsightsProgress';
import TopdownInsightsSection from './TopdownInsightsSection';

const TopdownInsights = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['inflation', 'macro', 'fed_policy', 'risk', 'trading_playbook']));
  const [selectedSection, setSelectedSection] = useState(null);

  // Enhanced data validation
  if (!data) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl mb-4">📊</span>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Đang tải dữ liệu...</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Vui lòng đợi trong giây lát</div>
        </div>
      </Card>
    );
  }

  if (!data.sections || data.sections.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl mb-4">📭</span>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Không có dữ liệu phân tích</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Vui lòng kiểm tra lại sau</div>
        </div>
      </Card>
    );
  }

  const { 
    timestamp, 
    analysis_version, 
    inflation_regime, 
    risk_regime, 
    market_regime, 
    overall_confidence,
    sections,
    trading_recommendations,
    risk_management,
    priority_signals,
    data_quality_score,
    consistency_score
  } = data;

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      case 'neutral': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Helper function to get status background color
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'positive': return 'bg-green-100 dark:bg-green-900/20';
      case 'negative': return 'bg-red-100 dark:bg-red-900/20';
      case 'neutral': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Helper function to get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Helper function to format percentage
  const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(decimals)}%`;
  };

  // Helper function to format currency
  const formatCurrency = (value, currency = 'USD') => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  // Helper function to toggle section expansion
  const toggleSection = (sectionType) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionType)) {
      newExpanded.delete(sectionType);
    } else {
      newExpanded.add(sectionType);
    }
    setExpandedSections(newExpanded);
  };

  // Helper function to expand all sections
  const expandAll = () => {
    setExpandedSections(new Set(sections.map(s => s.type)));
  };

  // Helper function to collapse all sections
  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Define the analysis flow steps
  const analysisSteps = [
    { key: 'inflation', label: 'Lạm phát', icon: '💰', order: 1 },
    { key: 'macro', label: 'Kinh tế vĩ mô', icon: '🌍', order: 2 },
    { key: 'fed_policy', label: 'Chính sách Fed', icon: '🏛️', order: 3 },
    { key: 'risk', label: 'Rủi ro', icon: '⚠️', order: 4 },
    { key: 'trading_playbook', label: 'Kết luận', icon: '📋', order: 5 }
  ];

  // Get current step for progress tracking
  const getCurrentStep = () => {
    if (selectedSection) {
      const step = analysisSteps.find(s => s.key === selectedSection);
      return step ? step.order : 1;
    }
    return 1;
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <TopdownInsightsHeader 
        timestamp={timestamp}
        analysis_version={analysis_version}
        data_quality_score={data_quality_score}
        consistency_score={consistency_score}
        getConfidenceColor={getConfidenceColor}
        formatTimestamp={formatTimestamp}
      />
      
      {/* Progress Bar */}
      <TopdownInsightsProgress 
        analysisSteps={analysisSteps}
        selectedSection={selectedSection}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        getCurrentStep={getCurrentStep}
      />
      
              {/* Overall Summary - Display key section summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {sections.slice(0, 4).map((section, index) => {
          const icons = {
            'inflation': '💰',
            'macro': '🌍',
            'fed_policy': '🏛️',
            'risk': '⚠️',
            'trading_playbook': '📋'
          };
          
          const firstKeyPoint = section.key_points?.[0] || section.summary || 'N/A';
          const displayText = firstKeyPoint.length > 100 ? 
            firstKeyPoint.substring(0, 97) + '...' : 
            firstKeyPoint;
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                section.regime === 'negative' || section.regime === 'inflation_on' ? 
                  'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                section.regime === 'positive' || section.regime === 'inflation_off' ? 
                  'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                section.regime === 'neutral' ? 
                  'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20'
              }`}
              onClick={() => {
                setSelectedSection(section.type);
                if (!expandedSections.has(section.type)) {
                  toggleSection(section.type);
                }
                setTimeout(() => {
                  document.getElementById(`section-${section.type}`)?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  });
                }, 100);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {section.title}
                </div>
                <span className="text-lg">{icons[section.type] || '📊'}</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {displayText}
              </div>
              {section.confidence !== undefined && section.confidence !== null && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        section.confidence >= 0.8 ? 'bg-green-500' : 
                        section.confidence >= 0.6 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${(section.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${getConfidenceColor(section.confidence || 0)}`}>
                    {formatPercentage(section.confidence, 0)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={expandAll}
          className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          📂 Mở rộng tất cả
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          📁 Thu gọn tất cả
        </button>
      </div>

      {/* Priority Signals */}
      {priority_signals && priority_signals.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
            🎯 Tín hiệu Ưu tiên
          </h4>
          <div className="space-y-1">
            {priority_signals.map((signal, index) => (
              <div key={index} className="text-sm text-orange-700 dark:text-orange-300 whitespace-pre-line">
                • {signal}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => {
          const stepInfo = analysisSteps.find(s => s.key === section.type);
          const stepNumber = stepInfo ? stepInfo.order : index + 1;
          
          return (
            <TopdownInsightsSection
              key={index}
              section={section}
              index={index}
              stepInfo={stepInfo}
              stepNumber={stepNumber}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              getStatusColor={getStatusColor}
              getStatusBgColor={getStatusBgColor}
              getConfidenceColor={getConfidenceColor}
              formatPercentage={formatPercentage}
              formatCurrency={formatCurrency}
              filteredSections={sections}
            />
          );
        })}
      </div>

      {/* Final Section - Recommendations and Risk Management */}
      <div className="mt-12">
        <div className="flex items-center mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
          <span className="mx-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            🎯 Khuyến nghị cuối cùng
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        </div>

        {/* Trading Recommendations */}
        {trading_recommendations && trading_recommendations.length > 0 && (
          <div className="mb-8 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-blue-200 dark:border-blue-800 pb-2">
              💼 Khuyến nghị Giao dịch
            </h4>
            <div className="space-y-3">
              {trading_recommendations
                .sort((a, b) => a.priority - b.priority)
                .map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className={`flex-shrink-0 w-8 h-8 ${recommendation.priority === 1 ? 'bg-red-100 dark:bg-red-900/30' : recommendation.priority === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'} rounded-full flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${recommendation.priority === 1 ? 'text-red-600 dark:text-red-400' : recommendation.priority === 2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {recommendation.priority}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {recommendation.action.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                          {recommendation.category}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 whitespace-pre-line">
                        {recommendation.description}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {recommendation.reasoning}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Risk Management */}
        {risk_management && (
          <div className="border-2 border-orange-200 dark:border-orange-700 rounded-xl p-6 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-red-200 dark:border-red-800 pb-2">
              ⚠️ Quản lý Rủi ro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Kích thước vị thế</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPercentage(risk_management?.position_size, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">của vốn</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Stop Loss</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatPercentage(risk_management?.stop_loss, 1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">mỗi vị thế</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rủi ro tối đa</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatPercentage(risk_management?.max_daily_risk, 1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">mỗi ngày</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Flow Summary */}
      <div className="mt-12 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-700">
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
          <span className="text-2xl">🎯</span>
          <span>Tóm tắt Phân tích Top-down</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {analysisSteps.map((step, index) => {
            const section = sections.find(s => s.type === step.key);
            const isLastStep = index === analysisSteps.length - 1;
            
            return (
              <div key={step.key} className="relative">
                <div className={`p-3 rounded-lg ${
                  isLastStep ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-orange-300 dark:border-orange-700' :
                  'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{step.icon}</span>
                    {!isLastStep && (
                      <span className="text-gray-400">→</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {step.label}
                  </div>
                  <div className={`text-xs ${
                    section?.regime === 'negative' || section?.regime === 'inflation_on' ? 'text-red-600 dark:text-red-400' :
                    section?.regime === 'positive' || section?.regime === 'inflation_off' ? 'text-green-600 dark:text-green-400' :
                    section?.regime === 'neutral' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {section?.regime || 'N/A'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            💡 Kết luận: {sections.find(s => s.type === 'trading_playbook')?.summary || 'Thị trường đang trong giai đoạn chuyển tiếp'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TopdownInsights;
