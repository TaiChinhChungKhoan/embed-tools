import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge
} from '@embed-tools/components';
import { RotateCcw, Search } from 'lucide-react';
import * as d3 from 'd3';

const NetworkView = ({ data, selectedSymbol, onSymbolSelect }) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  // refs to hold d3 selections & data for imperatively updating labels
  const labelRef = useRef(null);
  const neighborMapRef = useRef({});
  const edgesRef = useRef([]);
  const updateLabelsRef = useRef(() => { });
  const showAllLabelsRef = useRef(false);

  const [threshold, setThreshold] = useState(0.7);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [zoomBehavior, setZoomBehavior] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(1);

  // keep the showAllLabels ref in sync
  useEffect(() => {
    showAllLabelsRef.current = showAllLabels;
    if (updateLabelsRef.current) {
      updateLabelsRef.current(currentZoom);
    }
  }, [showAllLabels]);

  // rebuild graph on data/threshold/searchTerm
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 1) filter edges by threshold
    const baseEdges = data.significant_correlations
      .filter(c => Math.abs(c.correlation) >= threshold)
      .map(c => ({
        source: c.symbol1.toUpperCase(),
        target: c.symbol2.toUpperCase(),
        weight: c.correlation
      }));

    // 2) if searching, keep only edges touching the key
    const key = searchTerm.trim().toUpperCase();
    const edges = key
      ? baseEdges.filter(e => e.source === key || e.target === key)
      : baseEdges;
    edgesRef.current = edges;

    // 3) build nodes + degrees
    const nodeIds = new Set(edges.flatMap(e => [e.source, e.target]));
    const nodes = Array.from(nodeIds).map(id => ({ id, degree: 0 }));
    nodes.forEach(n => {
      n.degree = edges.filter(e => e.source === n.id || e.target === n.id).length;
    });

    if (!nodes.length) {
      svg.append('text')
        .attr('x', '50%').attr('y', '50%')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', '#888')
        .text('Không có dữ liệu với ngưỡng này');
      return;
    }

    const width = svgRef.current.clientWidth;
    const height = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 4) build neighbor map
    const neighborMap = {};
    nodes.forEach(n => (neighborMap[n.id] = new Set()));
    edges.forEach(e => {
      neighborMap[e.source].add(e.target);
      neighborMap[e.target].add(e.source);
    });
    neighborMapRef.current = neighborMap;

    // 5) zoomable group
    const g = svg
      .attr('width', width).attr('height', height)
      .call(d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', ({ transform }) => {
          g.attr('transform', transform);
          const k = transform.k;
          setCurrentZoom(k);
          updateLabelsRef.current(k);
        })
      )
      .append('g');

    // 6) force simulation (tweaked)
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id(d => d.id)
        .distance(d => 100 / Math.abs(d.weight))
        .strength(d => Math.abs(d.weight) * 0.7)
      )
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(d => 3 + d.degree * 0.3));
    setSimulation(sim);

    // 7) draw links
    g.append('g')
      .attr('stroke-opacity', 0.4)
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', d => d.weight > 0 ? '#00d4ff' : '#ff4444')
      .attr('stroke-width', d => Math.abs(d.weight) * 2);

    // 8) draw nodes
    g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('fill', d => color(d.id))
      .attr('r', d => 5 + d.degree * 0.5)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', evt => {
          if (!evt.active) sim.alphaTarget(0.3).restart();
          evt.subject.fx = evt.subject.x;
          evt.subject.fy = evt.subject.y;
        })
        .on('drag', evt => {
          evt.subject.fx = evt.x;
          evt.subject.fy = evt.y;
        })
        .on('end', evt => {
          if (!evt.active) sim.alphaTarget(0);
          evt.subject.fx = null;
          evt.subject.fy = null;
        })
      )
      .on('click', (evt, d) => {
        evt.stopPropagation();
        onSymbolSelect(d.id);
      })
      .on('mouseover', (evt, d) => {
        d3.select(evt.target).attr('r', 8 + d.degree * 0.5);
        showTooltip(evt, `<strong>${d.id}</strong><br/>Kết nối: ${d.degree}`);
      })
      .on('mouseout', hideTooltip);

    // 9) draw & measure labels
    const label = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('fill', '#333')
      .attr('font-weight', 600)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('pointer-events', 'none')
      .text(d => d.id);
    label.each(function (d) {
      d.labelWidth = this.getComputedTextLength();
    });
    labelRef.current = label;

    // 10) updateLabels helper
    const updateLabels = (k) => {
      const sel = selectedSymbol ? selectedSymbol.toUpperCase() : null;
      // guard against undefined neighbor sets
      const neighbors = sel ? (neighborMapRef.current[sel] || new Set()) : new Set();
      +
        label
          .attr('font-size', d => {
            const base = 8 + d.degree * 0.3;
            return Math.max(8, Math.min(16, base * k));
          })
          .attr('opacity', d => {
            if (showAllLabelsRef.current) return 1;
            // always show selected + its direct neighbors
            if (sel && (d.id === sel || neighbors.has(d.id))) return 1;
            // otherwise show only if fits
            const r = (5 + d.degree * 0.5) * k;
            return (2 * r > d.labelWidth + 8) ? 1 : 0;
          });
    };
    updateLabelsRef.current = updateLabels;

    // 11) tick handler (positions only)
    sim.on('tick', () => {
      g.selectAll('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      g.selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // 12) reset zoom state + initial labels
    const zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', ({ transform }) => {
        g.attr('transform', transform);
        const k = transform.k;
        setCurrentZoom(k);
        updateLabels(k);
      });
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);
    setZoomBehavior(() => zoom);
    updateLabels(1);

    return () => sim.stop();
  }, [data, threshold, searchTerm]);

  // highlight stroke & recenter on selection
  useEffect(() => {
    if (!simulation) return;
    const sel = selectedSymbol ? selectedSymbol.toUpperCase() : null;
    const svg = d3.select(svgRef.current);
    svg.selectAll('circle')
      .attr('stroke', d => d.id === sel ? '#ffff00' : '#fff')
      .attr('stroke-width', d => d.id === sel ? 4 : 2);
    if (sel) centerOnSymbol(sel);
  }, [selectedSymbol, simulation]);

  // tooltip
  const showTooltip = (evt, content) => {
    const tip = document.getElementById('tooltip');
    const { left, top } = wrapperRef.current.getBoundingClientRect();
    tip.innerHTML = content;
    tip.classList.remove('hidden');
    tip.style.left = `${evt.clientX - left + 8}px`;
    tip.style.top = `${evt.clientY - top - 8}px`;
  };
  const hideTooltip = () =>
    document.getElementById('tooltip').classList.add('hidden');

  // control handlers
  const resetNetwork = () => simulation?.alpha(1).restart();
  const handleZoomIn = () =>
    zoomBehavior && d3.select(svgRef.current).transition().call(zoomBehavior.scaleBy, 1.2);
  const handleZoomOut = () =>
    zoomBehavior && d3.select(svgRef.current).transition().call(zoomBehavior.scaleBy, 0.8);
  const handleZoomReset = () =>
    zoomBehavior && d3.select(svgRef.current).transition().call(zoomBehavior.transform, d3.zoomIdentity);

  // center helper
  const centerOnSymbol = symbol => {
    if (!simulation || !svgRef.current) return;
    const node = simulation.nodes().find(n => n.id === symbol);
    if (!node) return;
    const w = svgRef.current.clientWidth, h = 600;
    const t = d3.zoomIdentity
      .translate(w / 2 - node.x, h / 2 - node.y)
      .scale(2);
    d3.select(svgRef.current)
      .transition().duration(750)
      .call(zoomBehavior.transform, t);
  };

  // filtered badges
  const filtered = (data?.symbols || []).filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader><CardTitle>Mạng Lưới Tương Quan theo Cộng Đồng</CardTitle></CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-6 py-4">
          {/* show-all toggle */}
          <div className="flex items-center space-x-2">
            <input
              id="showAll"
              type="checkbox"
              checked={showAllLabels}
              onChange={() => setShowAllLabels(x => !x)}
              className="h-4 w-4"
            />
            <Label htmlFor="showAll">Show all labels</Label>
          </div>

          {/* threshold */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="threshold">
              Ngưỡng tương quan: {threshold.toFixed(2)}
            </Label>
            <Input
              id="threshold"
              type="range"
              min="0" max="1" step="0.01"
              value={threshold}
              onChange={e => setThreshold(+e.target.value)}
              className="w-56 h-2 appearance-none bg-gray-200 rounded-full accent-blue-600 hover:accent-blue-700 focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>

          {/* search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              placeholder="Nhập mã cổ phiếu..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64 pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-200 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                title="Xóa tìm kiếm"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 text-gray-600 text-xs transition"
              >×</button>
            )}
          </div>

          {/* zoom & reset */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={resetNetwork} title="Re-layout">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>–</Button>
            <Button variant="outline" size="sm" onClick={handleZoomReset}>1×</Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>+</Button>
            <Badge className="h-6 px-2" variant="secondary">
              {currentZoom.toFixed(1)}×
            </Badge>
          </div>
        </div>

        {/* Graph */}
        <div ref={wrapperRef} className="bg-muted/50 rounded-lg p-4 relative">
          <svg ref={svgRef} className="w-full h-auto" />
          <div
            id="tooltip"
            className="hidden absolute bg-white border border-gray-300 rounded-lg p-2 text-sm pointer-events-none z-50"
            style={{ maxWidth: '180px' }}
          />
        </div>

        {/* Guide/Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Hướng Dẫn Sử Dụng Đồ Thị Mạng Lưới</h4>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            <li>Mỗi node là một mã cổ phiếu, các cạnh thể hiện mối liên hệ tương quan mạnh giữa các mã.</li>
            <li>Màu cạnh: <span className="text-blue-600 font-semibold">xanh</span> (cùng chiều), <span className="text-red-600 font-semibold">đỏ</span> (ngược chiều).</li>
            <li>Kéo thả node để xem cấu trúc mạng lưới.</li>
            <li>Zoom, kéo, hoặc nhấn các nút +/- để phóng to/thu nhỏ.</li>
            <li>Nhập mã vào ô tìm kiếm để làm nổi bật và lọc các kết nối liên quan.</li>
            <li>Bấm vào node để xem chi tiết các kết nối của mã đó.</li>
            <li>Đồ thị giúp bạn phát hiện nhóm cổ phiếu liên kết chặt chẽ, các "trung tâm" (hub) hoặc các mã có vai trò đặc biệt trong mạng lưới thị trường.</li>
          </ul>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <h4 className="font-medium mb-2">Kết Quả Tìm Kiếm</h4>
            <div className="flex flex-wrap gap-2">
              {filtered.map(sym => (
                <Badge
                  key={sym}
                  variant={selectedSymbol &&
                    sym.toUpperCase() === selectedSymbol.toUpperCase()
                    ? 'default'
                    : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => onSymbolSelect(sym)}
                >
                  {sym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Detail pane (bonus) */}
        {selectedSymbol && edgesRef.current.length > 0 && (
          <div className="bg-white border rounded-lg shadow p-4 mt-6">
            <h4 className="font-semibold mb-2">
              Details for {selectedSymbol.toUpperCase()}
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {Array.from(neighborMapRef.current[selectedSymbol.toUpperCase()] || [])
                .map(nei => {
                  const e = edgesRef.current.find(
                    ex =>
                      (ex.source === selectedSymbol.toUpperCase() && ex.target === nei) ||
                      (ex.target === selectedSymbol.toUpperCase() && ex.source === nei)
                  );
                  return (
                    <li key={nei}>
                      {nei} — corr: {e ? e.weight.toFixed(3) : 'N/A'}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkView;
