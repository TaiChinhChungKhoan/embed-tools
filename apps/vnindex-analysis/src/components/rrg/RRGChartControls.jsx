import React from 'react';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";

const RRGChartControls = ({
  type,
  trailLength,
  setTrailLength,
  selectedIndustries,
  setSelectedIndustries,
  selectedGroups,
  setSelectedGroups,
  selectedTickerIndustries,
  setSelectedTickerIndustries,
  specialTickerFilter,
  setSpecialTickerFilter,
  availableIndustries,
  availableGroups,
  filteredData
}) => {
  return (
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
  );
};

export default RRGChartControls; 