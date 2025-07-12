import React, { useState, useEffect, useRef } from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Card } from '@embed-tools/components';
import { createChart, LineSeries, HistogramSeries, BarSeries } from 'lightweight-charts';
import { useDataLoader } from '../hooks/useDataLoader';
import { PieChart, Pie, Cell } from 'recharts';

const MarketWave = () => {
  const [selectedIndicator, setSelectedIndicator] = useState('cho_mua');
  const [showSmoothed, setShowSmoothed] = useState(true);
  const [chartInitialized, setChartInitialized] = useState(false);
  const [containerEl, setContainerEl] = useState(null);

  const chartRef = useRef(null);
  const seriesRef = useRef([]);

  const { data, loading, error } = useDataLoader('analyze_breadth');

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

    // --- VNINDEX price (pane 0) ---
    if (data.vnindex) {
      const priceData = data.vnindex.dates.map((d, i) => {
        const o = data.vnindex.open?.[i] ?? data.vnindex.close[i]; // fallback if open not available
        const h = data.vnindex.high?.[i];
        const l = data.vnindex.low?.[i];
        const c = data.vnindex.close[i];
        if ([o, h, l, c].some(v => v == null || isNaN(v))) return null;
        return {
          time: d.slice(0, 10),
          open: Number(o),
          high: Number(h),
          low: Number(l),
          close: Number(c),
        };
      }).filter(Boolean);
      if (priceData.length) {
        try {
          const priceSeries = chart.addSeries(BarSeries, { upColor: '#26a69a', downColor: '#ef5350' }, 0);
          priceSeries.setData(priceData);
          seriesRef.current.push(priceSeries);
        } catch (error) {
          console.error('Error adding price series:', error);
        }
      }

      // --- VNINDEX volume (pane 1) ---
      const volData = data.vnindex.dates.map((d, i) => {
        const v = data.vnindex.volume[i];
        if (v == null || isNaN(v)) return null;
        return { time: d.slice(0, 10), value: Number(v) };
      }).filter(Boolean);
      if (volData.length) {
        try {
          const volSeries = chart.addSeries(HistogramSeries, {
            color: '#c792ea',
            priceFormat: { type: 'volume' },
            scaleMargins: { top: 0.8, bottom: 0 },
          }, 1);
          volSeries.setData(volData);
          seriesRef.current.push(volSeries);
        } catch (error) {
          console.error('Error adding volume series:', error);
        }
      }
    }

    // --- Market breadth lines (pane 2) ---
    if (data.market_breadth) {
      const { dates, indicators } = data.market_breadth;
      // Define colors for each indicator
      const indicatorConfigs = {
        cho_mua: { name: 'Chờ mua', color: '#10b981' }, // green
        cho_ban: { name: 'Chờ bán', color: '#ef4444' }, // red
        ban: { name: 'Bán', color: '#991b1b' }, // dark red
        mua: { name: 'Mua', color: '#065f46' }, // dark green
        ap_luc_ban: { name: 'Áp lực bán', color: '#f59e0b' }, // orange
      };
      // Only plot the four main lines (cho_mua, cho_ban, ban, mua)
      const keys = ['cho_mua', 'cho_ban', 'ban', 'mua', 'ap_luc_ban'];
      keys.forEach(key => {
        const ind = indicators[key];
        if (!ind) return;
        const lineData = dates.map((d, i) => {
          const v = ind.smoothed[i];
          if (v == null || isNaN(v)) return null;
          return { time: d.slice(0, 10), value: Number(v) };
        }).filter(Boolean);
        if (lineData.length) {
          try {
            const series = chart.addSeries(LineSeries, { color: indicatorConfigs[key].color, lineWidth: 2 }, 2);
            series.setData(lineData);
            seriesRef.current.push(series);
          } catch (error) {
            console.error(`Error adding ${key} series:`, error);
          }
        }
      });
    }
    
    try {
      chart.timeScale().fitContent();

      const panes = chart.panes();
      if (panes[0]) panes[0].setHeight(400); // Price
      if (panes[1]) panes[1].setHeight(150); // Volume
      if (panes[2]) panes[2].setHeight(200); // Breadth
    } catch (error) {
      console.error('Error configuring chart:', error);
    }
  }, [data, chartInitialized]);

  // Donut chart colors and labels
  const DONUT_COLORS = ['#10b981', '#065f46', '#ef4444', '#991b1b', '#f59e0b'];
  const DONUT_LABELS = ['Chờ mua', 'Mua', 'Chờ bán', 'Bán', 'Áp lực bán'];

  function MarketBreadthDonut({ data: donutData, date }) {
    if (!donutData || !Array.isArray(donutData) || donutData.length === 0) {
      return null;
    }

    // Only keep valid numbers
    const validData = donutData.filter(
      d =>
        d &&
        typeof d.name === 'string' &&
        typeof d.value === 'number' &&
        !isNaN(d.value) &&
        d.value >= 0
    );

    const total = validData.reduce((sum, d) => sum + d.value, 0);

    if (validData.length === 0 || total === 0) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-[120px] h-[120px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full overflow-visible">
            <span className="text-xs text-gray-400">No data</span>
          </div>
          <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">{date}</div>
        </div>
      );
    }

    // Custom label with increased radius
    const RADIAN = Math.PI / 180;
    const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value, fill, index }) => {
      const radius = outerRadius + 32; // push label further out
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill={fill || (index === 0 || index === 1 ? '#065f46' : '#ef4444')}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={13}
          fontWeight={500}
        >
          {`${name}: ${value}`}
        </text>
      );
    };

    return (
      <div className="flex flex-col items-center">
        <div style={{ width: 280, height: 280 }} className="overflow-visible flex items-center justify-center">
          <PieChart width={280} height={280}>
            <Pie
              data={validData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={40}
              paddingAngle={1}
              label={renderCustomLabel}
              labelLine={true}
            >
              {validData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">{date}</div>
      </div>
    );
  }

  // Prepare last 7 days data for donut charts from real indicator data
  let donutData = [];
  if (data?.market_breadth?.dates && data.market_breadth?.indicators) {
    const { dates, indicators } = data.market_breadth;
    const keys = ['cho_mua', 'mua', 'cho_ban', 'ban', 'ap_luc_ban'];
    const labels = ['Chờ mua', 'Mua', 'Chờ bán', 'Bán', 'Áp lực bán'];
    const n = dates.length;
    for (let i = Math.max(0, n - 7); i < n; ++i) {
      const dayData = keys.map((key, idx) => ({
        name: labels[idx],
        value: typeof indicators[key]?.raw?.[i] === 'number' ? indicators[key].raw[i] : 0
      }));
      donutData.push({
        date: new Date(dates[i]).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        data: dayData
      });
    }
  }

  // UI
  if (error) return <Card className="p-6 text-center text-red-600">Lỗi tải dữ liệu: {error.message}</Card>;

  // Controls and summary
  const configs = {
    cho_mua: { name: 'Chờ mua', color: '#10b981' },
    cho_ban: { name: 'Chờ bán', color: '#ef4444' },
    ban: { name: 'Bán', color: '#991b1b' },
    mua: { name: 'Mua', color: '#065f46' },
    ap_luc_ban: { name: 'Áp lực bán', color: '#f59e0b' },
  };
  const indicators = data?.market_breadth?.indicators || {};

  const descriptionConfigs = {
    cho_mua: {
      name: 'Chờ Mua',
      color: '#10b981',
      description: 'Khi nhiều cổ phiếu đồng loạt phát tín hiệu Mua tiềm năng, ví dụ: RSI thấp (dưới ngưỡng 40), giá đang tiệm cận đáy ngắn hạn, khối lượng phiên trước cao hơn ngưỡng trung bình.'
    },
    cho_ban: {
      name: 'Chờ Bán',
      color: '#ef4444',
      description: 'Khi nhiều cổ phiếu đồng loạt phát tín hiệu Bán tiềm năng, ví dụ: RSI cao (trên ngưỡng 60), giá đang tiệm cận đỉnh ngắn hạn, khối lượng phiên trước cao hơn ngưỡng trung bình.'
    },
    mua: {
      name: 'Mua Mạnh',
      color: '#065f46',
      description: 'Khi áp lực Mua chiếm ưu thế rõ rệt, nhiều cổ phiếu vượt đỉnh trong 4 phiên liên tiếp và khối lượng lớn.'
    },
    ban: {
      name: 'Bán Mạnh',
      color: '#991b1b',
      description: 'Khi áp lực Bán chiếm ưu thế rõ rệt, nhiều cổ phiếu phá đáy trong 8 phiên liên tiếp và khối lượng lớn.'
    },
    ap_luc_ban: {
      name: 'Áp Lực Bán',
      color: '#f59e0b',
      description: 'Đo lường tình huống thị trường đang chịu sức ép giảm giá rộng khắp, thể hiện qua: nhiều cổ phiếu lập đáy ngắn hạn (4 phiên) hoặc cổ phiếu giảm mạnh trên 10% so với đỉnh 3 phiên trước, kèm khối lượng tăng cao.'
    },
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Áp lực mua bán trên thị trường</h3>
      </div>

      {/* Donut Chart Grid Section */}
      {donutData.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {donutData.map((day, idx) => (
              <MarketBreadthDonut key={idx} data={day.data} date={day.date} />
            ))}
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 text-xs">
            {DONUT_LABELS.map((label, idx) => (
              <span key={label} className="flex items-center gap-1">
                <span 
                  className="inline-block w-3 h-3 rounded-full" 
                  style={{ backgroundColor: DONUT_COLORS[idx] }} 
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Chart and panes */}
        <div className="flex-1 min-w-0 relative">
          <div
            ref={setContainerEl}
            className="border"
            style={{ width: '100%', background: '#fff', minHeight: '750px' }}
          />
          {(loading || !chartInitialized) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
              <p className="mt-2 text-muted-foreground">Đang tải dữ liệu và biểu đồ...</p>
            </div>
          )}
        </div>
        {/* Sidebar summary */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
          {['cho_mua', 'cho_ban', 'ban', 'mua', 'ap_luc_ban'].map(key => {
            const ind = indicators[key];
            if (!ind) return null;
            const cfg = configs[key];
            const sm = ind.smoothed.at(-1) || 0;
            return (
              <div key={key} className="text-center p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{cfg.name}</h4>
                <div className="text-lg font-semibold" style={{ color: cfg.color }}>{sm.toFixed(1)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description Section - styled like info card */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cách Đọc Biểu Đồ Áp Lực Mua Bán
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Column 1: Signal Definitions */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Định nghĩa các tín hiệu</h4>
            <ul className="space-y-3">
              {Object.entries(descriptionConfigs).map(([key, cfg]) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex-shrink-0 h-3 w-3 rounded-full"
                    style={{ backgroundColor: cfg.color }}
                    aria-hidden="true"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{cfg.name}:</span> {cfg.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Overview & How to Use */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tổng quan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Biểu đồ Áp Lực Mua–Bán tổng hợp tín hiệu kỹ thuật từ toàn bộ cổ phiếu trong rổ, rồi làm mượt (EMA) để xác định xu hướng chung.
              </p>
            </div>

            {/* How to Use Callout - with improved contrast */}
            <div className="p-4 bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <h5 className="font-semibold text-blue-800 dark:text-blue-300">Cách sử dụng</h5>
              </div>
              <div className="mt-2 text-sm text-blue-700 dark:text-slate-300 pl-8 space-y-2">
                <p><strong>Quan sát các đường:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Đường Mua (xanh) và Chờ Mua (xanh mờ)</li>
                  <li>Đường Bán (đỏ) và Chờ Bán (hồng)</li>
                  <li>Đường Áp Lực Bán (cam)</li>
                </ul>
                <p><strong>Giao cắt tín hiệu:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Khi đường Mua vượt lên trên đường Bán: dấu hiệu thị trường tích cực</li>
                  <li>Khi đường Bán chọc xuống dưới đường Mua: cảnh báo xu hướng tiêu cực</li>
                </ul>
                <p><strong>Xác nhận áp lực:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Áp Lực Bán ở mức cao (&gt; ngưỡng 50): nhiều cổ phiếu đang chịu sức ép giảm mạnh, nên thận trọng</li>
                </ul>
                <p className="text-xs mt-3 italic">
                  <strong>Lưu ý:</strong> Không nên dựa duy nhất vào chỉ báo này để ra quyết định mua/bán. Hãy kết hợp phân tích giá, khối lượng, tin tức cơ bản và quản trị rủi ro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MarketWave;
