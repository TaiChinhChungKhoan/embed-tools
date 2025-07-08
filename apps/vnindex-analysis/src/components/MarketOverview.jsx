import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Globe } from 'lucide-react';
import MarketBreadth from './MarketBreadth';
import TopListCard from './TopListCard';
import MarketBreadthAnalysis from './MarketBreadthAnalysis';
import { useDataLoader } from '../hooks/useDataLoader';

const MarketOverview = () => {
    // Load data using the data loader
    const { data: industryStrength, loading: industryLoading, error: industryError } = useDataLoader('industries');
    const { data: topGainers, loading: gainersLoading, error: gainersError } = useDataLoader('top_gainers');
    const { data: topLosers, loading: losersLoading, error: losersError } = useDataLoader('top_losers');
    const { data: topByVolume, loading: volumeLoading, error: volumeError } = useDataLoader('top_by_volume');
    const { data: foreignBuy, loading: foreignLoading, error: foreignError } = useDataLoader('foreign_buy');

    // Top gainers/losers/volume/foreign buy: use latest data array
    const gainers = useMemo(() => topGainers?.data?.slice(0, 5) || [], [topGainers]);
    const losers = useMemo(() => topLosers?.data?.slice(0, 5) || [], [topLosers]);
    const byVolume = useMemo(() => topByVolume?.data?.slice(0, 5) || [], [topByVolume]);
    const foreignNetBuy = useMemo(() => foreignBuy?.data?.slice(0, 5) || [], [foreignBuy]);

    // Top/bottom industries by total_score
    const industries = industryStrength?.industry_summary || [];
    const topIndustries = useMemo(() =>
        [...industries].sort((a, b) => b.total_score - a.total_score).slice(0, 5),
        [industries]
    );
    const bottomIndustries = useMemo(() =>
        [...industries].sort((a, b) => a.total_score - b.total_score).slice(0, 5),
        [industries]
    );

    return (
        <div className="space-y-6">
            {/* Market Breadth Chart */}
            <MarketBreadth />

            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:col-span-3">
                    <TopListCard
                        title="Tăng mạnh nhất"
                        icon={<TrendingUp className="text-green-500" />}
                        data={gainers.map(item => ({
                            id: item.symbol,
                            name: item.symbol,
                            value: item.price_change_pct_1d,
                        }))}
                        unit="%"
                        valueKey="value"
                        nameKey="name"
                        valueClass={v => v > 0 ? 'text-green-500' : 'text-red-500'}
                    />
                    <TopListCard
                        title="Giảm mạnh nhất"
                        icon={<TrendingDown className="text-red-500" />}
                        data={losers.map(item => ({
                            id: item.symbol,
                            name: item.symbol,
                            value: item.price_change_pct_1d,
                        }))}
                        unit="%"
                        valueKey="value"
                        nameKey="name"
                        valueClass={v => v < 0 ? 'text-red-500' : 'text-green-500'}
                    />
                    <TopListCard
                        title="Giao dịch sôi động nhất"
                        icon={<BarChart2 className="text-purple-500" />}
                        data={byVolume.map(item => ({
                            id: item.symbol,
                            name: item.symbol,
                            value: item.avg_volume_20d,
                        }))}
                        unit=""
                        valueKey="value"
                        nameKey="name"
                        valueClass={() => 'text-green-500'}
                    />
                    <TopListCard
                        title="Ngành tăng tốt nhất"
                        icon={<TrendingUp className="text-green-500" />}
                        data={topIndustries.map(item => ({
                            id: item.industry,
                            name: item.industry,
                            value: item.total_score,
                        }))}
                        unit=""
                        valueKey="value"
                        nameKey="name"
                        valueClass={v => v > 0 ? 'text-green-500' : 'text-red-500'}
                    />
                    <TopListCard
                        title="Ngành giảm nhiều nhất"
                        icon={<TrendingDown className="text-red-500" />}
                        data={bottomIndustries.map(item => ({
                            id: item.industry,
                            name: item.industry,
                            value: item.total_score,
                        }))}
                        unit=""
                        valueKey="value"
                        nameKey="name"
                        valueClass={v => v < 0 ? 'text-red-500' : 'text-green-500'}
                    />                    
                    <TopListCard
                        title="Nước ngoài mua ròng"
                        icon={<Globe className="text-blue-500" />}
                        data={foreignNetBuy.map(item => ({
                            id: item.symbol,
                            name: item.symbol,
                            value: item.net_value / 1000000000,
                        }))}
                        unit="Tỷ VNĐ"
                        valueKey="value"
                        nameKey="name"
                        valueClass={v => v > 0 ? 'text-blue-500' : 'text-red-500'}
                    />
                </div>
            </div>

            {/* Market Breadth Analysis */}
            {/* <MarketBreadthAnalysis /> */}
        </div>
    );
};

export default MarketOverview; 