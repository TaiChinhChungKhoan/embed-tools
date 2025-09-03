import React from 'react';
import { useDataLoader, useRS21BarHeatmap } from '../utils/dataLoader';
import EnhancedRSAnalysis from './EnhancedRSAnalysis';

const IndustryRSAnalysis = ({ timeframe, analyticsData }) => {
    // Use the analyticsData prop if provided, otherwise fall back to direct data loading
    const { data: fallbackRSData, loading: fallbackRSLoading, error: fallbackRSError } = useDataLoader('rs_analysis', timeframe);
    const { data: rs21BarData, loading: rs21BarLoading, error: rs21BarError } = useRS21BarHeatmap(timeframe, 'industry');
    
    // Use analyticsData if provided, otherwise use fallback data
    const rsData = analyticsData || fallbackRSData;
    const loading = analyticsData ? false : (fallbackRSLoading || rs21BarLoading);
    const error = analyticsData ? null : (fallbackRSError || rs21BarError);
    
    // Merge RS analysis data with RS 21-bar data
    const mergedData = React.useMemo(() => {
        if (!rsData?.industries || !rs21BarData?.industries) return null;
        
        // Create a map of RS analysis data by custom_id
        const rsAnalysisMap = new Map();
        rsData.industries.forEach(industry => {
            rsAnalysisMap.set(industry.custom_id, industry);
        });
        
        // Merge RS 21-bar data with RS analysis data
        const mergedIndustries = rs21BarData.industries.map(rs21Industry => {
            const rsAnalysis = rsAnalysisMap.get(rs21Industry.custom_id) || {};
            return {
                ...rs21Industry,
                ...rsAnalysis,
                // Ensure we keep the RS 21-bar data
                rs_bars: rs21Industry.rs_bars,
                // Merge metrics if both exist
                metrics: {
                    ...rsAnalysis.metrics,
                    ...rs21Industry.metrics,
                },
                // Use RS analysis data for detailed analysis fields
                risk_level: rsAnalysis.risk_level,
                position_size: rsAnalysis.position_size,
                time_horizon: rsAnalysis.time_horizon,
                stop_loss_distance: rsAnalysis.stop_loss_distance,
                performance_summary: rsAnalysis.performance_summary,
                trend_consistency: rsAnalysis.trend_consistency,
                trend_strength: rs21Industry.trend_strength || rsAnalysis.trend_strength,
            };
        });
        
        return {
            industries: mergedIndustries
        };
    }, [rsData, rs21BarData]);

    return (
        <EnhancedRSAnalysis
            data={mergedData}
            dataType="industry"
            title="Xếp hạng & Phân tích Ngành - Enhanced with RS 21-Bar Heatmap"
            loading={loading}
            error={error}
        />
    );
};

export default IndustryRSAnalysis;