import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";
import { useDataLoader, useRS21BarHeatmap, useCompanies, useIndustries, enrichTickersWithIndustries } from '../utils/dataLoader';
import EnhancedRSAnalysis from './EnhancedRSAnalysis';

const TickerEnhancedRSAnalysis = ({ timeframe, analyticsData }) => {
    // Use the analyticsData prop if provided, otherwise fall back to direct data loading
    const { data: fallbackRSData, loading: fallbackRSLoading, error: fallbackRSError } = useDataLoader('rs_analysis', timeframe);
    const { data: rs21BarData, loading: rs21BarLoading, error: rs21BarError } = useRS21BarHeatmap(timeframe, 'ticker');
    
    // Get global ticker info data for sector mapping
    const { data: companies } = useCompanies();
    const { data: industries } = useIndustries();
    
    // Industry filtering state
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const hasInitialized = useRef(false);
    
    // Use analyticsData if provided, otherwise use fallback data
    const rsData = analyticsData || fallbackRSData;
    const loading = analyticsData ? false : (fallbackRSLoading || rs21BarLoading);
    const error = analyticsData ? null : (fallbackRSError || rs21BarError);
    
    // Merge RS analysis data with RS 21-bar data and enrich with sector information
    const mergedData = React.useMemo(() => {
        if (!rsData?.symbols || !rs21BarData?.symbols) return null;
        
        // Create a map of RS analysis data by symbol
        const rsAnalysisMap = new Map();
        rsData.symbols.forEach(symbol => {
            rsAnalysisMap.set(symbol.symbol, symbol);
        });
        
        // Merge RS 21-bar data with RS analysis data
        const mergedSymbols = rs21BarData.symbols.map(rs21Symbol => {
            const rsAnalysis = rsAnalysisMap.get(rs21Symbol.symbol || rs21Symbol.id) || {};
            return {
                ...rs21Symbol,
                ...rsAnalysis,
                // Ensure we keep the RS 21-bar data
                rs_bars: rs21Symbol.rs_bars,
                // Merge metrics if both exist
                metrics: {
                    ...rsAnalysis.metrics,
                    ...rs21Symbol.metrics,
                },
                // Use RS analysis data for detailed analysis fields
                risk_level: rsAnalysis.risk_level,
                position_size: rsAnalysis.position_size,
                time_horizon: rsAnalysis.time_horizon,
                stop_loss_distance: rsAnalysis.stop_loss_distance,
                performance_summary: rsAnalysis.performance_summary,
                trend_consistency: rsAnalysis.trend_consistency,
                trend_strength: rs21Symbol.trend_strength || rsAnalysis.trend_strength,
                // Use symbol name/id consistently
                name: rs21Symbol.symbol || rs21Symbol.name || rs21Symbol.id,
                symbol: rs21Symbol.symbol || rs21Symbol.id,
            };
        });
        
        // Enrich tickers with sector information
        const enrichedSymbols = companies && industries ? 
            enrichTickersWithIndustries(mergedSymbols, companies, industries) : 
            mergedSymbols;
        
        return {
            symbols: enrichedSymbols
        };
    }, [rsData, rs21BarData, companies, industries]);

    // Get available industries from the enriched data
    const availableIndustries = useMemo(() => {
        if (!mergedData?.symbols) return [];
        
        // Get unique industries from enriched tickers
        const industryMap = new Map();
        
        mergedData.symbols.forEach(symbol => {
            if (symbol.industry_name && symbol.industry_id) {
                if (!industryMap.has(symbol.industry_id)) {
                    industryMap.set(symbol.industry_id, {
                        id: symbol.industry_id,
                        name: symbol.industry_name
                    });
                }
            }
        });
        
        return Array.from(industryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [mergedData]);
    
    // Auto-select all industries on initial load only
    useEffect(() => {
        hasInitialized.current = false;
    }, [timeframe]);
    
    useEffect(() => {
        if (
            !hasInitialized.current &&
            availableIndustries.length > 0 && 
            selectedIndustries.length === 0
        ) {
            const allIndustryIds = availableIndustries.map(industry => industry.id);
            setSelectedIndustries(allIndustryIds);
            hasInitialized.current = true;
        }
    }, [availableIndustries, selectedIndustries.length]);

    // Filter data based on selected industries
    const filteredData = useMemo(() => {
        if (!mergedData?.symbols) return mergedData;
        
        if (selectedIndustries.length === 0) {
            return mergedData;
        }
        
        const filteredSymbols = mergedData.symbols.filter(symbol => 
            symbol.industry_id && selectedIndustries.includes(symbol.industry_id)
        );
        
        return {
            ...mergedData,
            symbols: filteredSymbols
        };
    }, [mergedData, selectedIndustries]);

    const handleIndustryFilterChange = (selectedIds) => {
        setSelectedIndustries(selectedIds);
    };

    return (
        <EnhancedRSAnalysis
            data={filteredData}
            dataType="ticker"
            title="Xếp hạng & Phân tích Cổ phiếu - Enhanced with RS 21-Bar Heatmap"
            loading={loading}
            error={error}
            // Industry filter props
            availableIndustries={availableIndustries}
            selectedIndustries={selectedIndustries}
            onIndustryFilterChange={handleIndustryFilterChange}
        />
    );
};

export default TickerEnhancedRSAnalysis;