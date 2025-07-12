import React from 'react';

const DetailedAnalysis = ({ detailedAnalysis }) => {
  if (!detailedAnalysis || !detailedAnalysis.title) return null;

  const getSentimentColor = (sentiment) => {
    if (sentiment?.includes('tích cực') || sentiment?.includes('positive') || sentiment?.includes('bull')) return 'text-green-600';
    if (sentiment?.includes('tiêu cực') || sentiment?.includes('negative') || sentiment?.includes('bear')) return 'text-red-600';
    if (sentiment?.includes('trung tính') || sentiment?.includes('neutral')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'High' || riskLevel === 'HIGH' || riskLevel === 'CRITICAL') return 'text-red-600';
    if (riskLevel === 'Medium' || riskLevel === 'MEDIUM') return 'text-yellow-600';
    if (riskLevel === 'Low' || riskLevel === 'LOW') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">{detailedAnalysis.title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Sector Rotation */}
          {detailedAnalysis.sector_rotation && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Phân tích luân chuyển ngành</h4>
              
              {/* Money Flow Summary */}
              {detailedAnalysis.sector_rotation.money_flow_summary && (
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-1">Tổng quan dòng tiền</div>
                  <div className={`text-sm font-semibold ${getSentimentColor(detailedAnalysis.sector_rotation.money_flow_summary.dominant_theme)}`}>
                    {detailedAnalysis.sector_rotation.money_flow_summary.dominant_theme}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">Sức mạnh:</span> {detailedAnalysis.sector_rotation.money_flow_summary.rotation_strength} | 
                    <span className="font-medium"> Tốc độ:</span> {detailedAnalysis.sector_rotation.money_flow_summary.flow_velocity} | 
                    <span className="font-medium"> Tiền vào:</span> {detailedAnalysis.sector_rotation.money_flow_summary.inflow_count} | 
                    <span className="font-medium"> Tiền ra:</span> {detailedAnalysis.sector_rotation.money_flow_summary.outflow_count}
                  </div>
                </div>
              )}

              {/* Sector Leadership */}
              {detailedAnalysis.sector_rotation.sector_leadership && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Leadership ngành</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Current Leaders */}
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-700">
                        Dòng dẫn dắt hiện tại ({detailedAnalysis.sector_rotation.sector_leadership.current_leaders?.count || 0})
                      </div>
                      <div className="text-xs text-green-600">
                        {detailedAnalysis.sector_rotation.sector_leadership.current_leaders?.strength || 'N/A'}
                      </div>
                      {detailedAnalysis.sector_rotation.sector_leadership.current_leaders?.sectors && detailedAnalysis.sector_rotation.sector_leadership.current_leaders.sectors.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {detailedAnalysis.sector_rotation.sector_leadership.current_leaders.sectors.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Emerging Leaders */}
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm font-medium text-blue-700">
                        Dòng dẫn dắt mới ({detailedAnalysis.sector_rotation.sector_leadership.emerging_leaders?.count || 0})
                      </div>
                      <div className="text-xs text-blue-600">
                        {detailedAnalysis.sector_rotation.sector_leadership.emerging_leaders?.potential || 'N/A'}
                      </div>
                      {detailedAnalysis.sector_rotation.sector_leadership.emerging_leaders?.sectors && detailedAnalysis.sector_rotation.sector_leadership.emerging_leaders.sectors.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {detailedAnalysis.sector_rotation.sector_leadership.emerging_leaders.sectors.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Declining Leaders */}
                    <div className="p-2 bg-red-50 rounded">
                      <div className="text-sm font-medium text-red-700">
                        Dòng dẫn dắt suy yếu ({detailedAnalysis.sector_rotation.sector_leadership.declining_leaders?.count || 0})
                      </div>
                      <div className="text-xs text-red-600">
                        {detailedAnalysis.sector_rotation.sector_leadership.declining_leaders?.warning_level || 'N/A'}
                      </div>
                      {detailedAnalysis.sector_rotation.sector_leadership.declining_leaders?.sectors && detailedAnalysis.sector_rotation.sector_leadership.declining_leaders.sectors.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {detailedAnalysis.sector_rotation.sector_leadership.declining_leaders.sectors.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Rotation Patterns */}
              {detailedAnalysis.sector_rotation.rotation_patterns && (
                <div className="mb-3 p-2 bg-yellow-50 rounded">
                  <div className="text-sm font-medium text-yellow-700 mb-1">Mô hình xoay vòng</div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Ổn định:</span> {detailedAnalysis.sector_rotation.rotation_patterns.stability}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Tốc độ:</span> {detailedAnalysis.sector_rotation.rotation_patterns.rotation_speed}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Chủ đề:</span> {detailedAnalysis.sector_rotation.rotation_patterns.theme}
                  </div>
                </div>
              )}

              {/* Top Rotating Sectors */}
              {detailedAnalysis.sector_rotation.top_rotating_sectors && detailedAnalysis.sector_rotation.top_rotating_sectors.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Top ngành xoay vòng</div>
                  <div className="space-y-1">
                    {detailedAnalysis.sector_rotation.top_rotating_sectors.slice(0, 5).map((sector, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">{sector.name}</div>
                            <div className="text-xs text-gray-600">{sector.money_flow}</div>
                          </div>
                          <div className="text-right ml-2">
                            <div className={`text-xs font-medium ${getSentimentColor(sector.quadrant)}`}>
                              {sector.quadrant}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(sector.velocity * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Flow */}
              {detailedAnalysis.sector_rotation.detailed_flow && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Inflow Sectors */}
                  {detailedAnalysis.sector_rotation.detailed_flow.inflow_sectors && detailedAnalysis.sector_rotation.detailed_flow.inflow_sectors.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-green-700 mb-2">Ngành dòng tiền vào</div>
                      <div className="space-y-1">
                        {detailedAnalysis.sector_rotation.detailed_flow.inflow_sectors.slice(0, 3).map((sector, index) => (
                          <div key={index} className="p-2 bg-green-50 rounded">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-700">{sector.name}</div>
                                <div className={`text-xs ${getSentimentColor(sector.quadrant)}`}>
                                  {sector.quadrant}
                                </div>
                              </div>
                              <div className="text-right ml-2">
                                <div className="text-xs text-green-600">
                                  {(sector.velocity * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Outflow Sectors */}
                  {detailedAnalysis.sector_rotation.detailed_flow.outflow_sectors && detailedAnalysis.sector_rotation.detailed_flow.outflow_sectors.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-red-700 mb-2">Ngành dòng tiền ra</div>
                      <div className="space-y-1">
                        {detailedAnalysis.sector_rotation.detailed_flow.outflow_sectors.slice(0, 3).map((sector, index) => (
                          <div key={index} className="p-2 bg-red-50 rounded">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-700">{sector.name}</div>
                                <div className={`text-xs ${getSentimentColor(sector.quadrant)}`}>
                                  {sector.quadrant}
                                </div>
                              </div>
                              <div className="text-right ml-2">
                                <div className="text-xs text-red-600">
                                  {(sector.velocity * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Market Cap Flow */}
          {detailedAnalysis.market_cap_flow && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">{detailedAnalysis.market_cap_flow.title}</h4>
              
              {/* Flow Theme */}
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-700 mb-1">Chủ đề dòng tiền</div>
                <div className="text-sm text-gray-600">{detailedAnalysis.market_cap_flow.flow_theme}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Vượt trội:</span> {detailedAnalysis.market_cap_flow.outperforming_count} nhóm | 
                  <span className="font-medium"> Kém hiệu quả:</span> {detailedAnalysis.market_cap_flow.underperforming_count} nhóm
                </div>
              </div>

              {/* Groups Summary */}
              {detailedAnalysis.market_cap_flow.groups_summary && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Tổng quan nhóm</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Strongest Group */}
                    {detailedAnalysis.market_cap_flow.groups_summary.strongest_group && (
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-medium text-green-700">Nhóm mạnh nhất</div>
                        <div className="text-xs text-gray-700 font-medium">{detailedAnalysis.market_cap_flow.groups_summary.strongest_group.name}</div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Điểm mạnh:</span> {detailedAnalysis.market_cap_flow.groups_summary.strongest_group.strength_score?.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">RRG:</span> {detailedAnalysis.market_cap_flow.groups_summary.strongest_group.rrg_quadrant}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Tốc độ:</span> {(detailedAnalysis.market_cap_flow.groups_summary.strongest_group.velocity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {detailedAnalysis.market_cap_flow.groups_summary.strongest_group.money_flow}
                        </div>
                      </div>
                    )}

                    {/* Weakest Group */}
                    {detailedAnalysis.market_cap_flow.groups_summary.weakest_group && (
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-sm font-medium text-red-700">Nhóm yếu nhất</div>
                        <div className="text-xs text-gray-700 font-medium">{detailedAnalysis.market_cap_flow.groups_summary.weakest_group.name}</div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Điểm mạnh:</span> {detailedAnalysis.market_cap_flow.groups_summary.weakest_group.strength_score?.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">RRG:</span> {detailedAnalysis.market_cap_flow.groups_summary.weakest_group.rrg_quadrant}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Tốc độ:</span> {(detailedAnalysis.market_cap_flow.groups_summary.weakest_group.velocity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {detailedAnalysis.market_cap_flow.groups_summary.weakest_group.money_flow}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Outperforming Groups */}
              {detailedAnalysis.market_cap_flow.groups_summary?.outperforming_groups && detailedAnalysis.market_cap_flow.groups_summary.outperforming_groups.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-green-700 mb-2">Nhóm vượt trội ({detailedAnalysis.market_cap_flow.groups_summary.outperforming_groups.length})</div>
                  <div className="space-y-1">
                    {detailedAnalysis.market_cap_flow.groups_summary.outperforming_groups.map((group, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">{group.name}</div>
                            <div className="text-xs text-gray-600">{group.money_flow}</div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-xs font-medium text-green-600">
                              {group.rrg_quadrant}
                            </div>
                            <div className="text-xs text-gray-500">
                              {group.strength_score?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Underperforming Groups */}
              {detailedAnalysis.market_cap_flow.groups_summary?.underperforming_groups && detailedAnalysis.market_cap_flow.groups_summary.underperforming_groups.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-red-700 mb-2">Nhóm kém hiệu quả ({detailedAnalysis.market_cap_flow.groups_summary.underperforming_groups.length})</div>
                  <div className="space-y-1">
                    {detailedAnalysis.market_cap_flow.groups_summary.underperforming_groups.map((group, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">{group.name}</div>
                            <div className="text-xs text-gray-600">{group.money_flow}</div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-xs font-medium text-red-600">
                              {group.rrg_quadrant}
                            </div>
                            <div className="text-xs text-gray-500">
                              {group.strength_score?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Analysis */}
              {detailedAnalysis.market_cap_flow.detailed_analysis && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Phân tích chi tiết</div>
                  <div className="space-y-1">
                    {Object.entries(detailedAnalysis.market_cap_flow.detailed_analysis).map(([key, data]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">{data.name}</div>
                            <div className="text-xs text-gray-600">{data.money_flow}</div>
                            <div className="text-xs text-gray-500">{data.performance}</div>
                          </div>
                          <div className="text-right ml-2">
                            <div className={`text-xs font-medium ${getSentimentColor(data.rrg_quadrant)}`}>
                              {data.rrg_quadrant}
                            </div>
                            <div className="text-xs text-gray-500">
                              {data.strength_score?.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(data.velocity * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Momentum Cycles */}
          {detailedAnalysis.momentum_cycles && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Chu kỳ động lượng</h4>
              
              {/* Cycle Interpretation */}
              {detailedAnalysis.momentum_cycles.cycle_interpretation && (
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-1">Diễn giải chu kỳ</div>
                  <div className="text-sm text-gray-600">{detailedAnalysis.momentum_cycles.cycle_interpretation}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Accumulation Phase */}
                {detailedAnalysis.momentum_cycles.accumulation_phase && (
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-sm font-medium text-blue-700 mb-2">
                      Giai đoạn tích lũy ({detailedAnalysis.momentum_cycles.accumulation_phase.count} - {detailedAnalysis.momentum_cycles.accumulation_phase.percentage})
                    </div>
                    {detailedAnalysis.momentum_cycles.accumulation_phase.top_candidates && detailedAnalysis.momentum_cycles.accumulation_phase.top_candidates.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Ứng viên hàng đầu:</div>
                        {detailedAnalysis.momentum_cycles.accumulation_phase.top_candidates.slice(0, 3).map((candidate, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{candidate.symbol}</span>
                            <div className="text-gray-500">
                              Tốc độ: {(candidate.speed * 100).toFixed(2)}% | 
                              Gia tốc: {(candidate.acceleration * 100).toFixed(2)}% | 
                              Tỷ lệ: {candidate.momentum_ratio?.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Acceleration Phase */}
                {detailedAnalysis.momentum_cycles.acceleration_phase && (
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-sm font-medium text-green-700 mb-2">
                      Giai đoạn gia tốc ({detailedAnalysis.momentum_cycles.acceleration_phase.count} - {detailedAnalysis.momentum_cycles.acceleration_phase.percentage})
                    </div>
                    {detailedAnalysis.momentum_cycles.acceleration_phase.top_candidates && detailedAnalysis.momentum_cycles.acceleration_phase.top_candidates.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Ứng viên hàng đầu:</div>
                        {detailedAnalysis.momentum_cycles.acceleration_phase.top_candidates.slice(0, 3).map((candidate, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{candidate.symbol}</span>
                            <div className="text-gray-500">
                              Tốc độ: {(candidate.speed * 100).toFixed(2)}% | 
                              Gia tốc: {(candidate.acceleration * 100).toFixed(2)}% | 
                              Tỷ lệ: {candidate.momentum_ratio?.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Momentum Phase */}
                {detailedAnalysis.momentum_cycles.momentum_phase && (
                  <div className="p-2 bg-yellow-50 rounded">
                    <div className="text-sm font-medium text-yellow-700 mb-2">
                      Giai đoạn động lượng ({detailedAnalysis.momentum_cycles.momentum_phase.count} - {detailedAnalysis.momentum_cycles.momentum_phase.percentage})
                    </div>
                    {detailedAnalysis.momentum_cycles.momentum_phase.top_candidates && detailedAnalysis.momentum_cycles.momentum_phase.top_candidates.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Ứng viên hàng đầu:</div>
                        {detailedAnalysis.momentum_cycles.momentum_phase.top_candidates.slice(0, 3).map((candidate, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{candidate.symbol}</span>
                            <div className="text-gray-500">
                              Tốc độ: {(candidate.speed * 100).toFixed(2)}% | 
                              Gia tốc: {(candidate.acceleration * 100).toFixed(2)}% | 
                              Tỷ lệ: {candidate.momentum_ratio?.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Exhaustion Phase */}
                {detailedAnalysis.momentum_cycles.exhaustion_phase && (
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-sm font-medium text-red-700 mb-2">
                      Giai đoạn kiệt sức ({detailedAnalysis.momentum_cycles.exhaustion_phase.count} - {detailedAnalysis.momentum_cycles.exhaustion_phase.percentage})
                    </div>
                    {detailedAnalysis.momentum_cycles.exhaustion_phase.warning_list && detailedAnalysis.momentum_cycles.exhaustion_phase.warning_list.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Danh sách cảnh báo:</div>
                        {detailedAnalysis.momentum_cycles.exhaustion_phase.warning_list.slice(0, 3).map((warning, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{warning.symbol}</span>
                            <div className="text-gray-500">
                              Tốc độ: {(warning.speed * 100).toFixed(2)}% | 
                              Gia tốc: {(warning.acceleration * 100).toFixed(2)}% | 
                              Tỷ lệ: {warning.momentum_ratio?.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reversal Phase */}
                {detailedAnalysis.momentum_cycles.reversal_phase && (
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="text-sm font-medium text-purple-700 mb-2">
                      Giai đoạn đảo chiều ({detailedAnalysis.momentum_cycles.reversal_phase.count} - {detailedAnalysis.momentum_cycles.reversal_phase.percentage})
                    </div>
                    {detailedAnalysis.momentum_cycles.reversal_phase.watch_list && detailedAnalysis.momentum_cycles.reversal_phase.watch_list.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Danh sách theo dõi:</div>
                        {detailedAnalysis.momentum_cycles.reversal_phase.watch_list.slice(0, 3).map((watch, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{watch.symbol}</span>
                            <div className="text-gray-500">
                              Tốc độ: {(watch.speed * 100).toFixed(2)}% | 
                              Gia tốc: {(watch.acceleration * 100).toFixed(2)}% | 
                              Tỷ lệ: {watch.momentum_ratio?.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Institutional Flow */}
          {detailedAnalysis.institutional_flow && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Dòng tiền tổ chức</h4>
              
              {/* Overall Sentiment */}
              {detailedAnalysis.institutional_flow.overall_sentiment && (
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-1">Tổng quan</div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Mua:</span> {detailedAnalysis.institutional_flow.overall_sentiment.buying_percentage || 'N/A'} | 
                    <span className="font-medium"> Bán:</span> {detailedAnalysis.institutional_flow.overall_sentiment.selling_percentage || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {detailedAnalysis.institutional_flow.overall_sentiment.interpretation || 'N/A'}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Institutional Buying */}
                {detailedAnalysis.institutional_flow.institutional_buying && (
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-medium text-sm text-green-700 mb-2">Tổ chức mua vào ({detailedAnalysis.institutional_flow.institutional_buying.count || 0})</div>
                    <div className={`text-xs mb-2 ${detailedAnalysis.institutional_flow.institutional_buying.sentiment === 'Tích cực' ? 'text-green-600' : 'text-red-600'}`}>
                      {detailedAnalysis.institutional_flow.institutional_buying.sentiment || 'N/A'}
                    </div>
                    {detailedAnalysis.institutional_flow.institutional_buying.top_targets && detailedAnalysis.institutional_flow.institutional_buying.top_targets.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Mục tiêu hàng đầu:</div>
                        {detailedAnalysis.institutional_flow.institutional_buying.top_targets.slice(0, 5).map((target, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{target.symbol}</span> - {target.direction} 
                            <span className="text-green-600"> ({(target.speed * 100).toFixed(2)}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Institutional Selling */}
                {detailedAnalysis.institutional_flow.institutional_selling && (
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-medium text-sm text-red-700 mb-2">Tổ chức bán ra ({detailedAnalysis.institutional_flow.institutional_selling.count || 0})</div>
                    {detailedAnalysis.institutional_flow.institutional_selling.top_exits && detailedAnalysis.institutional_flow.institutional_selling.top_exits.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Thoát hàng đầu:</div>
                        {detailedAnalysis.institutional_flow.institutional_selling.top_exits.slice(0, 5).map((exit, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{exit.symbol}</span> - {exit.direction}
                            <span className="text-red-600"> ({(exit.speed * 100).toFixed(2)}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mixed Signals */}
                {detailedAnalysis.institutional_flow.mixed_signals && (
                  <div className="p-2 bg-yellow-50 rounded">
                    <div className="font-medium text-sm text-yellow-700 mb-2">Tín hiệu hỗn hợp ({detailedAnalysis.institutional_flow.mixed_signals.count || 0})</div>
                    {detailedAnalysis.institutional_flow.mixed_signals.watch_list && detailedAnalysis.institutional_flow.mixed_signals.watch_list.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Danh sách theo dõi:</div>
                        {detailedAnalysis.institutional_flow.mixed_signals.watch_list.slice(0, 5).map((item, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{item.symbol}</span> - {item.direction}
                            <span className="text-yellow-600"> ({(item.speed * 100).toFixed(2)}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk Distribution */}
          {detailedAnalysis.risk_distribution && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Phân bổ rủi ro</h4>
              
              {/* Risk Assessment */}
              {detailedAnalysis.risk_distribution.risk_assessment && (
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-1">Đánh giá rủi ro</div>
                  <div className="text-sm font-semibold text-green-600">{detailedAnalysis.risk_distribution.risk_assessment.environment || 'N/A'}</div>
                  <div className="text-xs text-gray-600">{detailedAnalysis.risk_distribution.risk_assessment.description || 'N/A'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Khuyến nghị:</span> {detailedAnalysis.risk_distribution.risk_assessment.recommendation || 'N/A'}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Risk Level Distribution */}
                {detailedAnalysis.risk_distribution.risk_level_distribution && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">Phân bổ mức rủi ro</div>
                    
                    {/* High Risk */}
                    {detailedAnalysis.risk_distribution.risk_level_distribution.high_risk && (
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-sm font-medium text-red-700">
                          Rủi ro cao ({detailedAnalysis.risk_distribution.risk_level_distribution.high_risk.count || 0} - {detailedAnalysis.risk_distribution.risk_level_distribution.high_risk.percentage || 'N/A'})
                        </div>
                        {detailedAnalysis.risk_distribution.risk_level_distribution.high_risk.items && detailedAnalysis.risk_distribution.risk_level_distribution.high_risk.items.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            {detailedAnalysis.risk_distribution.risk_level_distribution.high_risk.items.slice(0, 3).map((item, index) => (
                              <div key={index}>
                                {item.name} ({item.type}) - Vol: {(item.volatility * 100).toFixed(2)}%
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Medium Risk */}
                    {detailedAnalysis.risk_distribution.risk_level_distribution.medium_risk && (
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-sm font-medium text-yellow-700">
                          Rủi ro trung bình ({detailedAnalysis.risk_distribution.risk_level_distribution.medium_risk.count || 0} - {detailedAnalysis.risk_distribution.risk_level_distribution.medium_risk.percentage || 'N/A'})
                        </div>
                      </div>
                    )}

                    {/* Low Risk */}
                    {detailedAnalysis.risk_distribution.risk_level_distribution.low_risk && (
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-medium text-green-700">
                          Rủi ro thấp ({detailedAnalysis.risk_distribution.risk_level_distribution.low_risk.count || 0} - {detailedAnalysis.risk_distribution.risk_level_distribution.low_risk.percentage || 'N/A'})
                        </div>
                        {detailedAnalysis.risk_distribution.risk_level_distribution.low_risk.items && detailedAnalysis.risk_distribution.risk_level_distribution.low_risk.items.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            {detailedAnalysis.risk_distribution.risk_level_distribution.low_risk.items.slice(0, 3).map((item, index) => (
                              <div key={index}>
                                {item.name} ({item.type}) - Vol: {(item.volatility * 100).toFixed(2)}%
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Volatility Distribution */}
                {detailedAnalysis.risk_distribution.volatility_distribution && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">Phân bổ biến động</div>
                    
                    {/* Very High Volatility */}
                    {detailedAnalysis.risk_distribution.volatility_distribution.very_high_volatility && (
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-sm font-medium text-red-700">
                          Biến động rất cao ({detailedAnalysis.risk_distribution.volatility_distribution.very_high_volatility.count || 0} - {detailedAnalysis.risk_distribution.volatility_distribution.very_high_volatility.percentage || 'N/A'})
                        </div>
                      </div>
                    )}

                    {/* High Volatility */}
                    {detailedAnalysis.risk_distribution.volatility_distribution.high_volatility && (
                      <div className="p-2 bg-orange-50 rounded">
                        <div className="text-sm font-medium text-orange-700">
                          Biến động cao ({detailedAnalysis.risk_distribution.volatility_distribution.high_volatility.count || 0} - {detailedAnalysis.risk_distribution.volatility_distribution.high_volatility.percentage || 'N/A'})
                        </div>
                      </div>
                    )}

                    {/* Medium Volatility */}
                    {detailedAnalysis.risk_distribution.volatility_distribution.medium_volatility && (
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-sm font-medium text-yellow-700">
                          Biến động trung bình ({detailedAnalysis.risk_distribution.volatility_distribution.medium_volatility.count || 0} - {detailedAnalysis.risk_distribution.volatility_distribution.medium_volatility.percentage || 'N/A'})
                        </div>
                      </div>
                    )}

                    {/* Low Volatility */}
                    {detailedAnalysis.risk_distribution.volatility_distribution.low_volatility && (
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-medium text-green-700">
                          Biến động thấp ({detailedAnalysis.risk_distribution.volatility_distribution.low_volatility.count || 0} - {detailedAnalysis.risk_distribution.volatility_distribution.low_volatility.percentage || 'N/A'})
                        </div>
                        {detailedAnalysis.risk_distribution.volatility_distribution.low_volatility.items && detailedAnalysis.risk_distribution.volatility_distribution.low_volatility.items.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            {detailedAnalysis.risk_distribution.volatility_distribution.low_volatility.items.slice(0, 3).map((item, index) => (
                              <div key={index}>
                                {item.name} ({item.type}) - Vol: {(item.volatility * 100).toFixed(2)}%
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Systemic Risks */}
          {detailedAnalysis.systemic_risks && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Rủi ro hệ thống</h4>
              
              {/* Overall Systemic Risk */}
              {detailedAnalysis.systemic_risks.overall_systemic_risk && (
                <div className="mb-3 p-2 bg-red-50 rounded">
                  <div className="text-sm font-medium text-red-700 mb-1">Tổng quan rủi ro hệ thống</div>
                  <div className={`text-sm font-semibold ${getRiskColor(detailedAnalysis.systemic_risks.overall_systemic_risk.level)}`}>
                    {detailedAnalysis.systemic_risks.overall_systemic_risk.level || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {detailedAnalysis.systemic_risks.overall_systemic_risk.description || 'N/A'}
                  </div>
                </div>
              )}

              {/* Risk Count */}
              {detailedAnalysis.systemic_risks.risk_count && (
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Số lượng rủi ro:</span> {detailedAnalysis.systemic_risks.risk_count}
                </div>
              )}

              {/* Individual Systemic Risks */}
              {detailedAnalysis.systemic_risks.systemic_risks && detailedAnalysis.systemic_risks.systemic_risks.length > 0 && (
                <div className="space-y-2 mb-3">
                  <div className="text-sm font-medium text-gray-700">Các yếu tố rủi ro:</div>
                  {detailedAnalysis.systemic_risks.systemic_risks.map((risk, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">{risk.type}</div>
                          <div className="text-xs text-gray-600">{risk.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{risk.implication}</div>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ml-2 ${
                          risk.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                          risk.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {risk.severity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mitigation Strategies */}
              {detailedAnalysis.systemic_risks.mitigation_strategies && detailedAnalysis.systemic_risks.mitigation_strategies.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Chiến lược giảm thiểu rủi ro:</div>
                  <div className="space-y-2">
                    {detailedAnalysis.systemic_risks.mitigation_strategies.map((strategy, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-blue-700">{strategy.strategy}</div>
                            <div className="text-xs text-gray-600">{strategy.description}</div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium ml-2">
                            {strategy.timeframe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Volatility Regime */}
          {detailedAnalysis.volatility_regime && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Trạng thái biến động</h4>
              
              {/* Regime Overview */}
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-700 mb-1">Tổng quan chế độ</div>
                <div className="text-sm font-semibold text-blue-600">{detailedAnalysis.volatility_regime.regime || 'N/A'}</div>
                <div className="text-xs text-gray-600">{detailedAnalysis.volatility_regime.regime_description || 'N/A'}</div>
              </div>

              {/* Statistics */}
              {detailedAnalysis.volatility_regime.statistics && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Thống kê biến động</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 rounded text-center">
                      <div className="font-medium text-blue-700">Trung bình</div>
                      <div className="text-blue-600">{detailedAnalysis.volatility_regime.statistics.average_volatility || 'N/A'}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded text-center">
                      <div className="font-medium text-green-700">Trung vị</div>
                      <div className="text-green-600">{detailedAnalysis.volatility_regime.statistics.median_volatility || 'N/A'}</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded text-center">
                      <div className="font-medium text-red-700">Cao</div>
                      <div className="text-red-600">{detailedAnalysis.volatility_regime.statistics.high_volatility_percentage || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Volatility Distribution */}
              {detailedAnalysis.volatility_regime.volatility_distribution && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Phân bổ biến động</div>
                  <div className="space-y-2">
                    {/* Low Volatility */}
                    {detailedAnalysis.volatility_regime.volatility_distribution.low_volatility && (
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-medium text-green-700 mb-1">
                          Biến động thấp ({detailedAnalysis.volatility_regime.volatility_distribution.low_volatility.count || 0} - {detailedAnalysis.volatility_regime.volatility_distribution.low_volatility.percentage || 'N/A'})
                        </div>
                        {detailedAnalysis.volatility_regime.volatility_distribution.low_volatility.top_symbols && detailedAnalysis.volatility_regime.volatility_distribution.low_volatility.top_symbols.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Top symbols:</span>
                            {detailedAnalysis.volatility_regime.volatility_distribution.low_volatility.top_symbols.slice(0, 3).map((symbol, index) => (
                              <span key={index} className="ml-1">
                                {symbol.symbol} ({(symbol.volatility * 100).toFixed(3)}%)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Medium Volatility */}
                    {detailedAnalysis.volatility_regime.volatility_distribution.medium_volatility && (
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-sm font-medium text-yellow-700">
                          Biến động trung bình ({detailedAnalysis.volatility_regime.volatility_distribution.medium_volatility.count || 0} - {detailedAnalysis.volatility_regime.volatility_distribution.medium_volatility.percentage || 'N/A'})
                        </div>
                      </div>
                    )}

                    {/* High Volatility */}
                    {detailedAnalysis.volatility_regime.volatility_distribution.high_volatility && (
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-sm font-medium text-red-700 mb-1">
                          Biến động cao ({detailedAnalysis.volatility_regime.volatility_distribution.high_volatility.count || 0} - {detailedAnalysis.volatility_regime.volatility_distribution.high_volatility.percentage || 'N/A'})
                        </div>
                        {detailedAnalysis.volatility_regime.volatility_distribution.high_volatility.top_symbols && detailedAnalysis.volatility_regime.volatility_distribution.high_volatility.top_symbols.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Top symbols:</span>
                            {detailedAnalysis.volatility_regime.volatility_distribution.high_volatility.top_symbols.slice(0, 3).map((symbol, index) => (
                              <span key={index} className="ml-1">
                                {symbol.symbol} ({(symbol.volatility * 100).toFixed(3)}%)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trading Implications */}
              {detailedAnalysis.volatility_regime.trading_implications && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Tác động giao dịch</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-700">Kích thước vị thế</div>
                      <div className="text-blue-600">{detailedAnalysis.volatility_regime.trading_implications.position_sizing || 'N/A'}</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <div className="font-medium text-red-700">Stop loss</div>
                      <div className="text-red-600">{detailedAnalysis.volatility_regime.trading_implications.stop_losses || 'N/A'}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-700">Chiến lược</div>
                      <div className="text-green-600">{detailedAnalysis.volatility_regime.trading_implications.strategy || 'N/A'}</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <div className="font-medium text-yellow-700">Quản lý rủi ro</div>
                      <div className="text-yellow-600">{detailedAnalysis.volatility_regime.trading_implications.risk_management || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Speed Distribution */}
          {detailedAnalysis.speed_distribution && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Phân bổ tốc độ động lượng</h4>
              
              {/* Market Momentum Health */}
              {detailedAnalysis.speed_distribution.market_momentum_health && (
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-1">Sức khỏe động lượng thị trường</div>
                  <div className="text-sm font-semibold text-green-600">{detailedAnalysis.speed_distribution.market_momentum_health.status || 'N/A'}</div>
                  <div className="text-xs text-gray-600">{detailedAnalysis.speed_distribution.market_momentum_health.description || 'N/A'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Tốc độ cao:</span> {detailedAnalysis.speed_distribution.market_momentum_health.high_speed_percentage} | 
                    <span className="font-medium"> Tăng tốc:</span> {detailedAnalysis.speed_distribution.market_momentum_health.accelerating_percentage} | 
                    <span className="font-medium"> Giảm tốc:</span> {detailedAnalysis.speed_distribution.market_momentum_health.decelerating_percentage}
                  </div>
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    {detailedAnalysis.speed_distribution.market_momentum_health.recommendation || 'N/A'}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Speed Distribution */}
                {detailedAnalysis.speed_distribution.speed_distribution && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Phân bổ tốc độ</div>
                    <div className="space-y-2">
                      {/* Very High Speed */}
                      {detailedAnalysis.speed_distribution.speed_distribution.very_high_speed && (
                        <div className="p-2 bg-red-50 rounded">
                          <div className="text-sm font-medium text-red-700 mb-1">
                            Tốc độ rất cao ({detailedAnalysis.speed_distribution.speed_distribution.very_high_speed.count} - {detailedAnalysis.speed_distribution.speed_distribution.very_high_speed.percentage})
                          </div>
                          {detailedAnalysis.speed_distribution.speed_distribution.very_high_speed.items && detailedAnalysis.speed_distribution.speed_distribution.very_high_speed.items.length > 0 && (
                            <div className="space-y-1">
                              {detailedAnalysis.speed_distribution.speed_distribution.very_high_speed.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  <span className="font-medium">{item.name}</span> ({item.type})
                                  <div className="text-gray-500">
                                    Tốc độ: {(item.speed * 100).toFixed(3)}% | 
                                    Gia tốc: {(item.acceleration * 100).toFixed(3)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* High Speed */}
                      {detailedAnalysis.speed_distribution.speed_distribution.high_speed && (
                        <div className="p-2 bg-orange-50 rounded">
                          <div className="text-sm font-medium text-orange-700 mb-1">
                            Tốc độ cao ({detailedAnalysis.speed_distribution.speed_distribution.high_speed.count} - {detailedAnalysis.speed_distribution.speed_distribution.high_speed.percentage})
                          </div>
                          {detailedAnalysis.speed_distribution.speed_distribution.high_speed.items && detailedAnalysis.speed_distribution.speed_distribution.high_speed.items.length > 0 && (
                            <div className="space-y-1">
                              {detailedAnalysis.speed_distribution.speed_distribution.high_speed.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  <span className="font-medium">{item.name}</span> ({item.type})
                                  <div className="text-gray-500">
                                    Tốc độ: {(item.speed * 100).toFixed(3)}% | 
                                    Gia tốc: {(item.acceleration * 100).toFixed(3)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Medium Speed */}
                      {detailedAnalysis.speed_distribution.speed_distribution.medium_speed && (
                        <div className="p-2 bg-yellow-50 rounded">
                          <div className="text-sm font-medium text-yellow-700">
                            Tốc độ trung bình ({detailedAnalysis.speed_distribution.speed_distribution.medium_speed.count} - {detailedAnalysis.speed_distribution.speed_distribution.medium_speed.percentage})
                          </div>
                        </div>
                      )}

                      {/* Low Speed */}
                      {detailedAnalysis.speed_distribution.speed_distribution.low_speed && (
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700">
                            Tốc độ thấp ({detailedAnalysis.speed_distribution.speed_distribution.low_speed.count} - {detailedAnalysis.speed_distribution.speed_distribution.low_speed.percentage})
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Acceleration Distribution */}
                {detailedAnalysis.speed_distribution.acceleration_distribution && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Phân bổ gia tốc</div>
                    <div className="space-y-2">
                      {/* Strong Acceleration */}
                      {detailedAnalysis.speed_distribution.acceleration_distribution.strong_acceleration && (
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700 mb-1">
                            Gia tốc mạnh ({detailedAnalysis.speed_distribution.acceleration_distribution.strong_acceleration.count} - {detailedAnalysis.speed_distribution.acceleration_distribution.strong_acceleration.percentage})
                          </div>
                          {detailedAnalysis.speed_distribution.acceleration_distribution.strong_acceleration.items && detailedAnalysis.speed_distribution.acceleration_distribution.strong_acceleration.items.length > 0 && (
                            <div className="space-y-1">
                              {detailedAnalysis.speed_distribution.acceleration_distribution.strong_acceleration.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  <span className="font-medium">{item.name}</span> ({item.type})
                                  <div className="text-gray-500">
                                    Tốc độ: {(item.speed * 100).toFixed(3)}% | 
                                    Gia tốc: {(item.acceleration * 100).toFixed(3)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Weak Acceleration */}
                      {detailedAnalysis.speed_distribution.acceleration_distribution.weak_acceleration && (
                        <div className="p-2 bg-yellow-50 rounded">
                          <div className="text-sm font-medium text-yellow-700">
                            Gia tốc yếu ({detailedAnalysis.speed_distribution.acceleration_distribution.weak_acceleration.count} - {detailedAnalysis.speed_distribution.acceleration_distribution.weak_acceleration.percentage})
                          </div>
                        </div>
                      )}

                      {/* Weak Deceleration */}
                      {detailedAnalysis.speed_distribution.acceleration_distribution.weak_deceleration && (
                        <div className="p-2 bg-orange-50 rounded">
                          <div className="text-sm font-medium text-orange-700">
                            Giảm tốc yếu ({detailedAnalysis.speed_distribution.acceleration_distribution.weak_deceleration.count} - {detailedAnalysis.speed_distribution.acceleration_distribution.weak_deceleration.percentage})
                          </div>
                        </div>
                      )}

                      {/* Strong Deceleration */}
                      {detailedAnalysis.speed_distribution.acceleration_distribution.strong_deceleration && (
                        <div className="p-2 bg-red-50 rounded">
                          <div className="text-sm font-medium text-red-700 mb-1">
                            Giảm tốc mạnh ({detailedAnalysis.speed_distribution.acceleration_distribution.strong_deceleration.count} - {detailedAnalysis.speed_distribution.acceleration_distribution.strong_deceleration.percentage})
                          </div>
                          {detailedAnalysis.speed_distribution.acceleration_distribution.strong_deceleration.items && detailedAnalysis.speed_distribution.acceleration_distribution.strong_deceleration.items.length > 0 && (
                            <div className="space-y-1">
                              {detailedAnalysis.speed_distribution.acceleration_distribution.strong_deceleration.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  <span className="font-medium">{item.name}</span> ({item.type})
                                  <div className="text-gray-500">
                                    Tốc độ: {(item.speed * 100).toFixed(3)}% | 
                                    Gia tốc: {(item.acceleration * 100).toFixed(3)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis; 