import React from 'react';
import Card from '../Card';

const TopdownIndicatorsTable = ({ data }) => {
  if (!data || !data.indicators) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Không có dữ liệu chỉ báo</div>
      </Card>
    );
  }

  const { indicators } = data;

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-green-500'; // Green dot
      case 1: return 'bg-yellow-500'; // Yellow dot
      case 2: return 'bg-red-500'; // Red dot
      default: return 'bg-gray-400';
    }
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Tốt';
      case 1: return 'Trung bình';
      case 2: return 'Xấu';
      default: return 'Không xác định';
    }
  };

  // Helper function to format category name
  const formatCategoryName = (category) => {
    const categoryMap = {
      'inflation': 'Lạm phát',
      'macro': 'Vĩ mô',
      'risk': 'Rủi ro',
      'commodities': 'Hàng hóa'
    };
    return categoryMap[category] || category;
  };

  // Helper function to format indicator name
  const formatIndicatorName = (indicator) => {
    const indicatorMap = {
      'pce_core': 'PCE Lõi',
      'wage_growth': 'Tăng trưởng lương',
      'cpi_core': 'CPI Lõi',
      'ppi_core': 'PPI Lõi',
      'ppi_headline': 'PPI Toàn bộ',
      'ppi_services': 'PPI Dịch vụ',
      'yield_curve': 'Đường cong lãi suất',
      'commodities': 'Hàng hóa',
      'retail_sales': 'Bán lẻ',
      'credit_spread': 'Spread tín dụng',
      'credit_delinquencies': 'Nợ xấu',
      'breakeven': 'Kỳ vọng lạm phát',
      'us_economy': 'Kinh tế Mỹ',
      'gdp': 'GDP',
      'intermarket': 'Liên thị trường',
      'global_flows': 'Dòng vốn toàn cầu',
      'sentiment': 'Tâm lý',
      'sector_rotation': 'Luân chuyển sector',
      'labor_market': 'Thị trường lao động',
      'ism_pmi': 'ISM PMI',
      'ism_pmi_services': 'ISM PMI Dịch vụ',
      'vix_sentiment': 'Tâm lý VIX',
      'move_volatility': 'Biến động trái phiếu',
      'equity_leadership': 'Dẫn dắt cổ phiếu',
      'bond_flows': 'Dòng vốn trái phiếu',
      'currency_flows': 'Dòng tiền tệ',
      'btc_risk': 'Rủi ro BTC',
      'correlations': 'Tương quan',
      'diesel_inventories': 'Tồn kho diesel',
      'gasoline_inventories': 'Tồn kho xăng',
      'macro_commodities': 'Hàng hóa vĩ mô'
    };
    return indicatorMap[indicator] || indicator;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Bảng Chỉ báo Phân tích Top-down
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chỉ báo
              </th>
                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                 Trạng thái
               </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Diễn giải
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(indicators).map(([category, categoryIndicators]) => (
              Object.entries(categoryIndicators).map(([indicator, indicatorData], index) => (
                <tr key={`${category}-${indicator}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {index === 0 && (
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                      rowSpan={Object.keys(categoryIndicators).length}
                    >
                      {formatCategoryName(category)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatIndicatorName(indicator)}
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center justify-center">
                       <div className={`w-4 h-4 rounded-full ${getStatusColor(indicatorData.status)}`} title={getStatusText(indicatorData.status)}></div>
                     </div>
                   </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {indicatorData.interpretation}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TopdownIndicatorsTable;
