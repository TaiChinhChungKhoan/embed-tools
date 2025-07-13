import React from 'react';

// A highly compact component to display a single candidate on one line.
const CompactCandidateItem = ({ candidate }) => {
  if (!candidate) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 hover:bg-slate-50">
      {/* Symbol */}
      <div className="font-bold text-sm text-slate-800 w-16">
        {candidate.symbol}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-end gap-4 text-xs">
        <div className="text-right">
          <div className="text-slate-500">Tốc độ</div>
          <div className="font-semibold">{(candidate.speed * 100).toFixed(1)}%</div>
        </div>
        <div className="text-right">
          <div className="text-slate-500">Gia tốc</div>
          <div className="font-semibold">{(candidate.acceleration * 100).toFixed(1)}%</div>
        </div>
        <div className="text-right">
          <div className="text-slate-500">Tỷ lệ</div>
          <div className="font-semibold">{candidate.momentum_ratio?.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

// A standardized card for each phase of the momentum cycle.
// This now uses the new CompactCandidateItem.
const CyclePhaseCard = ({ title, phaseData, listTitle, color, Icon }) => {
  if (!phaseData) return null;

  const candidates = phaseData.top_candidates || phaseData.warning_list || phaseData.watch_list || [];

  return (
    <div className={`p-3 rounded-lg border flex flex-col ${color.bg} ${color.border}`}>
      {/* Card Header */}
      <div className="flex items-center mb-1">
        {Icon && <Icon className={`w-5 h-5 mr-2 shrink-0 ${color.text}`} />}
        <h5 className={`font-semibold text-sm ${color.text}`}>{title}</h5>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-3 -mt-1">
        {phaseData.count} mã ({phaseData.percentage})
      </p>
      
      {/* List of Compact Items */}
      {candidates.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">{listTitle}:</p>
          {candidates.slice(0, 5).map((candidate, index) => ( // Show up to 5
            <CompactCandidateItem key={index} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
};

const MomentumCycles = ({ momentumCycles }) => {
  if (!momentumCycles) return null;

  const {
    cycle_interpretation,
    accumulation_phase,
    acceleration_phase,
    momentum_phase,
    exhaustion_phase,
    reversal_phase
  } = momentumCycles;

  const theme = {
    accumulation: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', Icon: null },
    acceleration: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', Icon: null },
    momentum: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', Icon: null },
    exhaustion: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', Icon: null },
    reversal: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', Icon: null },
  };

  return (
    <div className="p-4 bg-white rounded-lg border space-y-4">
      <div>
        <h3 className="font-bold text-base text-slate-800">Chu kỳ động lượng</h3>
        {cycle_interpretation && (
          <p className="text-sm text-slate-600 mt-1">{cycle_interpretation}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* We map over the phases to keep the code DRY */}
        {[
          { key: 'accumulation', title: 'Tích lũy', data: accumulation_phase, listTitle: 'Ứng viên hàng đầu' },
          { key: 'acceleration', title: 'Tăng tốc', data: acceleration_phase, listTitle: 'Ứng viên hàng đầu' },
          { key: 'momentum', title: 'Động lượng', data: momentum_phase, listTitle: 'Ứng viên hàng đầu' },
          { key: 'exhaustion', title: 'Kiệt sức', data: exhaustion_phase, listTitle: 'Danh sách cảnh báo' },
          { key: 'reversal', title: 'Đảo chiều', data: reversal_phase, listTitle: 'Danh sách theo dõi' },
        ].map(phase => (
          phase.data ? (
            <CyclePhaseCard
              key={phase.key}
              title={phase.title}
              phaseData={phase.data}
              listTitle={phase.listTitle}
              color={theme[phase.key]}
              Icon={theme[phase.key].Icon}
            />
          ) : null
        ))}
      </div>
    </div>
  );
};

export default MomentumCycles; 