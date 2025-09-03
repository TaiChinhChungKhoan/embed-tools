import React from 'react';

const TopdownInsightsSection = ({ 
  section, 
  index, 
  stepInfo, 
  stepNumber, 
  expandedSections, 
  toggleSection,
  getStatusColor,
  getStatusBgColor,
  getConfidenceColor,
  formatPercentage,
  formatCurrency,
  filteredSections
}) => {
  return (
    <React.Fragment key={index}>
      <div className="relative">
        {/* Section Connector Line */}
        {index > 0 && (
          <div className="absolute -top-10 left-8 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
        )}
        
        {/* Step Indicator */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <span className="text-2xl font-bold">{stepNumber}</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Bước {stepNumber}: Phân tích
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <span>{stepInfo?.icon}</span>
                <span>{section.title}</span>
              </h3>
            </div>
          </div>
          {index < filteredSections.length - 1 && (
            <div className="ml-auto flex items-center space-x-2 text-gray-400 hidden sm:flex">
              <span className="text-sm">Tiếp theo</span>
              <span className="text-xl">→</span>
            </div>
          )}
        </div>
        
        <div 
          id={`section-${section.type}`}
          className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900"
        >
          {/* Section Header */}
          <div 
            className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 cursor-pointer hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
            onClick={() => toggleSection(section.type)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && toggleSection(section.type)}
            aria-expanded={expandedSections.has(section.type)}
            aria-controls={`section-content-${section.type}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {section.summary}
                </h4>
                {section.regime && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBgColor(section.regime)} ${getStatusColor(section.regime)}`}>
                    {section.regime}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Độ tin cậy:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${section.confidence >= 0.8 ? 'bg-green-500' : section.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${(section.confidence || 0) * 100}%` }}
                      />
                    </div>
                    <span className={`font-semibold ${getConfidenceColor(section.confidence || 0)}`}>
                      {formatPercentage(section.confidence, 1)}
                    </span>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-200"
                  style={{ transform: expandedSections.has(section.type) ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  ▶
                </button>
              </div>
            </div>
            
            {/* Summary */}
            {/* <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
              // {section.summary}
            </div> */}
          </div>

          {/* Section Content */}
          {expandedSections.has(section.type) && (
            <div 
              id={`section-content-${section.type}`}
              className="p-4 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200"
            >
                             {/* Key Points */}
               {section.key_points && section.key_points.length > 0 && (
                 <div className="mb-4">
                   <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                     🎯 Điểm chính:
                   </h5>
                   <ul className="space-y-1">
                     {section.key_points.map((point, pointIndex) => (
                       <li key={pointIndex} className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                         {point}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

              {/* Indicators - Organized Layout */}
              {section.indicators && section.indicators.length > 0 && (
                <div className="mb-4">
                  {(() => {
                                         // Filter out "Hàng hóa" indicator since we display commodities separately
                     const filteredIndicators = section.indicators.filter(indicator => 
                       indicator.name !== 'Hàng hóa'
                     );
                     
                     if (filteredIndicators.length === 0) return null;
                    
                    return (
                      <>
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                          📊 Chỉ báo ({filteredIndicators.length}):
                        </h5>
                        
                        {/* Special layout for inflation section with CPI/PCE pairs */}
                        {section.type === 'inflation' && (
                          <div className="space-y-4">
                            {/* CPI Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {filteredIndicators
                                .filter(indicator => indicator.name.includes('CPI'))
                                .map((indicator, indicatorIndex) => (
                                  <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {indicator.name}
                                        </h6>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                          {indicator.status}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {indicator.trend_icon && (
                                          <span className="text-base">{indicator.trend_icon}</span>
                                        )}
                                        {indicator.trend && (
                                          <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {indicator.trend}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Current Value - Compact */}
                                    {indicator.current_value !== undefined && indicator.current_value !== null && (
                                      <div className="flex items-center justify-between mb-2 text-xs">
                                        <span className="text-gray-500">Giá trị:</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                          {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                           indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                           `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                          {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                            <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interpretation - Full Content */}
                                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                      {indicator.interpretation}
                                    </div>

                                    {/* Context Interpretation - Full Content */}
                                    {indicator.context_interpretation && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                        {indicator.context_interpretation}
                                      </div>
                                    )}

                                    {/* Detailed Breakdown - Expandable */}
                                    {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                      <div className="mt-2">
                                        <div className="space-y-0.5">
                                          {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                              • {detail}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>

                                                                                     {/* PCE Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {filteredIndicators
                                .filter(indicator => indicator.name.includes('PCE'))
                                .map((indicator, indicatorIndex) => (
                                 <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {indicator.name}
                                        </h6>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                          {indicator.status}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {indicator.trend_icon && (
                                          <span className="text-base">{indicator.trend_icon}</span>
                                        )}
                                        {indicator.trend && (
                                          <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {indicator.trend}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Current Value - Compact */}
                                    {indicator.current_value !== undefined && indicator.current_value !== null && (
                                      <div className="flex items-center justify-between mb-2 text-xs">
                                        <span className="text-gray-500">Giá trị:</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                          {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                           indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                           `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                          {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                            <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interpretation - Full Content */}
                                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                      {indicator.interpretation}
                                    </div>

                                    {/* Context Interpretation - Full Content */}
                                    {indicator.context_interpretation && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                        {indicator.context_interpretation}
                                      </div>
                                    )}

                                    {/* Detailed Breakdown - Expandable */}
                                    {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                      <div className="mt-2">
                                        <div className="space-y-0.5">
                                          {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                              • {detail}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>

                            {/* ISM PMI Row - Group PMI indicators together */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {filteredIndicators
                                .filter(indicator => 
                                  indicator.name.includes('ISM PMI') || 
                                  indicator.name.includes('PMI')
                                )
                                 .map((indicator, indicatorIndex) => (
                                   <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                     {/* Header Row */}
                                     <div className="flex items-center justify-between mb-2">
                                       <div className="flex items-center space-x-2">
                                         <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                           {indicator.name}
                                         </h6>
                                         <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                           {indicator.status}
                                         </div>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                         {indicator.trend_icon && (
                                           <span className="text-base">{indicator.trend_icon}</span>
                                         )}
                                         {indicator.trend && (
                                           <span className="text-xs text-gray-600 dark:text-gray-400">
                                             {indicator.trend}
                                           </span>
                                         )}
                                       </div>
                                     </div>
                                     
                                     {/* Current Value - Compact */}
                                     {indicator.current_value !== undefined && indicator.current_value !== null && (
                                       <div className="flex items-center justify-between mb-2 text-xs">
                                         <span className="text-gray-500">Giá trị:</span>
                                         <span className="font-semibold text-gray-900 dark:text-gray-100">
                                           {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                            indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                            `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                           {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                             <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                           )}
                                         </span>
                                       </div>
                                     )}

                                     {/* Interpretation - Full Content */}
                                     <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                       {indicator.interpretation}
                                     </div>

                                     {/* Context Interpretation - Full Content */}
                                     {indicator.context_interpretation && (
                                       <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                         {indicator.context_interpretation}
                                       </div>
                                     )}

                                     {/* Detailed Breakdown - Expandable */}
                                     {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                       <div className="mt-2">
                                         <div className="space-y-0.5">
                                           {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                             <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                               • {detail}
                                             </div>
                                           ))}
                                         </div>
                                       </div>
                                     )}
                                   </div>
                                 ))}
                             </div>

                            {/* Other indicators (non-CPI/PCE/PMI) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {filteredIndicators
                                .filter(indicator => 
                                  !indicator.name.includes('CPI') && 
                                  !indicator.name.includes('PCE') && 
                                  !indicator.name.includes('ISM PMI') && 
                                  !indicator.name.includes('PMI')
                                )
                                 .map((indicator, indicatorIndex) => (
                                  <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {indicator.name}
                                        </h6>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                          {indicator.status}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {indicator.trend_icon && (
                                          <span className="text-base">{indicator.trend_icon}</span>
                                        )}
                                        {indicator.trend && (
                                          <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {indicator.trend}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Current Value - Compact */}
                                    {indicator.current_value !== undefined && indicator.current_value !== null && (
                                      <div className="flex items-center justify-between mb-2 text-xs">
                                        <span className="text-gray-500">Giá trị:</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                          {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                           indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                           `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                          {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                            <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interpretation - Full Content */}
                                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                      {indicator.interpretation}
                                    </div>

                                    {/* Context Interpretation - Full Content */}
                                    {indicator.context_interpretation && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                        {indicator.context_interpretation}
                                      </div>
                                    )}

                                    {/* Detailed Breakdown - Expandable */}
                                    {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                      <div className="mt-2">
                                        <div className="space-y-0.5">
                                          {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                              • {detail}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Special layout for macro section with ISM PMI grouping */}
                        {section.type === 'macro' && (
                          <div className="space-y-4">
                            {/* ISM PMI Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {filteredIndicators
                                .filter(indicator => 
                                  indicator.name.includes('ISM PMI') || 
                                  indicator.name.includes('PMI')
                                )
                                .map((indicator, indicatorIndex) => (
                                  <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {indicator.name}
                                        </h6>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                          {indicator.status}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {indicator.trend_icon && (
                                          <span className="text-base">{indicator.trend_icon}</span>
                                        )}
                                        {indicator.trend && (
                                          <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {indicator.trend}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Current Value - Compact */}
                                    {indicator.current_value !== undefined && indicator.current_value !== null && (
                                      <div className="flex items-center justify-between mb-2 text-xs">
                                        <span className="text-gray-500">Giá trị:</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                          {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                           indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                           `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                          {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                            <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interpretation - Full Content */}
                                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                      {indicator.interpretation}
                                    </div>

                                    {/* Context Interpretation - Full Content */}
                                    {indicator.context_interpretation && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                        {indicator.context_interpretation}
                                      </div>
                                    )}

                                    {/* Detailed Breakdown - Expandable */}
                                    {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                      <div className="mt-2">
                                        <div className="space-y-0.5">
                                          {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                              • {detail}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>

                            {/* Other macro indicators (non-PMI) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {filteredIndicators
                                .filter(indicator => 
                                  !indicator.name.includes('ISM PMI') && 
                                  !indicator.name.includes('PMI')
                                )
                                .map((indicator, indicatorIndex) => (
                                  <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {indicator.name}
                                        </h6>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                          {indicator.status}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {indicator.trend_icon && (
                                          <span className="text-base">{indicator.trend_icon}</span>
                                        )}
                                        {indicator.trend && (
                                          <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {indicator.trend}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Current Value - Compact */}
                                    {indicator.current_value !== undefined && indicator.current_value !== null && (
                                      <div className="flex items-center justify-between mb-2 text-xs">
                                        <span className="text-gray-500">Giá trị:</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                          {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                           indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                           `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                          {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                            <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {/* Interpretation - Full Content */}
                                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                      {indicator.interpretation}
                                    </div>

                                    {/* Context Interpretation - Full Content */}
                                    {indicator.context_interpretation && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                        {indicator.context_interpretation}
                                      </div>
                                    )}

                                    {/* Detailed Breakdown - Expandable */}
                                    {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                      <div className="mt-2">
                                        <div className="space-y-0.5">
                                          {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                              • {detail}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Default layout for other sections */}
                        {section.type !== 'inflation' && section.type !== 'macro' && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {filteredIndicators.map((indicator, indicatorIndex) => (
                              <div key={indicatorIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                                {/* Header Row */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {indicator.name}
                                    </h6>
                                    <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(indicator.status)} ${getStatusColor(indicator.status)}`}>
                                      {indicator.status}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {indicator.trend_icon && (
                                      <span className="text-base">{indicator.trend_icon}</span>
                                    )}
                                    {indicator.trend && (
                                      <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {indicator.trend}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Current Value - Compact */}
                                {indicator.current_value !== undefined && indicator.current_value !== null && (
                                  <div className="flex items-center justify-between mb-2 text-xs">
                                    <span className="text-gray-500">Giá trị:</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                      {indicator.unit === '%' ? formatPercentage(indicator.current_value / 100, 2) : 
                                       indicator.unit === 'USD' || indicator.unit === 'USD/barrel' || indicator.unit === 'USD/lb' ? formatCurrency(indicator.current_value) :
                                       `${typeof indicator.current_value === 'number' ? indicator.current_value.toFixed(2) : indicator.current_value}`}
                                      {indicator.unit && indicator.unit !== '%' && indicator.unit !== 'USD' && indicator.unit !== 'USD/barrel' && indicator.unit !== 'USD/lb' && (
                                        <span className="ml-1 text-gray-500">{indicator.unit}</span>
                                      )}
                                    </span>
                                  </div>
                                )}

                                {/* Interpretation - Full Content */}
                                <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">
                                  {indicator.interpretation}
                                </div>

                                {/* Context Interpretation - Full Content */}
                                {indicator.context_interpretation && (
                                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 whitespace-pre-line">
                                    {indicator.context_interpretation}
                                  </div>
                                )}

                                {/* Detailed Breakdown - Expandable */}
                                {indicator.detailed_breakdown && indicator.detailed_breakdown.length > 0 && (
                                  <div className="mt-2">
                                    <div className="space-y-0.5">
                                      {indicator.detailed_breakdown.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                          • {detail}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

                                                                                                                       {/* Commodities - Compact Stacked Layout */}
                 {section.commodities && section.commodities.length > 0 && (
                   <div className="mb-4">
                     <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-200 dark:border-gray-700 pb-1">
                       🏭 Hàng hóa ({section.commodities.length}):
                     </h5>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                       {section.commodities.map((commodity, commodityIndex) => (
                         <div key={commodityIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                                       {/* Header with icon, name, price, and impact tag */}
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center space-x-1 flex-1 min-w-0">
                                <span className="text-sm flex-shrink-0">
                                  {commodity.symbol === 'oil' && '🛢️'}
                                  {commodity.symbol === 'natural_gas' && '🔥'}
                                  {commodity.symbol === 'copper' && '🔧'}
                                  {commodity.symbol === 'corn' && '🌽'}
                                  {commodity.symbol === 'wheat' && '🌾'}
                                  {commodity.symbol === 'cotton' && '🏳️'}
                                  {commodity.symbol === 'soybeans' && '🫘'}
                                </span>
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 break-words">
                                  {commodity.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {formatCurrency(commodity.price, commodity.currency)}
                                </span>
                                {/* Impact tag based on trends */}
                                {(commodity.short_term_trend?.includes('tăng') || commodity.medium_term_trend?.includes('tăng')) && (
                                  <span className="px-1 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                                    +
                                  </span>
                                )}
                                {(commodity.short_term_trend?.includes('giảm') || commodity.medium_term_trend?.includes('giảm')) && (
                                  <span className="px-1 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                    -
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Trends in compact format */}
                            <div className="space-y-0.5">
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-gray-500 flex-shrink-0">Ngắn hạn:</span>
                                <span className={`font-medium text-right ${commodity.short_term_trend?.includes('tăng') ? 'text-green-600 dark:text-green-400' : commodity.short_term_trend?.includes('giảm') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {commodity.short_term_trend?.includes('tăng') ? '↗' : commodity.short_term_trend?.includes('giảm') ? '↘' : '→'} {commodity.short_term_trend || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-gray-500 flex-shrink-0">Trung hạn:</span>
                                <span className={`font-medium text-right ${commodity.medium_term_trend?.includes('tăng') ? 'text-green-600 dark:text-green-400' : commodity.medium_term_trend?.includes('giảm') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {commodity.medium_term_trend?.includes('tăng') ? '↗' : commodity.medium_term_trend?.includes('giảm') ? '↘' : '→'} {commodity.medium_term_trend || 'N/A'}
                                </span>
                              </div>
                            </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default TopdownInsightsSection;
