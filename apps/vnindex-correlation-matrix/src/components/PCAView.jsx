import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Badge,
  Button
} from '@embed-tools/components';
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import * as d3 from 'd3';

const PCAView = ({ data, selectedSymbol, onSymbolSelect }) => {
  const svgRef = useRef(null);

  // Hover state
  const [highlightedSymbol, setHighlightedSymbol] = useState(null);

  // Controls state
  const [xPC, setXPC] = useState(1);
  const [yPC, setYPC] = useState(2);
  const [showLoadings, setShowLoadings] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomBehaviorRef = useRef(null);
  const zoomLevelRef = useRef(1);

  // 1) On mount: create the outer zoom group once
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.append('g').attr('class', 'zoomG');
  }, []);

  // 2) Draw/update inner plot whenever data or PCA settings change
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoomG = svg.select('g.zoomG');

    // Preserve current zoom transform
    const currentTransform = d3.zoomTransform(svgRef.current);
    zoomG.attr('transform', currentTransform.toString());

    // Clear previous contents
    zoomG.selectAll('*').remove();

    // Dimensions
    const width = svgRef.current.clientWidth || 700;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // PCA keys
    const xKey = `PC${xPC}`;
    const yKey = `PC${yPC}`;

    // Prepare data points
    const { explained_variance_ratio, loadings } = data;
    const symbols = loadings?.symbols || [];
    const points = symbols.map((symbol, i) => {
      const xVal = loadings?.components?.[xKey]?.[i] ?? 0;
      const yVal = loadings?.components?.[yKey]?.[i] ?? 0;
      return {
        symbol,
        x: xVal,
        y: yVal,
        community: 0,
        isHighlighted:
          symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          symbol === highlightedSymbol
      };
    });

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(points, d => d.x))
      .range([0, plotWidth]).nice();
    const yScale = d3.scaleLinear()
      .domain(d3.extent(points, d => d.y))
      .range([plotHeight, 0]).nice();
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create inner group
    const plotG = zoomG.append('g')
      .attr('class', 'plotG')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    plotG.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale));
    plotG.append('g')
      .call(d3.axisLeft(yScale));

    // Axis labels
    plotG.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', plotHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .text(`${xKey} (${(explained_variance_ratio[xPC - 1] * 100).toFixed(1)}%)`);
    plotG.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -plotHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .text(`${yKey} (${(explained_variance_ratio[yPC - 1] * 100).toFixed(1)}%)`);

    // Points
    plotG.selectAll('circle')
      .data(points)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d =>
        d.symbol === selectedSymbol ? 8
          : d.isHighlighted ? 7
          : 5
      )
      .attr('fill', d =>
        d.symbol === selectedSymbol ? '#ffff00'
          : d.isHighlighted ? '#ff6b6b'
          : colorScale(d.community)
      )
      .attr('stroke', d =>
        d.symbol === selectedSymbol ? '#000' : '#fff'
      )
      .attr('stroke-width', d =>
        (d.symbol === selectedSymbol || d.isHighlighted) ? 2 : 1
      )
      .style('cursor', 'pointer')
      .on('click', (_, d) => onSymbolSelect(d.symbol))
      .on('mouseover', (e, d) => {
        setHighlightedSymbol(d.symbol);
        showTooltip(e, renderTooltip(d));
      })
      .on('mouseout', () => {
        setHighlightedSymbol(null);
        hideTooltip();
      });

    // Loadings
    if (showLoadings) {
      const loadingScale = 0.8 * Math.min(plotWidth, plotHeight) / 2;
      const origin = { x: plotWidth / 2, y: plotHeight / 2 };
      symbols.forEach((symbol, i) => {
        const xComp = loadings.components[xKey]?.[i] ?? 0;
        const yComp = loadings.components[yKey]?.[i] ?? 0;
        plotG.append('line')
          .attr('x1', origin.x)
          .attr('y1', origin.y)
          .attr('x2', origin.x + xComp * loadingScale)
          .attr('y2', origin.y - yComp * loadingScale)
          .attr('stroke', '#00d4ff')
          .attr('stroke-width', 1)
          .attr('opacity', 0.6);
      });
    }

    // Labels
    if (showLabels) {
      plotG.selectAll('text.label')
        .data(points)
        .join('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.x) + 8)
        .attr('y', d => yScale(d.y) - 8)
        .attr('font-size', '10px')
        .attr('fill', '#333')
        .attr('pointer-events', 'none')
        .text(d => d.symbol);
    }
  }, [
    data, xPC, yPC,
    showLoadings, showLabels,
    searchTerm, selectedSymbol,
    highlightedSymbol, onSymbolSelect
  ]);

  // 3) Bind zoom behavior once, update outer zoomG
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    const zoomG = svg.select('g.zoomG');
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', ({ transform }) => {
        zoomG.attr('transform', transform.toString());
      })
      .on('end', ({ transform }) => {
        zoomLevelRef.current = transform.k;
        setZoomLevel(transform.k);
      });
    zoomBehaviorRef.current = zoom;
    svg.call(zoom);
  }, []);

  // Tooltip helpers
  const showTooltip = (e, html) => {
    const tt = document.getElementById('pca-tooltip');
    if (!tt) return;
    tt.innerHTML = html;
    const rect = svgRef.current
      .closest('.bg-muted\\/50')
      .getBoundingClientRect();
    let x = e.clientX - rect.left + 10;
    let y = e.clientY - rect.top - 10;
    const MAX_W = 200, MAX_H = 100;
    if (x + MAX_W > rect.width) x -= MAX_W + 20;
    if (y - MAX_H < 0) y += MAX_H + 20;
    tt.style.left = `${x}px`;
    tt.style.top = `${y}px`;
    tt.style.opacity = 1;
  };
  const hideTooltip = () => {
    const tt = document.getElementById('pca-tooltip');
    if (tt) tt.style.opacity = 0;
  };
  const renderTooltip = d => `
    <div class="font-bold text-lg">${d.symbol}</div>
    <div class="text-sm">
      <div>PC${xPC}: ${d.x.toFixed(3)}</div>
      <div>PC${yPC}: ${d.y.toFixed(3)}</div>
      <div class="text-xs text-gray-500 mt-1">
        Click to select • Hover to highlight
      </div>
    </div>
  `;

  // Zoom control callbacks
  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
      );
    setZoomLevel(1);
    zoomLevelRef.current = 1;
  }, []);

  const zoomIn = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(
        zoomBehaviorRef.current.scaleBy,
        1.5
      );
  }, []);

  const zoomOut = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(
        zoomBehaviorRef.current.scaleBy,
        0.67
      );
  }, []);

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có dữ liệu PCA
      </div>
    );
  }

  const pcOptions = data.explained_variance_ratio
    ? data.explained_variance_ratio.map((_, i) => i + 1)
    : [1, 2, 3, 4, 5];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân Tích Thành Phần Chính (PCA)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="pca-x-axis">Trục X:</Label>
              <select
                id="pca-x-axis"
                value={xPC}
                onChange={e => setXPC(+e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {pcOptions.map(pc => (
                  <option key={pc} value={pc}>{`PC${pc}`}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="pca-y-axis">Trục Y:</Label>
              <select
                id="pca-y-axis"
                value={yPC}
                onChange={e => setYPC(+e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {pcOptions.map(pc => (
                  <option key={pc} value={pc}>{`PC${pc}`}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 border rounded text-sm w-40"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showLoadings}
                  onChange={e => setShowLoadings(e.target.checked)}
                  className="h-4 w-4"
                />
                Trọng số
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={e => setShowLabels(e.target.checked)}
                  className="h-4 w-4"
                />
                Nhãn
              </label>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={zoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetZoom} title="Reset Zoom">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Badge variant="secondary" className="ml-2">
                {zoomLevel.toFixed(1)}×
              </Badge>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black" />
              <span>Đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-white" />
              <span>Đang tìm kiếm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400 border border-white" />
              <span>Khác</span>
            </div>
            {selectedSymbol && (
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  Đã chọn: {selectedSymbol}
                </Badge>
              </div>
            )}
          </div>

          {/* PCA Scatter Plot */}
          <div className="bg-muted/50 rounded-lg p-4 relative">
            <svg
              ref={svgRef}
              className="w-full"
              style={{ minHeight: 500 }}
            />
            <div
              id="pca-tooltip"
              className="absolute bg-white border border-gray-300 rounded-lg p-3 text-sm pointer-events-none opacity-0 transition-opacity z-50 shadow-lg"
              style={{ maxWidth: '200px' }}
            />
          </div>

          {/* Explanatory Panel: Usage */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">📊 Hướng Dẫn Sử Dụng PCA</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h5 className="font-medium mb-2">🎯 Mục Đích:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Giảm chiều dữ liệu xuống 2–3 thành phần chính</li>
                  <li>Phát hiện nhóm cổ phiếu có hành vi tương tự</li>
                  <li>Xác định yếu tố chính ảnh hưởng thị trường</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">🔍 Cách Đọc Biểu Đồ:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Trục:</strong> PC1, PC2,… và % giải thích biến động</li>
                  <li><strong>Gần nhau:</strong> Tương quan cao</li>
                  <li><strong>Xa nhau:</strong> Tương quan thấp</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
              <p className="text-blue-800 text-sm">
                <strong>💡 Mẹo:</strong> Dùng tìm kiếm để highlight, zoom để xem chi tiết, bật "Nhãn" để hiện mã.
              </p>
            </div>
          </div>

          {/* Explanatory Panel: Applications */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-3">📈 Ứng Dụng PCA Trong Đầu Tư</h5>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <h6 className="font-medium mb-2 text-green-700">🎯 Xây Dựng Danh Mục:</h6>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Chọn cổ phiếu từ nhóm khác nhau để đa dạng hóa</li>
                  <li>Tránh nắm nhiều mã tương quan quá cao</li>
                  <li>Tối ưu rủi ro/lợi nhuận</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2 text-blue-700">🔍 Phân Tích Rủi Ro:</h6>
                <ul className="space-y-1 list-disc list-inside">
                  <li>PC1 đại diện rủi ro thị trường chung</li>
                  <li>PC2/PC3 thể hiện yếu tố ngành hoặc style</li>
                  <li>Khoảng cách gốc ↔ giá trị biến động</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2 text-purple-700">⚡ Giao Dịch:</h6>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Pair trading với mã gần nhau</li>
                  <li>Hedging với mã đối nghịch</li>
                  <li>Theo dõi sự di chuyển vị trí theo thời gian</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Explanatory Panel: PCs */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-semibold text-yellow-800 mb-3">🔬 Hiểu Các Thành Phần Chính (PC)</h5>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-yellow-700">
              <div className="space-y-4">
                <div>
                  <h6 className="font-medium mb-2 text-orange-700">📊 PC1:</h6>
                  <ul className="space-y-1 list-disc list-inside ml-4">
                    <li><strong>Ý nghĩa:</strong> Yếu tố thị trường chung</li>
                    <li><strong>Chia sẻ:</strong> 30–60% tổng biến động</li>
                    <li><strong>Ứng dụng:</strong> Phản ánh biến động chung</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium mb-2 text-blue-700">📈 PC2:</h6>
                  <ul className="space-y-1 list-disc list-inside ml-4">
                    <li><strong>Ý nghĩa:</strong> Yếu tố ngành/size</li>
                    <li><strong>Chia sẻ:</strong> 10–25% tổng biến động</li>
                    <li><strong>Ứng dụng:</strong> Phân biệt nhóm ngành</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h6 className="font-medium mb-2 text-green-700">📊 PC3:</h6>
                  <ul className="space-y-1 list-disc list-inside ml-4">
                    <li><strong>Ý nghĩa:</strong> Style (growth vs value) hoặc volatility</li>
                    <li><strong>Chia sẻ:</strong> 5–15% tổng biến động</li>
                    <li><strong>Ứng dụng:</strong> Phân biệt growth/value</li>
                  </ul>
                </div>
                <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-400">
                  <h6 className="font-medium mb-2 text-yellow-800">💡 Chọn PC:</h6>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><strong>PC1 vs PC2:</strong> Cấu trúc thị trường tổng quan</li>
                    <li><strong>PC1 vs PC3:</strong> Thị trường vs style</li>
                    <li><strong>PC2 vs PC3:</strong> Ngành & style</li>
                    <li><strong>Mẹo:</strong> Chọn PC có % explained variance cao</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PCAView;
