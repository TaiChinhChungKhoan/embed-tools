import React from 'react';
import Card from './Card';
import MarketSentimentCharts from './MarketSentimentCharts';
import VolumeAnalysisChart from './VolumeAnalysisChart';

const MarketSummaryPieCharts = ({ marketBreadth, volumeAnalysis }) => {
    return (
        <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                    <MarketSentimentCharts marketBreadth={marketBreadth} title="Tâm lý thị trường" />
                </div>
                <div className="flex flex-col items-center">
                    <VolumeAnalysisChart volumeAnalysis={volumeAnalysis} title="Phân tích khối lượng" />
                </div>
            </div>
        </Card>
    );
};

export default MarketSummaryPieCharts; 