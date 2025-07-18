import React from 'react';
import Card from './Card';

const IndustryStatistics = ({ industries, analysisDate, lookbackPeriod, keyMetrics, getSentimentColor, marketOverview }) => {
  if (!industries || industries.length === 0) {
    return null;
  }

  // Collect all cards in an array
  const cards = [
    // Outperforming Industry Card
    <Card key="outperforming-industry" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">Ngành vượt trội</h4>
      <div className="text-lg font-semibold text-green-600">{keyMetrics?.outperforming_industries || 'N/A'}</div>
      <div className={`text-sm ${getSentimentColor ? getSentimentColor(keyMetrics?.industry_sentiment) : ''}`}>
        {keyMetrics?.industry_sentiment || 'N/A'}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {keyMetrics?.outperforming_industries_pct || 'N/A'}
      </div>
    </Card>,
    // Outperforming Symbol Card
    <Card key="outperforming-symbol" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">Cổ phiếu vượt trội</h4>
      <div className="text-lg font-semibold text-green-600">{keyMetrics?.outperforming_symbols || 'N/A'}</div>
      <div className={`text-sm ${getSentimentColor ? getSentimentColor(keyMetrics?.symbol_sentiment) : ''}`}>
        {keyMetrics?.symbol_sentiment || 'N/A'}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {keyMetrics?.outperforming_symbols_pct || 'N/A'}
      </div>
    </Card>,
    // Outperforming Group Card
    <Card key="outperforming-group" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">Nhóm vốn hóa vượt trội</h4>
      <div className="text-lg font-semibold text-green-600">{keyMetrics?.outperforming_groups || 'N/A'}</div>
      <div className={`text-sm ${getSentimentColor ? getSentimentColor(keyMetrics?.group_sentiment) : ''}`}>
        {keyMetrics?.group_sentiment || 'N/A'}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {keyMetrics?.outperforming_groups_pct || 'N/A'}
      </div>
    </Card>,
    // Performance Distribution
    <Card key="performance" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
        Phân bố Hiệu suất
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Outperforming:</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {industries.filter(i => i.performance_summary?.crs_status === 'Vượt trội').length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Underperforming:</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {industries.filter(i => i.performance_summary?.crs_status === 'Kém hiệu quả').length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tổng cộng:</span>
          <span className="font-medium">{industries.length}</span>
        </div>
      </div>
    </Card>,
    // Trend Distribution
    <Card key="trend" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
        Phân bố Xu hướng
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tăng trưởng:</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {industries.filter(i => i.performance_summary?.rs_trend === 'Tăng trưởng').length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Suy giảm:</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {industries.filter(i => i.performance_summary?.rs_trend === 'Suy giảm').length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Trung lập:</span>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {industries.filter(i => i.performance_summary?.rs_trend === 'Trung lập').length}
          </span>
        </div>
      </div>
    </Card>,
    // Volatility Analysis
    <Card key="volatility" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
        Phân tích Độ biến động
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Thấp (&lt;3%):</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {industries.filter(i => i.metrics?.rs_volatility < 0.03).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Trung bình (3-6%):</span>
          <span className="font-medium text-yellow-600 dark:text-yellow-400">
            {industries.filter(i => i.metrics?.rs_volatility >= 0.03 && i.metrics?.rs_volatility < 0.06).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Cao (&gt;6%):</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {industries.filter(i => i.metrics?.rs_volatility >= 0.06).length}
          </span>
        </div>
      </div>
    </Card>,
    // Consistency Analysis
    <Card key="consistency" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
        Phân tích Độ ổn định
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tốt (&gt;60%):</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {industries.filter(i => (i.metrics?.outperforming_days / i.metrics?.total_days) > 0.6).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Trung bình (40-60%):</span>
          <span className="font-medium text-yellow-600 dark:text-yellow-400">
            {industries.filter(i => (i.metrics?.outperforming_days / i.metrics?.total_days) >= 0.4 && (i.metrics?.outperforming_days / i.metrics?.total_days) <= 0.6).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Kém (&lt;40%):</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {industries.filter(i => (i.metrics?.outperforming_days / i.metrics?.total_days) < 0.4).length}
          </span>
        </div>
      </div>
    </Card>,
    // Momentum Analysis
    <Card key="momentum" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
        Phân tích Momentum
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tăng tốc:</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {industries.filter(i => i.speed_analysis?.short_term_momentum > 0 && i.speed_analysis?.long_term_momentum > 0).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Giảm tốc:</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {industries.filter(i => i.speed_analysis?.short_term_momentum < 0 && i.speed_analysis?.long_term_momentum < 0).length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Hỗn hợp:</span>
          <span className="font-medium text-yellow-600 dark:text-yellow-400">
            {industries.filter(i => 
              (i.speed_analysis?.short_term_momentum > 0 && i.speed_analysis?.long_term_momentum < 0) ||
              (i.speed_analysis?.short_term_momentum < 0 && i.speed_analysis?.long_term_momentum > 0)
            ).length}
          </span>
        </div>
      </div>
    </Card>,
    // Risk Assessment
    <Card key="risk" className="p-4 min-h-[140px]">
      <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
        Đánh giá Rủi ro
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Thấp:</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {industries.filter(i => i.risk_assessment?.risk_level === 'Thấp').length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Trung bình:</span>
          <span className="font-medium text-yellow-600 dark:text-yellow-400">
            {industries.filter(i => i.risk_assessment?.risk_level === 'Trung bình').length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Cao:</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {industries.filter(i => i.risk_assessment?.risk_level === 'Cao').length}
          </span>
        </div>
      </div>
    </Card>,
    // Momentum Distribution Card
    marketOverview?.market_health?.key_metrics?.momentum_distribution?.momentum_categories && (
      <Card key="momentum-distribution" className="p-4 min-h-[140px]">
        <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
          Phân bổ động lượng
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Rất mạnh:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.very_strong || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Mạnh:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.strong || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Trung bình:</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.moderate || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Yếu:</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.weak || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Giảm:</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.declining || 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    ),
    // Speed Distribution Card
    marketOverview?.market_health?.key_metrics?.momentum_distribution?.speed_distribution && (
      <Card key="speed-distribution" className="p-4 min-h-[140px]">
        <h4 className="font-normal text-gray-700 dark:text-gray-300 mb-2 text-sm">
          Phân bổ tốc độ
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Nhanh:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution.fast || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Trung bình:</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution.moderate || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Chậm:</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution.slow || 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    ),
  ];

  // Calculate placeholders for the last row
  const columns = 3;
  const remainder = cards.length % columns;
  const placeholders = remainder === 0 ? 0 : columns - remainder;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        Thống kê và Phân tích
      </h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards}
        {[...Array(placeholders)].map((_, i) => (
          <div key={`placeholder-${i}`} className="invisible min-h-[140px]" />
        ))}
      </div>
    </div>
  );
};

export default IndustryStatistics; 