import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, HelpCircle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const QUADRANT_CONFIG = {
  Leading: { color: '#22c55e', icon: TrendingUp },
  Improving: { color: '#3b82f6', icon: TrendingUp },
  Weakening: { color: '#f97316', icon: TrendingDown },
  Lagging: { color: '#ef4444', icon: TrendingDown },
};

const IndustryBreadthSummary = ({ industries }) => {
  const summary = useMemo(() => {
    if (!industries || industries.length === 0) {
      return { uptrend: 0, downtrend: 0, quadrantCounts: [] };
    }

    const uptrend = industries.filter(ind => ind.trend === 'Uptrend').length;
    const downtrend = industries.filter(ind => ind.trend === 'Downtrend').length;

    const quadrantCounts = Object.keys(QUADRANT_CONFIG).map(quadrant => ({
      name: quadrant,
      count: industries.filter(ind => ind.quadrant === quadrant).length,
    }));

    return { uptrend, downtrend, quadrantCounts };
  }, [industries]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Trend Summary */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Overall Trend</h3>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{summary.uptrend}</span>
              <span className="text-sm text-gray-500">Uptrend</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-6 h-6 text-red-500" />
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{summary.downtrend}</span>
              <span className="text-sm text-gray-500">Downtrend</span>
            </div>
          </div>
        </div>

        {/* RRG Quadrant Distribution Chart */}
        <div className="col-span-2 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.quadrantCounts} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="count" stackId="a" layout="vertical" barSize={20}>
                {summary.quadrantCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={QUADRANT_CONFIG[entry.name]?.color || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IndustryBreadthSummary;
