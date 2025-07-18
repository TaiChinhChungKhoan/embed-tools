import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, AlertCircle } from 'lucide-react';
import Card from './Card';
import InteractiveChart from './InteractiveChart';
import { useDataLoader } from '../utils/dataLoader';

const MacroeconomicsReport = () => {
    // Load economic data using the data loader
    const { data: gdpQuarter, loading: gdpLoading, error: gdpError } = useDataLoader('gdp_quarter');
    const { data: moneySupplyMonth, loading: moneySupplyLoading, error: moneySupplyError } = useDataLoader('money_supply_month');
    const { data: retailSalesYear, loading: retailSalesLoading, error: retailSalesError } = useDataLoader('retail_sales_year');
    const { data: retailSalesMonth, loading: retailSalesMonthLoading, error: retailSalesMonthError } = useDataLoader('retail_sales_month');
    const { data: cpiMonth, loading: cpiLoading, error: cpiError } = useDataLoader('cpi_month');

    // Process GDP data - get latest quarterly growth rates
    const gdpData = useMemo(() => {
        if (!gdpQuarter?.data) return [];
        
        const gdpGrowth = gdpQuarter.data
            .filter(item => item.group_name === 'Tăng trưởng thực của GDP' && item.name === 'Tổng GDP')
            .sort((a, b) => new Date(a.report_time) - new Date(b.report_time)) // Chronological order
            .slice(-8); // Last 8 quarters

        return gdpGrowth.map(item => ({
            date: item.report_time.slice(0, 7), // YYYY-MM format
            gdp: item.value,
            quarter: item.report_type
        }));
    }, [gdpQuarter]);

    // Process Money Supply data - get M2 growth rates
    const moneySupplyData = useMemo(() => {
        if (!moneySupplyMonth?.data) return [];
        
        const m2Growth = moneySupplyMonth.data
            .filter(item => item.name === 'Tăng trưởng Cung tiền M2 (YTD)*')
            .sort((a, b) => new Date(a.report_time) - new Date(b.report_time)) // Chronological order
            .slice(-12); // Last 12 months

        return m2Growth.map(item => ({
            date: item.report_time.slice(0, 7),
            m2Growth: item.value
        }));
    }, [moneySupplyMonth]);

    // Process Retail Sales data - use yearly data with new structured format
    const retailData = useMemo(() => {
        if (!retailSalesYear?.data) return [];
        
        try {
            // Use yearly data with the new structured format
            const retailGrowth = retailSalesYear.data
                .sort((a, b) => new Date(a.report_time) - new Date(b.report_time))
                .slice(-8); // Last 8 years

            return retailGrowth.map(item => ({
                date: item.report_time,
                total: item.data.percentage['Tổng số'],
                service: item.data.percentage['Dịch vụ & du lịch'],
                commerce: item.data.percentage['Thương nghiệp'],
                hospitality: item.data.percentage['Khách sạn nhà hàng'],
                totalValue: item.data.cash['Tổng số'],
                serviceValue: item.data.cash['Dịch vụ & du lịch'],
                commerceValue: item.data.cash['Thương nghiệp'],
                hospitalityValue: item.data.cash['Khách sạn nhà hàng']
            }));
        } catch (error) {
            console.error('Error processing retail sales data:', error);
            return [];
        }
    }, [retailSalesYear]);

    // Process CPI data
    const cpiData = useMemo(() => {
        if (!cpiMonth?.data) return [];
        
        const cpiGrowth = cpiMonth.data
            .filter(item => item.name === 'Chỉ số giá tiêu dùng')
            .sort((a, b) => new Date(a.report_time) - new Date(b.report_time)) // Chronological order
            .slice(-12); // Last 12 months

        return cpiGrowth.map(item => ({
            date: item.report_time.slice(0, 7),
            cpi: item.value
        }));
    }, [cpiMonth]);

    // Merge economic data for chart
    const economicChartData = useMemo(() => {
        const allDates = new Set([
            ...gdpData.map(d => d.date),
            ...moneySupplyData.map(d => d.date),
            ...retailData.map(d => d.date),
            ...cpiData.map(d => d.date)
        ]);

        return Array.from(allDates)
            .sort()
            .map(date => {
                const gdp = gdpData.find(d => d.date === date);
                const m2 = moneySupplyData.find(d => d.date === date);
                const retail = retailData.find(d => d.date === date);
                const cpi = cpiData.find(d => d.date === date);

                return {
                    date,
                    gdp: gdp?.gdp || null,
                    m2Growth: m2?.m2Growth || null,
                    retailGrowth: retail?.retailGrowth || null,
                    cpi: cpi?.cpi || null
                };
            })
            .filter(d => d.gdp !== null || d.m2Growth !== null || d.retailGrowth !== null || d.cpi !== null)
            .slice(-24); // Last 24 data points
    }, [gdpData, moneySupplyData, retailData, cpiData]);

    // Calculate current economic indicators
    const currentIndicators = useMemo(() => {
        const latestGDP = gdpData[0];
        const latestM2 = moneySupplyData[0];
        const latestRetail = retailData[0];
        const latestCPI = cpiData[0];

        return {
            gdp: latestGDP,
            m2Growth: latestM2,
            retailGrowth: latestRetail,
            cpi: latestCPI
        };
    }, [gdpData, moneySupplyData, retailData, cpiData]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Báo cáo Vĩ mô
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Phân tích các chỉ số kinh tế vĩ mô và xu hướng thị trường
                </p>
            </div>

            {/* Interactive Chart */}
            <InteractiveChart />

            {/* Market Analysis */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Phân tích Thị trường
                </h3>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Tăng trưởng GDP</h4>
                        <p>
                            Tăng trưởng GDP là chỉ số quan trọng nhất phản ánh sức khỏe của nền kinh tế. 
                            Tăng trưởng cao thường tương quan với hiệu suất tốt của thị trường chứng khoán.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Cung tiền M2</h4>
                        <p>
                            Tăng trưởng cung tiền M2 phản ánh tính thanh khoản trong nền kinh tế. 
                            Tăng trưởng cao có thể thúc đẩy thị trường nhưng cũng có thể gây lạm phát.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Bán lẻ</h4>
                        <p>
                            Tăng trưởng bán lẻ cho thấy sức tiêu thụ của người dân. 
                            Đây là chỉ số quan trọng phản ánh sức khỏe của nền kinh tế tiêu dùng.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Chỉ số Giá Tiêu dùng (CPI)</h4>
                        <p>
                            CPI đo lường lạm phát. Lạm phát vừa phải có thể tốt cho thị trường, 
                            nhưng lạm phát cao có thể ảnh hưởng tiêu cực đến hiệu suất cổ phiếu.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MacroeconomicsReport; 