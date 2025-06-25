import React from 'react';
import { Card, Badge } from '@embed-tools/components';
import Pillar from './Pillar';
import { TRANSLATIONS } from '../data/constants';

const AnnualAnalysisSection = ({ annualAnalysis }) => {
  const currentYear = new Date().getFullYear();
  if (!annualAnalysis || !annualAnalysis.annualPillarContext) return null;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Phân Tích Vận Hạn Năm {currentYear}
      </h2>
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
        <Pillar 
          stem={annualAnalysis.annualPillarContext.pillar.stem} 
          branch={annualAnalysis.annualPillarContext.pillar.branch} 
          title={`Năm ${currentYear}`} 
          className="shadow-none border-0 p-2" 
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-700 mb-2">
            Tương tác với Lá số gốc:
          </h3>
          {annualAnalysis.interactions && annualAnalysis.interactions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {annualAnalysis.interactions.map((int, i) => {
                const [{ elementChar: branch1 }, { elementChar: branch2 }] = int.participants;
                const tagColor = ['clash','harm','punishment','destruction'].includes(int.type) 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800';
                const key = `${int.type}-${branch1}-${branch2}-${i}`;

                return (
                  <Badge key={key} className={tagColor}>
                    {TRANSLATIONS.interactions[int.type]}: {TRANSLATIONS.branches[branch1]}–{TRANSLATIONS.branches[branch2]}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Không có tương tác Xung/Hợp/Hại/Hình chính.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnnualAnalysisSection; 