import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { 
  loadRRGData, 
  getAvailableIndustries, 
  getAvailableGroups,
  getTickersByIndustry, 
  getIndustryData,
  getGroupData,
  getTickerIndustry 
} from '../utils/rrgDataLoader';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";



// Custom Tooltip Component - Compact Design
const CustomTooltip = ({ data, x, y }) => {
  if (!data) return null;
  
  return (
    <div 
      className="absolute px-3 py-2 bg-gray-900/95 backdrop-blur-sm shadow-xl rounded-md border border-gray-700 text-white text-xs z-50 pointer-events-none"
      style={{
        left: x + 10,
        top: y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="font-semibold text-sm mb-1">
        {typeof data.name === 'string' ? data.name : String(data.name || 'Unknown')}
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Tỷ số RS:</span>
          <span className="font-mono">{data.x.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">RS-Mom:</span>
          <span className="font-mono">{data.y.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Ngày:</span>
          <span>{data.date}</span>
        </div>
      </div>
    </div>
  );
};

// Generate consistent color for each series
const getSeriesColor = (id, index, total) => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 50%)`;
};

// Custom dot component for trail points
const CustomDot = (props) => {
  const { cx, cy, payload, color, onHover } = props;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isHovered ? 4 : 3}
      fill={color}
      fillOpacity={isHovered ? 0.8 : 0.4}
      stroke={color}
      strokeWidth={isHovered ? 1 : 0}
      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover(payload, cx, cy);
      }}
      onMouseMove={(e) => {
        e.stopPropagation();
      }}
    />
  );
};

// Custom Multi-Select with Checkboxes for Industry Filtering
function IndustryMultiSelect({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleToggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((v) => v !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="relative min-w-[200px]" ref={ref}>
      <button
        type="button"
        className="w-full border rounded px-2 py-1 text-sm bg-gray-800 text-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0
          ? "Chọn ngành"
          : selected.length === 1
          ? options.find((o) => o.id === selected[0])?.name
          : `${selected.length} ngành`}
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => handleToggle(option.id)}
                className="accent-blue-500 mr-2"
              />
              <span className="text-white">{option.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// A component for the zoom controls
const ZoomControls = ({ onZoomIn, onZoomOut, onReset, zoomLevel }) => {
  const buttonClass = "w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
      <button onClick={onZoomIn} className={buttonClass} disabled={zoomLevel >= 10}>+</button>
      <button onClick={onZoomOut} className={buttonClass} disabled={zoomLevel <= 1}>-</button>
      <button onClick={onReset} className={buttonClass} disabled={zoomLevel === 1}>⟲</button>
    </div>
  );
};

// RRG Chart Component
export default function RRGChart({ type = 'industries', timeframe = '1D' }) {
  
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

  const handleResetZoom = () => setZoom(1);

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

  const rrgData = useMemo(() => {
    try {
      return loadRRGData(timeframe);
    } catch (error) {
      console.error('Error loading RRG data in component:', error);
      return null;
    }
  }, [timeframe]);
  
  const availableIndustries = useMemo(() => {
    return getAvailableIndustries(timeframe);
  }, [timeframe]);
  
  const availableGroups = useMemo(() => {
    return getAvailableGroups(timeframe);
  }, [timeframe]);

  // Ensure a default industry is always selected for stock RRG when special filter is 'all'
  useEffect(() => {
    if (
      type === 'tickers' &&
      specialTickerFilter === 'all' &&
      (!selectedTickerIndustries.length) &&
      availableIndustries.length > 0
    ) {
      setSelectedTickerIndustries([availableIndustries[0].id]);
    }
  }, [type, specialTickerFilter, selectedTickerIndustries, availableIndustries]);

  const filteredData = useMemo(() => {
    if (type === 'industries') {
      const selected = selectedIndustries.length > 0 ? selectedIndustries : rrgData.industries.map(i => i.custom_id);
      return getIndustryData(selected, timeframe);
    } else if (type === 'groups') {
      const selected = selectedGroups.length > 0 ? selectedGroups : rrgData.groups.map(g => g.custom_id);
      return getGroupData(selected, timeframe);
    } else {
      // Ticker filtering logic with special filter
      if (specialTickerFilter && specialTickerFilter !== 'all') {
        const allTickers = rrgData.symbols;
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
        const selected = selectedTickerIndustries.length > 0 ? selectedTickerIndustries : [availableIndustries[0]?.id].filter(Boolean);
        const filtered = getTickersByIndustry(selected, timeframe);
        

        
        return filtered;
      }
    }
  }, [type, selectedIndustries, selectedGroups, selectedTickerIndustries, specialTickerFilter, rrgData, availableIndustries, timeframe]);

  // Limit the number of series to prevent chart freeze
  const MAX_SERIES = 50;
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
    return limitedData.map((series, index) => {
      const latest = series.tail?.[series.tail.length - 1];
      const tickerIndustry = type === 'tickers' ? getTickerIndustry(series.symbol || series.custom_id, timeframe) : null;
      

      
      const result = {
        ...latest,
        name: typeof series.name === 'string' ? series.name : String(series.name || series.symbol || 'Unknown'),
        id: series.symbol || series.custom_id,
        type: type,
        industry: tickerIndustry?.name || null,
        color: getSeriesColor(series.symbol || series.custom_id, index, limitedData.length),
        seriesIndex: index
      };
      

      
      return result;
    });
  }, [limitedData, type, timeframe]);

  if (!rrgData) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 text-lg font-medium">Error loading RRG data</div>
        <div className="text-gray-600 mt-2">Please check the console for more details</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 text-lg font-medium">Error in RRG Chart</div>
        <div className="text-gray-600 mt-2">{error}</div>
        <button 
          onClick={() => setError(null)} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
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
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Trail Length:</label>
          <select
            value={trailLength}
            onChange={e => setTrailLength(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black cursor-pointer"
          >
            <option value={0}>None</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={21}>21</option>
          </select>
        </div>
        
        {type === 'industries' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by:</label>
            <MultiSelect
              options={availableIndustries.map(ind => ({ value: ind.id, label: ind.name }))}
              onValueChange={setSelectedIndustries}
              defaultValue={selectedIndustries}
              placeholder="Chọn ngành"
              maxCount={3}
              variant="default"
            />
            {selectedIndustries.length > 0 && (
              <span className="text-xs text-gray-500">
                Showing {filteredData.length} industries
              </span>
            )}
          </div>
        )}
        
        {type === 'groups' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by:</label>
            <MultiSelect
              options={availableGroups.map(group => ({ value: group.id, label: group.name }))}
              onValueChange={setSelectedGroups}
              defaultValue={selectedGroups}
              placeholder="Chọn nhóm"
              maxCount={3}
              variant="default"
            />
            {selectedGroups.length > 0 && (
              <span className="text-xs text-gray-500">
                Showing {filteredData.length} groups
              </span>
            )}
          </div>
        )}
        
        {type === 'tickers' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by:</label>
            <select
              value={specialTickerFilter}
              onChange={e => setSpecialTickerFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black cursor-pointer"
            >
              <option value="all">By Industry</option>
              <option value="top10rs">Top 10 RS Score</option>
              <option value="bottom10rs">Bottom 10 RS Score</option>
              <option value="top10momentum">Top 10 RS Momentum</option>
              <option value="bottom10momentum">Bottom 10 RS Momentum</option>
            </select>
            {specialTickerFilter === 'all' && (
              <select
                value={selectedTickerIndustries[0]}
                onChange={e => setSelectedTickerIndustries([e.target.value])}
                className="border rounded px-2 py-1 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black cursor-pointer"
              >
                {availableIndustries.map(industry => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>
            )}
            {specialTickerFilter !== 'all' ? (
              <span className="text-xs text-blue-600 font-medium">
                {(() => {
                  switch (specialTickerFilter) {
                    case 'top10rs': return 'Top 10 RS Score';
                    case 'bottom10rs': return 'Bottom 10 RS Score';
                    case 'top10momentum': return 'Top 10 RS Momentum';
                    case 'bottom10momentum': return 'Bottom 10 RS Momentum';
                    default: return '';
                  }
                })()}
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                Showing {filteredData.length} tickers
              </span>
            )}
          </div>
        )}
      </div>

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
                      const tickerIndustry = type === 'tickers' ? getTickerIndustry(series.symbol, timeframe) : null;
                      
                      return {
                        ...point,
                        name: typeof series.name === 'string' ? series.name : String(series.name || series.symbol || 'Unknown'),
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
                  const isHovered = hoveredPoint?.id === payload.id && hoveredPoint?.name === payload.name;

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

      <div className="space-y-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>RS-Ratio (X-axis):</strong> Relative performance trend vs VNINDEX (values &gt;100 = outperforming, &lt;100 = underperforming)</p>
          <p><strong>RS-Momentum (Y-axis):</strong> Rate of change in relative performance (values &gt;100 = improving momentum, &lt;100 = weakening)</p>
          <p><strong>Quadrants:</strong> Leading (top-right), Weakening (bottom-right), Lagging (bottom-left), Improving (top-left)</p>
        </div>
        
        {limitedData.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Series:</p>
            <div className="flex flex-wrap gap-2">
              {limitedData.map((series, index) => (
                <div key={series.symbol || series.custom_id} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getSeriesColor(series.symbol || series.custom_id, index, limitedData.length) }}
                  />
                  <span className="text-gray-600">
                    {typeof series.name === 'string' ? series.name : String(series.name || series.symbol || 'Unknown')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}