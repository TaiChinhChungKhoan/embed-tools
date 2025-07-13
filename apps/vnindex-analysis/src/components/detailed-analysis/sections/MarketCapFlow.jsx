import React from 'react';
import { getSentimentColor } from '../utils/colorUtils';
// import { TrendingUp, TrendingDown } from 'lucide-react';

// A single, standardized card for displaying any market cap group
const GroupAnalysisCard = ({ group, color, title }) => {
  if (!group) return null;
  return (
    <div className={`p-3 rounded-lg border ${color.bg} ${color.border} flex flex-col`}>
      <h5 className={`font-bold text-sm mb-2 ${color.text}`}>{title || group.name}</h5>
      {title && <p className="text-sm font-semibold text-slate-800 -mt-1 mb-2">{group.name}</p>}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-auto">
        <span className="text-slate-500">RRG:</span>
        <span className={`font-semibold ${getSentimentColor(group.rrg_quadrant)}`}>{group.rrg_quadrant}</span>
        <span className="text-slate-500">Điểm mạnh:</span>
        <span className="font-semibold text-slate-700">{group.strength_score?.toFixed(2)}</span>
        <span className="text-slate-500">Tốc độ:</span>
        <span className="font-semibold text-slate-700">{(group.velocity * 100).toFixed(1)}%</span>
      </div>
      <div className={`mt-2 pt-1 border-t ${color.border} text-xs text-slate-600 font-medium`}>
        {group.money_flow}
      </div>
    </div>
  );
};

const MarketCapFlow = ({ marketCapFlow }) => {
  if (!marketCapFlow) return null;
  const { groups_summary, flow_theme, outperforming_count, underperforming_count } = marketCapFlow;
  const theme = {
    outperform: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    underperform: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="font-bold text-base text-slate-800 mb-4">Phân tích nhóm vốn hóa</h3>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* --- LEFT COLUMN (2/5 width): SUMMARY --- */}
        <div className="lg:col-span-2 space-y-4">
          {/* Flow Theme */}
          <div className="p-3 bg-slate-50 rounded-lg border">
            <h4 className="font-semibold text-sm text-slate-700 mb-1">Xu hướng dòng tiền</h4>
            <p className="text-sm text-slate-600">{flow_theme}</p>
            <div className="text-xs text-slate-500 mt-2">
              <span className="font-medium text-green-600">Vượt trội:</span> {outperforming_count} nhóm |
              <span className="font-medium text-red-600"> Kém:</span> {underperforming_count} nhóm
            </div>
          </div>
          {/* Strongest vs Weakest */}
          {groups_summary && (
            <>
              <GroupAnalysisCard
                title="Nhóm mạnh nhất"
                group={groups_summary.strongest_group}
                color={theme.outperform}
              />
              <GroupAnalysisCard
                title="Nhóm yếu nhất"
                group={groups_summary.weakest_group}
                color={theme.underperform}
              />
            </>
          )}
        </div>
        {/* --- RIGHT COLUMN (3/5 width): GROUP LISTS --- */}
        <div className="lg:col-span-3">
          <h4 className="font-semibold text-sm text-slate-700 mb-2">Hiệu suất nhóm</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Outperforming List */}
            <div>
              <h5 className="font-semibold text-sm text-green-700 mb-2 flex items-center">
                {/* <TrendingUp className="w-4 h-4 mr-1.5" /> */}
                Vượt trội
              </h5>
              <div className="space-y-2">
                {groups_summary?.outperforming_groups?.map((group, idx) => (
                  <GroupAnalysisCard key={idx} group={group} color={theme.outperform} />
                ))}
              </div>
            </div>
            {/* Underperforming List */}
            <div>
              <h5 className="font-semibold text-sm text-red-700 mb-2 flex items-center">
                {/* <TrendingDown className="w-4 h-4 mr-1.5" /> */}
                Kém hiệu quả
              </h5>
              <div className="space-y-2">
                {groups_summary?.underperforming_groups?.map((group, idx) => (
                  <GroupAnalysisCard key={idx} group={group} color={theme.underperform} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCapFlow; 