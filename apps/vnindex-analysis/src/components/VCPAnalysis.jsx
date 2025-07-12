import React, { useState, useMemo } from 'react';
import { loadVCPData, getVCPSummary } from '../utils/vcpDataLoader';

const VCPAnalysis = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [recencyFilter, setRecencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');

  const vcpData = useMemo(() => {
    try {
      return loadVCPData(timeframe);
    } catch (error) {
      console.error('Error loading VCP data in component:', error);
      return null;
    }
  }, [timeframe]);

  const summary = useMemo(() => {
    return vcpData ? getVCPSummary(timeframe) : null;
  }, [vcpData, timeframe]);

  const filteredSignals = useMemo(() => {
    if (!vcpData) return [];

    let filtered = vcpData.signals;

    // Apply confidence filter
    if (confidenceFilter !== 'all') {
      filtered = filtered.filter(signal => signal.confidenceLevel === confidenceFilter);
    }

    // Apply recency filter
    if (recencyFilter !== 'all') {
      filtered = filtered.filter(signal => signal.recency === recencyFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.last_vcp_confidence - a.last_vcp_confidence;
        case 'recency':
          return a.days_since_vcp - b.days_since_vcp;
        case 'price':
          return b.last_close - a.last_close;
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        default:
          return 0;
      }
    });

    return filtered;
  }, [vcpData, confidenceFilter, recencyFilter, sortBy]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return 'text-green-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecencyColor = (daysSince) => {
    if (daysSince <= 3) return 'text-green-600';
    if (daysSince <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.7) return 'bg-green-100 text-green-800';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRecencyBadge = (daysSince) => {
    if (daysSince <= 3) return 'bg-green-100 text-green-800';
    if (daysSince <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!vcpData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-medium">Error loading VCP data</div>
          <div className="text-gray-600 mt-2">Please check the console for more details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Phân tích Mẫu VCP (Volume, Close, Price)
        </h3>
        <p className="text-gray-600 text-sm">
          Tín hiệu mẫu VCP phát hiện các mẫu tích lũy và phân phối dựa trên mối quan hệ giữa khối lượng và giá.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-gray-50 rounded-lg border p-4 flex items-center space-x-4 mb-6">
        <span className="text-sm font-medium text-gray-700">Khung thời gian:</span>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setTimeframe('1D')}
        >
          Hàng ngày (1D)
        </button>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setTimeframe('1W')}
        >
          Hàng tuần (1W)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{summary?.totalSignals || 0}</div>
          <div className="text-sm text-gray-600">Tổng tín hiệu</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary?.recentSignals || 0}</div>
          <div className="text-sm text-green-600">Tín hiệu gần đây (≤7 ngày)</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary?.highConfidenceSignals || 0}</div>
          <div className="text-sm text-blue-600">Tín hiệu độ tin cậy cao</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {summary?.averageConfidence ? (summary.averageConfidence * 100).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-purple-600">Độ tin cậy trung bình</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Độ tin cậy:</label>
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="high">Cao (≥70%)</option>
            <option value="medium">Trung bình (≥50%)</option>
            <option value="low">Thấp (&lt;50%)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Thời gian:</label>
          <select
            value={recencyFilter}
            onChange={(e) => setRecencyFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="recent">Gần đây (≤3 ngày)</option>
            <option value="moderate">Vừa phải (≤7 ngày)</option>
            <option value="old">Cũ (&gt;7 ngày)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="confidence">Độ tin cậy</option>
            <option value="recency">Thời gian</option>
            <option value="price">Giá</option>
            <option value="symbol">Mã</option>
          </select>
        </div>
      </div>

      {/* Signals Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá đóng cửa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Độ tin cậy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày trước
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSignals.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có tín hiệu VCP nào phù hợp với bộ lọc hiện tại
                </td>
              </tr>
            ) : (
              filteredSignals.map((signal, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{signal.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {signal.last_close?.toLocaleString('vi-VN') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getConfidenceColor(signal.last_vcp_confidence)}`}>
                        {(signal.last_vcp_confidence * 100).toFixed(1)}%
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceBadge(signal.last_vcp_confidence)}`}>
                        {signal.confidenceLevel === 'high' ? 'Cao' : 
                         signal.confidenceLevel === 'medium' ? 'TB' : 'Thấp'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getRecencyColor(signal.days_since_vcp)}`}>
                        {signal.days_since_vcp} ngày
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecencyBadge(signal.days_since_vcp)}`}>
                        {signal.recency === 'recent' ? 'Gần' : 
                         signal.recency === 'moderate' ? 'TB' : 'Cũ'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      VCP Phát hiện
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Chú thích:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p><strong>Độ tin cậy:</strong></p>
            <ul className="space-y-1 mt-1">
              <li>• <span className="text-green-600">Cao (≥70%):</span> Tín hiệu mạnh, khả năng cao</li>
              <li>• <span className="text-yellow-600">Trung bình (≥50%):</span> Tín hiệu vừa phải</li>
              <li>• <span className="text-red-600">Thấp (&lt;50%):</span> Tín hiệu yếu, cần thận trọng</li>
            </ul>
          </div>
          <div>
            <p><strong>Thời gian:</strong></p>
            <ul className="space-y-1 mt-1">
              <li>• <span className="text-green-600">Gần đây (≤3 ngày):</span> Tín hiệu mới nhất</li>
              <li>• <span className="text-yellow-600">Vừa phải (≤7 ngày):</span> Tín hiệu còn hiệu lực</li>
              <li>• <span className="text-red-600">Cũ (&gt;7 ngày):</span> Tín hiệu có thể đã lỗi thời</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCPAnalysis; 