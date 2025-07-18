import React from 'react';
// import { Trophy, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, List } from 'lucide-react';
import { getSentimentColor } from '../utils/colorUtils';

// Card for displaying leadership status (Current, Emerging, Declining)
const LeadershipCard = ({ title, data, color, Icon }) => {
  if (!data) return null;
  return (
    <div className={`p-3 rounded-lg border ${color.border} ${color.bg}`}>
      <div className="flex items-center mb-2">
        {Icon && <Icon className={`w-5 h-5 mr-2 ${color.text}`} />}
        <h5 className={`font-semibold text-sm ${color.text}`}>{title} ({data.count || 0})</h5>
      </div>
      <div className={`text-xs font-medium mb-1 ${color.text}`}>{data.strength || data.potential || data.warning_level || 'N/A'}</div>
      {data.sectors?.length > 0 && (
        <p className="text-xs text-slate-600">
          {data.sectors.map(sector => typeof sector === 'string' ? sector : sector.name || sector.sector || 'Unknown').join(', ')}
        </p>
      )}
    </div>
  );
};

// A single item in a list of sectors
const SectorListItem = ({ sector, colorClass = 'bg-slate-50' }) => {
  return (
    <div className={`p-2 rounded-md flex justify-between items-center ${colorClass}`}>
      <div>
        <div className="font-semibold text-sm text-slate-800">{sector.name}</div>
        <div className="text-xs text-slate-500">{sector.money_flow}</div>
      </div>
      <div className="text-right">
        <div className={`font-bold text-xs ${getSentimentColor(sector.quadrant)}`}>{sector.quadrant}</div>
        <div className="text-xs text-slate-500">{(sector.velocity * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
};

// --- Main SectorRotation Component ---
const SectorRotation = ({ sectorRotation }) => {
  if (!sectorRotation) return null;
  const {
    money_flow_summary,
    sector_leadership,
    rotation_patterns,
    top_rotating_sectors,
    detailed_flow
  } = sectorRotation;
  const theme = {
    leader: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', Icon: null /*Trophy*/ },
    emerging: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', Icon: null /*ArrowUpRight*/ },
    declining: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', Icon: null /*ArrowDownRight*/ },
  };
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="font-bold text-base text-slate-800 mb-4">Phân tích luân chuyển ngành</h3>
      {/* Rotation Patterns Summary Card */}
      {rotation_patterns && (
        <div className="p-3 bg-yellow-50 rounded-lg border mb-4">
          <h4 className="font-semibold text-sm text-yellow-700 mb-1">Mô hình luân chuyển</h4>
          <div className="text-xs text-slate-700"><b>Ổn định:</b> {rotation_patterns.stability}</div>
          <div className="text-xs text-slate-700"><b>Tốc độ:</b> {rotation_patterns.rotation_speed}</div>
          <div className="text-xs text-slate-700"><b>Chủ đề:</b> {rotation_patterns.theme}</div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- LEFT COLUMN: SUMMARY & LEADERSHIP --- */}
        <div className="space-y-4">
          {/* Money Flow Summary */}
          {money_flow_summary && (
            <div className="p-3 bg-slate-50 rounded-lg border">
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Tổng quan dòng tiền</h4>
              <p className={`font-bold text-lg mb-2 ${getSentimentColor(money_flow_summary.dominant_theme)}`}>{money_flow_summary.dominant_theme}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
                <div className="bg-white p-1 rounded border"><b>Sức mạnh:</b> {money_flow_summary.rotation_strength}</div>
                <div className="bg-white p-1 rounded border"><b>Tốc độ:</b> {money_flow_summary.flow_velocity}</div>
                <div className="bg-white p-1 rounded border"><b>Vào:</b> {money_flow_summary.inflow_count}</div>
                <div className="bg-white p-1 rounded border"><b>Ra:</b> {money_flow_summary.outflow_count}</div>
              </div>
            </div>
          )}
          {/* Sector Leadership */}
          {sector_leadership && (
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Trạng thái Leadership</h4>
              <div className="space-y-3">
                <LeadershipCard title="Dẫn dắt hiện tại" data={sector_leadership.current_leaders} color={theme.leader} Icon={theme.leader.Icon} />
                <LeadershipCard title="Dẫn dắt mới nổi" data={sector_leadership.emerging_leaders} color={theme.emerging} Icon={theme.emerging.Icon} />
                <LeadershipCard title="Dẫn dắt suy yếu" data={sector_leadership.declining_leaders} color={theme.declining} Icon={theme.declining.Icon} />
              </div>
            </div>
          )}
        </div>
        {/* --- RIGHT COLUMN: DETAILS & LISTS --- */}
        <div className="space-y-4">
          {/* Top Rotating Sectors */}
          {top_rotating_sectors?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center">{/*<List className="w-4 h-4 mr-2" />*/} Top luân chuyển ngành</h4>
              <div className="space-y-2">
                {top_rotating_sectors.slice(0, 5).map((sector, index) => (
                  <SectorListItem key={index} sector={sector} />
                ))}
              </div>
            </div>
          )}
          {/* Detailed Flow */}
          {detailed_flow && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inflow */}
              <div>
                <h4 className="font-semibold text-sm text-green-700 mb-2 flex items-center">{/*<TrendingUp className="w-4 h-4 mr-2" />*/} Dòng tiền vào</h4>
                <div className="space-y-2">
                  {detailed_flow.inflow_sectors?.slice(0, 3).map((sector, index) => (
                    <SectorListItem key={index} sector={sector} colorClass="bg-green-50" />
                  ))}
                </div>
              </div>
              {/* Outflow */}
              <div>
                <h4 className="font-semibold text-sm text-red-700 mb-2 flex items-center">{/*<TrendingDown className="w-4 h-4 mr-2" />*/} Dòng tiền ra</h4>
                <div className="space-y-2">
                  {detailed_flow.outflow_sectors?.slice(0, 3).map((sector, index) => (
                    <SectorListItem key={index} sector={sector} colorClass="bg-red-50" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectorRotation; 