import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { useTickerInfoWithData } from '../utils/dataLoader';
import { DataReloadContext } from '../contexts/DataReloadContext';

// ── Squarified treemap ───────────────────────────────────────────────────────

function squarify(nodes, x, y, w, h) {
  if (!nodes.length || !w || !h) return [];
  const total = nodes.reduce((s, n) => s + n.value, 0);
  if (!total) return nodes.map((n, i) => ({ ...n, x, y: y + (i * h) / nodes.length, w, h: h / nodes.length }));
  const sorted = [...nodes].sort((a, b) => b.value - a.value);
  const out = [];
  _sq(sorted, total, x, y, w, h, out);
  return out;
}

function _sq(nodes, total, x, y, w, h, out) {
  if (!nodes.length) return;
  if (nodes.length === 1) { out.push({ ...nodes[0], x, y, w, h }); return; }

  const area = w * h;
  const short = Math.min(w, h);
  const horiz = w >= h;

  let row = [nodes[0]], rowSum = nodes[0].value, prev = Infinity;
  for (let i = 1; i < nodes.length; i++) {
    const cand = nodes[i];
    const newSum = rowSum + cand.value;
    const rat = _worst([...row, cand], newSum, short, total, area);
    if (rat > prev && row.length) break;
    row.push(cand); rowSum = newSum; prev = rat;
  }

  const rowArea = (rowSum / total) * area;
  const thick = rowArea / short;
  let pos = horiz ? y : x;
  for (const n of row) {
    const len = (n.value / rowSum) * short;
    if (horiz) out.push({ ...n, x, y: pos, w: thick, h: len });
    else       out.push({ ...n, x: pos, y, w: len, h: thick });
    pos += len;
  }

  const rest = nodes.slice(row.length);
  if (!rest.length) return;
  if (horiz) _sq(rest, total - rowSum, x + thick, y, w - thick, h, out);
  else       _sq(rest, total - rowSum, x, y + thick, w, h - thick, out);
}

function _worst(row, rowSum, short, total, area) {
  const rowArea = (rowSum / total) * area;
  const thick = rowArea / short;
  let worst = 0;
  for (const n of row) {
    const len = (n.value / rowSum) * short;
    const r = Math.max(thick / (len || 0.001), (len || 0.001) / thick);
    if (r > worst) worst = r;
  }
  return worst;
}

// ── Colors ───────────────────────────────────────────────────────────────────

function colorForRSRatio(v) {
  if (v == null) return '#374151';
  if (v >= 110) return '#14532d';
  if (v >= 105) return '#166534';
  if (v >= 102) return '#15803d';
  if (v >= 98)  return '#374151';
  if (v >= 95)  return '#991b1b';
  if (v >= 90)  return '#7f1d1d';
  return '#6b0f0f';
}

function colorForRSClose(v) {
  if (v == null) return '#374151';
  if (v >= 1.5)  return '#14532d';
  if (v >= 1.2)  return '#166534';
  if (v >= 1.05) return '#15803d';
  if (v >= 0.95) return '#374151';
  if (v >= 0.8)  return '#991b1b';
  if (v >= 0.7)  return '#7f1d1d';
  return '#6b0f0f';
}

function colorForCRS(v) {
  if (v == null) return '#374151';
  if (v >= 0.15)  return '#14532d';
  if (v >= 0.08)  return '#166534';
  if (v >= 0.03)  return '#15803d';
  if (v >= -0.03) return '#374151';
  if (v >= -0.08) return '#991b1b';
  if (v >= -0.15) return '#7f1d1d';
  return '#6b0f0f';
}

function getColor(ticker, metric) {
  switch (metric) {
    case 'rs_ratio':    return colorForRSRatio(ticker.rs_ratio);
    case 'rs_momentum': return colorForRSRatio(ticker.rs_momentum);
    case 'rs_close':    return colorForRSClose(ticker.rs_close);
    case 'crs':         return colorForCRS(ticker.crs);
    default:            return '#374151';
  }
}

function displayValue(ticker, metric) {
  switch (metric) {
    case 'rs_ratio':    return ticker.rs_ratio != null ? ticker.rs_ratio.toFixed(1) : '—';
    case 'rs_momentum': return ticker.rs_momentum != null ? ticker.rs_momentum.toFixed(1) : '—';
    case 'rs_close':    return ticker.rs_close != null ? ticker.rs_close.toFixed(2) : '—';
    case 'crs':         return ticker.crs != null ? `${(ticker.crs * 100).toFixed(1)}%` : '—';
    default:            return '—';
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const GAP = 1;
const SECTOR_PAD = 18;
const SUB_PAD = 13;

const METRICS = [
  { key: 'rs_ratio',    label: 'RS Ratio' },
  { key: 'rs_momentum', label: 'RS Momentum' },
  { key: 'rs_close',    label: 'RS Close' },
  { key: 'crs',         label: 'CRS' },
];

// ── Component ─────────────────────────────────────────────────────────────────

const TickerHeatmap = ({ analyticsData, timeframe }) => {
  const { companies, industries, essentialDataLoading } = useContext(DataReloadContext);
  useTickerInfoWithData(companies, industries); // pre-warm cache

  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [metric, setMetric] = useState('rs_ratio');

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const r = entries[0]?.contentRect;
      if (r) setDims({ w: Math.floor(r.width), h: Math.floor(r.height) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Reset metric when timeframe changes
  useEffect(() => { setMetric('rs_ratio'); }, [timeframe]);

  // industry lookup: custom_id → {name, parent_custom_id}
  const industryMap = useMemo(() => {
    if (!industries) return {};
    if (Array.isArray(industries)) return Object.fromEntries(industries.map(i => [i.custom_id, i]));
    return industries;
  }, [industries]);

  const sectorIds = useMemo(
    () => new Set(Object.entries(industryMap).filter(([, v]) => !v.parent_custom_id).map(([k]) => k)),
    [industryMap]
  );

  const tickers = useMemo(() => {
    const { symbols = [] } = analyticsData || {};
    return symbols.map(s => {
      const tail = s.tail || [];
      const last = tail[tail.length - 1] || {};
      return {
        symbol: s.symbol,
        rs_ratio:    last.x ?? null,
        rs_momentum: last.y ?? null,
        rs_close:    s.metrics?.current_rs ?? null,
        crs:         s.metrics?.current_crs ?? null,
        industries:  s.industries || [],
      };
    });
  }, [analyticsData]);

  // Build 3-level tree: sector → sub-industry → stocks
  const tree = useMemo(() => {
    const sectors = {};

    for (const ticker of tickers) {
      const primaryId = ticker.industries[0]?.custom_id;
      const ind = primaryId ? industryMap[primaryId] : null;

      let sectorId, subId;

      if (!ind) {
        sectorId = '_other'; subId = '_other';
      } else if (!ind.parent_custom_id) {
        // industry IS the top-level sector
        sectorId = primaryId; subId = primaryId;
      } else if (sectorIds.has(ind.parent_custom_id)) {
        sectorId = ind.parent_custom_id; subId = primaryId;
      } else {
        // 3-level deep: grandparent is sector
        const parent = industryMap[ind.parent_custom_id];
        sectorId = parent?.parent_custom_id || ind.parent_custom_id;
        subId = ind.parent_custom_id;
      }

      if (!sectors[sectorId]) {
        const name = industryMap[sectorId]?.name || (sectorId === '_other' ? 'Khác' : sectorId);
        sectors[sectorId] = { id: sectorId, name, subs: {} };
      }
      if (!sectors[sectorId].subs[subId]) {
        const name = industryMap[subId]?.name || subId;
        sectors[sectorId].subs[subId] = { id: subId, name, stocks: [] };
      }
      sectors[sectorId].subs[subId].stocks.push(ticker);
    }

    return Object.values(sectors)
      .map(sec => {
        const subs = Object.values(sec.subs)
          .filter(s => s.stocks.length)
          .map(s => ({ ...s, value: s.stocks.length }));
        if (!subs.length) return null;
        return { ...sec, subs, value: subs.reduce((a, s) => a + s.value, 0) };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
  }, [tickers, industryMap, sectorIds]);

  // Compute full layout
  const layout = useMemo(() => {
    const { w, h } = dims;
    if (!w || !h || !tree.length) return [];

    return squarify(tree, 0, 0, w, h).map(sec => {
      const iX = sec.x + GAP;
      const iY = sec.y + SECTOR_PAD;
      const iW = sec.w - GAP * 2;
      const iH = sec.h - SECTOR_PAD - GAP;

      if (iW <= 2 || iH <= 2) return { ...sec, subsLayout: [] };

      const subsLayout = squarify(sec.subs, iX, iY, iW, iH).map(sub => {
        const sX = sub.x + GAP;
        const sY = sub.y + SUB_PAD;
        const sW = sub.w - GAP * 2;
        const sH = sub.h - SUB_PAD - GAP;

        if (sW <= 2 || sH <= 2) return { ...sub, stockLayout: [] };

        const stockLayout = squarify(
          sub.stocks.map(s => ({ ...s, value: 1 })),
          sX, sY, sW, sH
        );
        return { ...sub, stockLayout };
      });

      return { ...sec, subsLayout };
    });
  }, [dims, tree]);

  if (!analyticsData || !tickers.length || essentialDataLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-950 text-gray-500">
        Đang tải dữ liệu…
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white" style={{ userSelect: 'none' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`cursor-pointer px-3 py-1 rounded text-xs font-medium transition-colors ${
              metric === m.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {m.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">
          {tickers.length} cổ phiếu · {tree.length} nhóm ngành
        </span>
      </div>

      {/* Treemap */}
      <div ref={containerRef} className="flex-grow relative overflow-hidden">
        {layout.map(sec => (
          <SectorBlock key={sec.id} sec={sec} metric={metric} />
        ))}
      </div>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const SectorBlock = React.memo(({ sec, metric }) => (
  <div style={{ position: 'absolute', left: sec.x, top: sec.y, width: sec.w, height: sec.h }}>
    {sec.w > 40 && sec.h > 22 && (
      <div style={{
        position: 'absolute', left: 3, top: 2, zIndex: 10,
        fontSize: 10, fontWeight: 700, color: '#9ca3af',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: sec.w - 6,
        pointerEvents: 'none',
      }}>
        {sec.name}
      </div>
    )}
    {(sec.subsLayout || []).map(sub => (
      <SubBlock key={sub.id} sub={sub} metric={metric} />
    ))}
  </div>
));

const SubBlock = React.memo(({ sub, metric }) => (
  <div style={{ position: 'absolute', left: sub.x, top: sub.y, width: sub.w, height: sub.h }}>
    {sub.w > 30 && sub.h > 16 && (
      <div style={{
        position: 'absolute', left: 2, top: 1, zIndex: 10,
        fontSize: 7, fontWeight: 600, color: '#6b7280',
        textTransform: 'uppercase', letterSpacing: '0.04em',
        whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: sub.w - 4,
        pointerEvents: 'none',
      }}>
        {sub.name}
      </div>
    )}
    {(sub.stockLayout || []).map(stock => (
      <StockCell key={stock.symbol} stock={stock} metric={metric} />
    ))}
  </div>
));

const StockCell = React.memo(({ stock, metric }) => {
  const cw = stock.w - GAP;
  const ch = stock.h - GAP;
  const large = cw > 50 && ch > 36;
  const mid   = cw > 24 && ch > 18;
  const tiny  = cw > 14 && ch > 10;

  return (
    <div
      title={`${stock.symbol}: ${displayValue(stock, metric)}`}
      style={{
        position: 'absolute',
        left: stock.x, top: stock.y,
        width: cw, height: ch,
        backgroundColor: getColor(stock, metric),
        border: '1px solid rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
    >
      {tiny && (
        <div style={{ fontSize: large ? 13 : mid ? 9 : 7, fontWeight: 700, color: '#fff', lineHeight: 1.1, textAlign: 'center' }}>
          {stock.symbol}
        </div>
      )}
      {mid && (
        <div style={{ fontSize: large ? 10 : 7, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1 }}>
          {displayValue(stock, metric)}
        </div>
      )}
    </div>
  );
});

export default TickerHeatmap;
