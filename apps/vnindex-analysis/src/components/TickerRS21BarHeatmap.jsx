import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";
import RS21BarHeatmapBase from './RS21BarHeatmapBase';
import { useCompanies, useIndustries, enrichTickersWithIndustries } from '../utils/dataLoader';

const TickerRS21BarHeatmap = ({ data, filteredTickers, onIndustryFilterChange, selectedIndustries }) => {
  const [selectedTicker, setSelectedTicker] = useState(null);

  // Get global ticker info data
  const { data: companies } = useCompanies();
  const { data: industries } = useIndustries();

  // Enrich tickers with industry information
  const enrichedData = useMemo(() => {
    if (!data?.symbols || !companies || !industries) return data;
     
    const enrichedSymbols = enrichTickersWithIndustries(data.symbols, companies, industries);
    
    return {
      ...data,
      symbols: enrichedSymbols
    };
  }, [data, companies, industries]);

  // Get available industries from the enriched data
  const availableIndustries = useMemo(() => {
    if (!enrichedData?.symbols) return [];
    
    // Get unique industries from enriched tickers
    const industryMap = new Map();
    
    enrichedData.symbols.forEach(symbol => {
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
  }, [enrichedData]);

  // Auto-select all industries on initial load only
  const hasInitialized = useRef(false);
  
  // Reset initialization when data changes
  useEffect(() => {
    hasInitialized.current = false;
  }, [data]);
  
  useEffect(() => {
    if (
      !hasInitialized.current &&
      availableIndustries.length > 0 && 
      selectedIndustries.length === 0
    ) {
      const allIndustryIds = availableIndustries.map(industry => industry.id);
      onIndustryFilterChange(allIndustryIds);
      hasInitialized.current = true;
    }
  }, [availableIndustries, selectedIndustries.length, onIndustryFilterChange]);

  const handleIndustryFilterChange = (selectedIds) => {
    onIndustryFilterChange(selectedIds);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Industry Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lọc theo ngành:
        </label>
        <MultiSelect
          options={availableIndustries.map(industry => ({
            value: industry.id,
            label: industry.name
          }))}
          value={selectedIndustries}
          onValueChange={handleIndustryFilterChange}
          placeholder="Chọn ngành..."
          className="w-full"
        />
      </div>

      {/* RS 21-Bar Heatmap */}
      <div className="flex-grow">
        <RS21BarHeatmapBase
          data={enrichedData}
          dataType="ticker"
          filteredItems={filteredTickers}
          title="RS 21-Bar Heatmap - Tickers"
          showAdditionalColumns={true}
          onItemClick={setSelectedTicker}
          selectedItem={selectedTicker}
          setSelectedItem={setSelectedTicker}
        />
      </div>
    </div>
  );
};

export default TickerRS21BarHeatmap; 