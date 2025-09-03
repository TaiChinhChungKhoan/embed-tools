import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PMIChart = ({ 
  type = 'manufacturing', // 'manufacturing' or 'services'
  height = "500px", 
  width = "650px",
  title = ""
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = type === 'manufacturing' 
    ? 'https://api.db.nomics.world/v22/series/ISM/pmi?observations=1&format=json'
    : 'https://api.db.nomics.world/v22/series/ISM/nm-pmi?observations=1&format=json';

  const chartTitle = title || (type === 'manufacturing' ? 'ISM Manufacturing PMI' : 'ISM Services PMI');

  useEffect(() => {
    const fetchPMIData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        // Extract the series data
        const seriesData = jsonData.series?.docs?.[0];
        if (!seriesData) {
          throw new Error('No series data found');
        }

        // Transform the data for Recharts and filter to last 2 years
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        
        const chartData = seriesData.period.map((period, index) => {
          try {
            // Parse period like "2025-07" to a proper date
            const [year, month] = period.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, 1); // Month is 0-indexed
            
            // Validate the date
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date for period: ${period}`);
              return null;
            }
            
            // Only include data from the last 2 years
            if (date < twoYearsAgo) {
              return null;
            }
            
            return {
              date: date.toISOString().split('T')[0], // YYYY-MM-DD format
              month: date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
              value: seriesData.value[index],
              pmi: seriesData.value[index]
            };
          } catch (error) {
            console.warn(`Error parsing period ${period}:`, error);
            return null;
          }
        }).filter(item => item !== null && item.value !== null && item.value !== undefined);

        setData(chartData);
      } catch (err) {
        console.error('Error fetching PMI data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPMIData();
  }, [apiUrl]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            PMI: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {payload[0].value > 50 ? 'Mở rộng' : payload[0].value < 50 ? 'Thu hẹp' : 'Không đổi'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div 
        style={{ height, width }} 
        className="flex items-center justify-center bg-slate-50 rounded-lg border"
      >
        <div className="text-sm text-gray-500">Đang tải dữ liệu PMI...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{ height, width }} 
        className="flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
      >
        <div className="text-sm text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height, width }} 
        className="flex items-center justify-center bg-slate-50 rounded-lg border"
      >
        <div className="text-sm text-gray-500">Không có dữ liệu PMI</div>
      </div>
    );
  }

        return (
     <div style={{ height, width }} className="bg-white rounded-lg border p-6">
       <ResponsiveContainer width="100%" height="100%">
         <BarChart data={data} margin={{ top: 30, right: 40, left: 30, bottom: 80 }}>
           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
           <XAxis 
             dataKey="month" 
             angle={-45}
             textAnchor="end"
             height={100}
             tick={{ fontSize: 12 }}
             interval="preserveStartEnd"
             dy={10}
           />
           <YAxis 
             domain={[0, 100]}
             tick={{ fontSize: 12 }}
             dx={-5}
             label={{ value: 'PMI', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
           />
           <Tooltip content={<CustomTooltip />} />
           <ReferenceLine y={50} stroke="#10b981" strokeDasharray="3 3" strokeWidth={2} />
                       <Bar 
              dataKey="pmi" 
              fill="#3b82f6" 
              barSize={20}
              maxBarSize={30}
            />
         </BarChart>
       </ResponsiveContainer>
             <div className="mt-6 text-xs text-gray-600">
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
             <div className="w-4 h-4 bg-blue-500 rounded"></div>
             <span>PMI &gt; 50: Mở rộng</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-4 h-4 bg-red-500 rounded"></div>
             <span>PMI &lt; 50: Thu hẹp</span>
           </div>
         </div>
       </div>
    </div>
  );
};

export default PMIChart;
