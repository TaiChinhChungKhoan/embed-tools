import React, { useState } from 'react';
import RS21BarHeatmapBase from './RS21BarHeatmapBase';

const RS21BarHeatmap = ({ data }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  // Helper functions for industry data
  const getItemName = (item) => item.name;
  const getItemId = (item) => item.id;
  const getItemMetrics = (item) => {
    return data.industry_metrics?.[item.id] || {};
  };
  const getItemRSBars = (item) => item.rs_bars || [];

  return (
    <RS21BarHeatmapBase
      data={data}
      dataType="industry"
      title="RS 21-Bar Heatmap"
      showAdditionalColumns={true}
      getItemName={getItemName}
      getItemId={getItemId}
      getItemMetrics={getItemMetrics}
      getItemRSBars={getItemRSBars}
      selectedItem={selectedIndustry}
      setSelectedItem={setSelectedIndustry}
    />
  );
};

export default RS21BarHeatmap; 