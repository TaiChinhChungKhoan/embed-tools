import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import {
  ComposedChart,
  Scatter,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { cacheUtils } from '../../utils/dataLoader';

// Import sub-components
import CustomTooltip from './CustomTooltip';
import CustomDot from './CustomDot';
import ZoomControls from './ZoomControls';
import RRGChartControls from './RRGChartControls';
import RRGChartLegend from './RRGChartLegend';
import DetailedInfoPanel from './DetailedInfoPanel';
import { getSeriesColor, MAX_SERIES } from './utils';
import { useTickerInfoWithData } from '../../utils/dataLoader';
import { DataReloadContext } from '../../contexts/DataReloadContext';

// RRG Chart Component
export default function RRGChart(props) {
  const { type = 'industries', timeframe, analyticsData } = props;
  
  // Get pre-loaded data from context
  const { companies, industries, essentialDataLoading, essentialDataError } = useContext(DataReloadContext);
  
  // Use the pre-loaded data for ticker info
  const { getTickerInfo, getIndustryTickers, loading: tickerInfoLoading } = useTickerInfoWithData(companies, industries);
  
  // Use the pre-loaded industries data directly
  const availableIndustries = industries || [];

  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTickerIndustries, setSelectedTickerIndustries] = useState([]);
  const [specialTickerFilter, setSpecialTickerFilter] = useState("all");
  const [trailLength, setTrailLength] = useState(10);
  const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 600 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(null);

  // Show loading state if ticker info is still loading
  if (essentialDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (essentialDataError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi: {essentialDataError}</div>
      </div>
    );
  }

  const handleResetZoom = () => setZoom(1);

  // Clear cache for industries and companies to remove processed_at
  useEffect(() => {
    // Clear specific cache entries that might contain processed_at
    const cacheKeys = Array.from(cacheUtils.getCacheKeys());
    cacheKeys.forEach(key => {
      if (key.includes('industries') || key.includes('companies')) {
        cacheUtils.removeFromCache(key);
      }
    });
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const size = Math.min(containerWidth - 32, 800);
        setChartDimensions({ width: size, height: size });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Use passed analyticsData instead of loading it again
  const { groups: availableGroups = [], symbols: availableSymbols = [], industries: analyticsIndustries = [] } = analyticsData || {};

  // Ensure arrays are properly initialized
  const safeAvailableIndustries = Array.isArray(availableIndustries) ? availableIndustries : [];
  const safeAvailableGroups = Array.isArray(availableGroups) ? availableGroups : [];
  const safeAvailableSymbols = Array.isArray(availableSymbols) ? availableSymbols : [];
  const safeAnalyticsIndustries = Array.isArray(analyticsIndustries) ? analyticsIndustries : [];
  
  // Additional safety check - if any of the safe arrays are still problematic, use empty arrays
  const finalAvailableIndustries = safeAvailableIndustries && typeof safeAvailableIndustries.slice === 'function' ? safeAvailableIndustries : [];
  const finalAvailableGroups = safeAvailableGroups && typeof safeAvailableGroups.slice === 'function' ? safeAvailableGroups : [];
  const finalAvailableSymbols = safeAvailableSymbols && typeof safeAvailableSymbols.slice === 'function' ? safeAvailableSymbols : [];
  const finalAnalyticsIndustries = safeAnalyticsIndustries && typeof safeAnalyticsIndustries.slice === 'function' ? safeAnalyticsIndustries : [];
  
  // Convert object-based industries to array for compatibility with existing code
  const industriesArray = availableIndustries && typeof availableIndustries === 'object' && !Array.isArray(availableIndustries) 
    ? Object.entries(availableIndustries).map(([custom_id, industry]) => ({ custom_id, ...industry }))
    : finalAvailableIndustries;

  // Ensure a default industry is always selected for stock RRG when special filter is 'all'
  useEffect(() => {
    if (
      type === 'tickers' &&
      specialTickerFilter === 'all' &&
      (!selectedTickerIndustries.length) &&
      industriesArray.length > 0
    ) {
      setSelectedTickerIndustries([industriesArray[0].custom_id]);
    }
  }, [type, specialTickerFilter, industriesArray, selectedTickerIndustries.length]);

  // Auto-select all industries on initial load if none selected
  useEffect(() => {
    if (
      type === 'industries' &&
      selectedIndustries.length === 0 &&
      industriesArray.length > 0
    ) {
      setSelectedIndustries(industriesArray.map(ind => ind.custom_id));
    }
  }, [type, industriesArray, selectedIndustries.length]);

  useEffect(() => {
    if (
      type === 'groups' &&
      selectedGroups.length === 0 &&
      finalAvailableGroups.length > 0
    ) {
      setSelectedGroups(finalAvailableGroups.map(g => g.custom_id));
    }
  }, [type, selectedGroups, finalAvailableGroups]);
  
  const filteredData = useMemo(() => {
    if (type === 'industries') {
      // If no industries are selected, show all industries
      if (selectedIndustries.length === 0) {
        return finalAnalyticsIndustries || [];
      }
      // If industries are selected, filter by selection
      return (finalAnalyticsIndustries || []).filter(ind => selectedIndustries.includes(ind.custom_id));
    } else if (type === 'groups') {
      // If no groups are selected, show all groups
      if (selectedGroups.length === 0) {
        return finalAvailableGroups || [];
      }
      // If groups are selected, filter by selection
      return (finalAvailableGroups || []).filter(group => selectedGroups.includes(group.custom_id));
    } else {
      // Ticker filtering logic with special filter
      if (specialTickerFilter && specialTickerFilter !== 'all') {
        const allTickers = finalAvailableSymbols;
        if (specialTickerFilter === 'top10rs') {
          // Top 10 by RS Score (latest x value)
          return allTickers
            .map(ticker => ({ ...ticker, latestRS: ticker.tail?.[ticker.tail.length - 1]?.x || 0 }))
            .sort((a, b) => b.latestRS - a.latestRS)
            .slice(0, 10);
        } else if (specialTickerFilter === 'bottom10rs') {
          return allTickers
            .map(ticker => ({ ...ticker, latestRS: ticker.tail?.[ticker.tail.length - 1]?.x || 0 }))
            .sort((a, b) => a.latestRS - b.latestRS)
            .slice(0, 10);
        } else if (specialTickerFilter === 'top10momentum') {
          // Top 10 by RS Momentum (latest y value)
          return allTickers
            .map(ticker => ({ ...ticker, latestMomentum: ticker.tail?.[ticker.tail.length - 1]?.y || 0 }))
            .sort((a, b) => b.latestMomentum - a.latestMomentum)
            .slice(0, 10);
        } else if (specialTickerFilter === 'bottom10momentum') {
          return allTickers
            .map(ticker => ({ ...ticker, latestMomentum: ticker.tail?.[ticker.tail.length - 1]?.y || 0 }))
            .sort((a, b) => a.latestMomentum - b.latestMomentum)
            .slice(0, 10);
        }
        return [];
      } else {
              // Only show by industry, never all
      const filtered = selectedTickerIndustries.length > 0
        ? (finalAvailableSymbols || []).filter(symbol => {
            // For now, fall back to the original embedded industry data until we have proper mapping
            return symbol.industries && symbol.industries.some(ind => selectedTickerIndustries.includes(ind.custom_id));
          })
        : (finalAvailableSymbols || []);
        return filtered;
      }
    }
  }, [type, selectedIndustries, selectedGroups, selectedTickerIndustries, specialTickerFilter, finalAvailableSymbols, finalAvailableIndustries, finalAvailableGroups, finalAnalyticsIndustries]);

  // Determine which items to show detailed information for
  const selectedItemsForDetails = useMemo(() => {
    if (type === 'industries') {
          // For industry RRG: show details for selected industries
    const selectedIndustryData = selectedIndustries.length > 0 
      ? (finalAnalyticsIndustries || []).filter(ind => selectedIndustries.includes(ind.custom_id))
      : (finalAnalyticsIndustries || []).slice(0, 5); // Show first 5 if none selected
    
    // Ensure unique industries by custom_id to prevent duplicates
    const uniqueIndustries = selectedIndustryData.filter((industry, index, self) => 
      index === self.findIndex(ind => ind.custom_id === industry.custom_id)
    );
      
      return uniqueIndustries.map(ind => {
        // Add the industry name from metadata
        const industryMetadata = industriesArray.find(meta => meta.custom_id === ind.custom_id);
        return { 
          ...ind, 
          type: 'industry',
          name: industryMetadata?.name || ind.custom_id
        };
      });
    } else if (type === 'groups') {
      // For group RRG: show details for selected groups
      const selectedGroupData = selectedGroups.length > 0 
        ? (finalAvailableGroups || []).filter(group => selectedGroups.includes(group.custom_id))
        : (finalAvailableGroups || []).slice(0, 3); // Show first 3 if none selected
      return selectedGroupData.map(group => ({ 
        ...group, 
        type: 'group',
        name: group.name || group.custom_id
      }));
    } else if (type === 'tickers') {
      // Create symbol data directly from filteredData to avoid circular dependency
      if (!filteredData || filteredData.length === 0) return [];
      
      if (specialTickerFilter === 'all' && selectedTickerIndustries.length > 0) {
        // When filtering by industry: show both industry and symbol details
        const selectedIndustryData = (finalAvailableIndustries || []).filter(ind => selectedTickerIndustries.includes(ind.custom_id))
          .map(ind => ({ 
            ...ind, 
            type: 'industry',
            name: ind.name || ind.custom_id
          }));
        const symbolData = filteredData.slice(0, MAX_SERIES).map(series => ({
          ...series,
          id: series.symbol || series.custom_id,
          name: series.symbol || series.custom_id, // Use symbol or custom_id as name
          type: 'symbol'
        }));
        return [...selectedIndustryData, ...symbolData];
      } else {
        // When using special filters: only show symbol details
        const symbolData = filteredData.slice(0, MAX_SERIES).map(series => ({
          ...series,
          id: series.symbol || series.custom_id,
          name: series.symbol || series.custom_id, // Use symbol or custom_id as name
          type: 'symbol'
        }));
        return symbolData;
      }
    } else {
      return [];
    }
  }, [type, selectedIndustries, selectedGroups, selectedTickerIndustries, specialTickerFilter, finalAvailableIndustries, finalAvailableGroups, finalAnalyticsIndustries, filteredData]);

  // Limit the number of series to prevent chart freeze
  const limitedData = filteredData.slice(0, MAX_SERIES);

  const { domainX, domainY } = useMemo(() => {
    const allX = limitedData.flatMap(series => series.tail?.map(point => point.x) || []);
    const allY = limitedData.flatMap(series => series.tail?.map(point => point.y) || []);
    
    // Handle empty data case
    if (allX.length === 0 || allY.length === 0) {
      return {
        domainX: [90, 110],
        domainY: [90, 110]
      };
    }
    
    const xRange = Math.max(...allX.map(x => Math.abs(x - 100)));
    const yRange = Math.max(...allY.map(y => Math.abs(y - 100)));
    
    const maxRange = Math.max(xRange, yRange) * 1.1;
    const zoomedRange = maxRange / zoom;
    
    return {
      domainX: [100 - zoomedRange, 100 + zoomedRange],
      domainY: [100 - zoomedRange, 100 + zoomedRange]
    };
  }, [limitedData, zoom]);

  const latestPoints = useMemo(() => {
    if (!limitedData || limitedData.length === 0) return [];
    
    return limitedData.map((series, index) => {
      const latest = series.tail?.[series.tail.length - 1];
      const tickerInfo = getTickerInfo(series.symbol || series.custom_id);
      const tickerIndustry = tickerInfo?.industry_id ? getIndustryTickers(tickerInfo.industry_id) : null;
      
      // Get the proper name based on type
      let displayName;
      if (type === 'industries') {
        // For industries, use the looked up industry name from metadata
        const industry = industriesArray.find(ind => ind.custom_id === series.custom_id);
        displayName = industry?.name || series.custom_id;
      } else if (type === 'groups') {
        // For groups, use the looked up group name
        const group = finalAvailableGroups.find(g => g.custom_id === series.custom_id);
        displayName = group?.name || series.custom_id;
      } else {
        // For tickers, use symbol or custom_id
        displayName = series.symbol || series.custom_id;
      }
      
      const result = {
        ...latest,
        name: displayName,
        id: series.symbol || series.custom_id,
        type: type,
        industry: tickerIndustry?.name || null,
        color: getSeriesColor(series.symbol || series.custom_id, index, limitedData.length),
        seriesIndex: index
      };
      
      return result;
    });
  }, [limitedData, type, finalAvailableIndustries, finalAvailableGroups, getTickerInfo, getIndustryTickers, industriesArray]);

  // Show error state if no data arrays
  if (!finalAvailableIndustries || !finalAvailableGroups || !finalAvailableSymbols) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 text-lg font-medium">Không có dữ liệu RRG</div>
        <div className="text-gray-600 mt-2">Vui lòng kiểm tra lại sau</div>
      </div>
    );
  }

  // Check if analyticsData has the expected structure
  if (!analyticsData || !analyticsData.industries) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 text-lg font-medium">Dữ liệu RRG không đúng định dạng</div>
        <div className="text-gray-600 mt-2">Thiếu dữ liệu ngành nghề trong analyticsData</div>
        <div className="text-xs text-gray-500 mt-2">
          analyticsData: {JSON.stringify(analyticsData ? Object.keys(analyticsData) : 'null')}
        </div>
      </div>
    );
  }

  // Check if industries data has the required tail property
  const industriesWithTail = finalAnalyticsIndustries.filter(ind => ind.tail && Array.isArray(ind.tail) && ind.tail.length > 0);
  if (type === 'industries' && industriesWithTail.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 text-lg font-medium">Dữ liệu RRG ngành nghề không có tọa độ</div>
        <div className="text-gray-600 mt-2">Thiếu thuộc tính 'tail' với tọa độ x,y trong dữ liệu ngành nghề</div>
        <div className="text-xs text-gray-500 mt-2">
          Tổng số ngành: {finalAnalyticsIndustries.length}, Có tail: {industriesWithTail.length}
        </div>
      </div>
    );
  }

  if (type === 'tickers' && selectedTickerIndustries.length > 0 && filteredData.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-orange-600 text-lg font-medium">No tickers found</div>
        <div className="text-gray-600 mt-2">
          No tickers found for the selected industries: {selectedTickerIndustries.join(', ')}
        </div>
        <div className="text-gray-500 mt-1 text-sm">
          Try selecting different industries or clear the filter to see top/bottom performers.
        </div>
        <button
          onClick={() => setSelectedTickerIndustries([])}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
        >
          Clear Filter & Show Top/Bottom Performers
        </button>
      </div>
    );
  }

  // Don't render if no data
  if (limitedData.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-orange-600 text-lg font-medium">No data available</div>
        <div className="text-gray-600 mt-2">
          No {type} data found for the current selection. Try changing filters or timeframe.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <RRGChartControls
        type={type}
        trailLength={trailLength}
        setTrailLength={setTrailLength}
        selectedIndustries={selectedIndustries}
        setSelectedIndustries={setSelectedIndustries}
        selectedGroups={selectedGroups}
        setSelectedGroups={setSelectedGroups}
        selectedTickerIndustries={selectedTickerIndustries}
        setSelectedTickerIndustries={setSelectedTickerIndustries}
        specialTickerFilter={specialTickerFilter}
        setSpecialTickerFilter={setSpecialTickerFilter}
        availableIndustries={industriesArray}
        availableGroups={finalAvailableGroups}
        filteredData={filteredData}
      />

      <div ref={containerRef} className="w-full flex justify-center">
        <div 
          ref={chartRef}
          className="border rounded-lg p-4 bg-white shadow-sm relative"
          style={{ width: chartDimensions.width + 32, height: chartDimensions.height + 32 }}
        >
          <ZoomControls 
            onZoomIn={() => setZoom(z => Math.min(z * 1.5, 10))}
            onZoomOut={() => setZoom(z => Math.max(z / 1.5, 1))}
            onReset={handleResetZoom}
            zoomLevel={zoom}
          />
          <ResponsiveContainer width={chartDimensions.width} height={chartDimensions.height}>
            <ComposedChart 
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              onMouseMove={() => {
                setHoveredPoint(null);
              }}
              onMouseLeave={() => {
                setHoveredPoint(null);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              {/* Quadrant backgrounds with unique keys for zoom */}
              <ReferenceArea 
                key={`leading-${zoom}`}
                x1={100} x2={domainX[1]} y1={100} y2={domainY[1]} 
                fill="#10b981" fillOpacity={0.08}
              >
                <Label value="Leading" position="center" fill="#10b981" fontSize={16} fontWeight="600" />
              </ReferenceArea>
              <ReferenceArea 
                key={`weakening-${zoom}`}
                x1={100} x2={domainX[1]} y1={domainY[0]} y2={100} 
                fill="#f59e0b" fillOpacity={0.08}
              >
                <Label value="Weakening" position="center" fill="#f59e0b" fontSize={16} fontWeight="600" />
              </ReferenceArea>
              <ReferenceArea 
                key={`lagging-${zoom}`}
                x1={domainX[0]} x2={100} y1={domainY[0]} y2={100} 
                fill="#ef4444" fillOpacity={0.08}
              >
                <Label value="Lagging" position="center" fill="#ef4444" fontSize={16} fontWeight="600" />
              </ReferenceArea>
              <ReferenceArea 
                key={`improving-${zoom}`}
                x1={domainX[0]} x2={100} y1={100} y2={domainY[1]} 
                fill="#3b82f6" fillOpacity={0.08}
              >
                <Label value="Improving" position="center" fill="#3b82f6" fontSize={16} fontWeight="600" />
              </ReferenceArea>

              <ReferenceLine x={100} stroke="#6b7280" strokeWidth={2} />
              <ReferenceLine y={100} stroke="#6b7280" strokeWidth={2} />

              <XAxis 
                dataKey="x" 
                type="number" 
                domain={domainX} 
                label={{ value: 'RS-Ratio (Trend)', position: 'insideBottom', offset: -10 }} 
                tickFormatter={(value) => value.toFixed(0)}
                ticks={[domainX[0], 95, 100, 105, domainX[1]].filter(t => t >= domainX[0] && t <= domainX[1])}
              />
              <YAxis 
                dataKey="y" 
                type="number" 
                domain={domainY} 
                label={{ value: 'RS-Momentum', angle: -90, position: 'insideLeft' }} 
                tickFormatter={(value) => value.toFixed(0)}
                ticks={[domainY[0], 95, 100, 105, domainY[1]].filter(t => t >= domainY[0] && t <= domainY[1])}
              />

              {/* Trails with dots */}
              {trailLength > 0 && limitedData.map((series, index) => {
                const color = getSeriesColor(series.symbol || series.custom_id, index, limitedData.length);
                return (
                  <Line
                    key={`trail-${series.symbol || series.custom_id}`}
                    data={series.tail?.slice(-trailLength).map(point => {
                      const tickerInfo = getTickerInfo(series.symbol || series.custom_id);
                      const tickerIndustry = tickerInfo?.industry_id ? getIndustryTickers(tickerInfo.industry_id) : null;
                      
                      // Get the proper name based on type
                      let displayName;
                      if (type === 'industries') {
                        const industry = industriesArray.find(ind => ind.custom_id === series.custom_id);
                        displayName = industry?.name || series.custom_id;
                      } else if (type === 'groups') {
                        const group = finalAvailableGroups.find(g => g.custom_id === series.custom_id);
                        displayName = group?.name || series.custom_id;
                      } else {
                        displayName = series.symbol || series.custom_id;
                      }
                      
                      return {
                        ...point,
                        name: displayName,
                        date: point.date,
                        industry: type === 'tickers' ? tickerIndustry?.name || null : null
                      };
                    }) || []}
                    type="monotone"
                    dataKey="y"
                    stroke={color}
                    dot={({ key, ...restProps }) => (
                      <CustomDot 
                        key={key}
                        {...restProps} 
                        color={color}
                        onHover={(payload, cx, cy) => {
                          setHoveredPoint(payload);
                          setMousePosition({ x: cx, y: cy });
                        }}
                      />
                    )}
                    isAnimationActive={false}
                    strokeWidth={2}
                    opacity={0.4}
                  />
                );
              })}

              {/* Latest points (larger dots) */}
              <Scatter
                data={latestPoints}
                dataKey="y"
                name="Latest"
                shape={(props) => {
                  const { cx, cy, payload } = props;
                  const { name, color } = payload;
                  const isHovered = hoveredPoint?.custom_id === payload.custom_id && hoveredPoint?.name === payload.name;

                  return (
                    <g
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setHoveredPoint(payload);
                        setMousePosition({ x: cx, y: cy });
                      }}
                      onMouseMove={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* Invisible hover target */}
                      <circle cx={cx} cy={cy} r={12} fill="transparent" />
                      {/* Main dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 7 : 5}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                        style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 10 : 7}
                        fill="none"
                        stroke={color}
                        strokeWidth={isHovered ? 2 : 1}
                        opacity={isHovered ? 0.8 : 0.5}
                        style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                      />
                      {/* Text label */}
                      <text
                        x={cx + 12}
                        y={cy + 4}
                        fontSize="11px"
                        fontWeight="500"
                        fill="#333"
                        textAnchor="start"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {String(name)}
                      </text>
                    </g>
                  );
                }}
              />

              {/* Remove the default Recharts tooltip */}
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Custom tooltip rendered outside the chart */}
          {hoveredPoint && (
            <CustomTooltip 
              data={hoveredPoint} 
              x={mousePosition.x} 
              y={mousePosition.y} 
            />
          )}
        </div>
      </div>

      <RRGChartLegend 
        limitedData={limitedData} 
        getSeriesColor={getSeriesColor} 
        type={type}
        availableIndustries={industriesArray}
        availableGroups={finalAvailableGroups}
      />

      {/* RRG Reading Guide */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn đọc RRG</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Các góc phần tư</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium text-green-600">Dẫn đầu:</span> Vượt trội với động lượng tích cực</li>
              <li><span className="font-medium text-yellow-600">Suy yếu:</span> Vượt trội nhưng động lượng giảm</li>
              <li><span className="font-medium text-red-600">Tụt hậu:</span> Kém hiệu quả với động lượng tiêu cực</li>
              <li><span className="font-medium text-blue-600">Cải thiện:</span> Kém hiệu quả nhưng động lượng tăng</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Chỉ số</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium">Tỷ số RS:</span> Sức mạnh tương đối hiện tại so với VN-Index</li>
              <li><span className="font-medium">CRS:</span> Sức mạnh tương đối tích lũy trong 21 kỳ</li>
              <li><span className="font-medium">Vệt:</span> Đường đi lịch sử thể hiện sự xoay chuyển theo thời gian</li>
              <li><span className="font-medium">Màu sắc:</span> Dựa trên thời lượng dữ liệu (xanh = ngắn, đỏ = dài)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Info Panel */}
      <DetailedInfoPanel
        selectedItems={selectedItemsForDetails}
        hoveredPoint={hoveredPoint}
        mousePosition={mousePosition}
        onClose={() => setHoveredPoint(null)}
        getSeriesColor={getSeriesColor} 
        type={type}
        timeframe={timeframe}
        availableIndustries={industriesArray}
        availableGroups={finalAvailableGroups}
      />
    </div>
  );
} 