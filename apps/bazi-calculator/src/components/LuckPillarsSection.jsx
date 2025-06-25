import React from 'react';
import { Card } from '@embed-tools/components';
import Pillar from './Pillar';
import InfoButton from './InfoButton';
import { EXPLANATIONS } from '../data/explanations';

const LuckPillarsSection = ({ luckPillars, birthYear, onOpenModal }) => {
  if (!luckPillars) return null;

  // Debug: log the full luckPillars data
  // console.log('Luck Pillars:', luckPillars.pillars);

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Phân Tích Đại Vận (10 Năm)</h2>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Đại Vận', EXPLANATIONS.DAI_VAN)} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {luckPillars.pillars.map(p => (
          <div 
            key={p.number} 
            className={`p-3 rounded-lg border ${
              currentAge >= p.ageStart && currentAge < (p.ageStart + 10) 
                ? 'bg-indigo-50 border-indigo-400' 
                : 'bg-white'
            }`}
          >
            <div className="font-bold text-gray-700">{p.ageStart} tuổi</div>
            <div className="text-xs text-gray-500">{p.yearStart} - {p.yearEnd}</div>
            <Pillar 
              stem={p.heavenlyStem} 
              branch={p.earthlyBranch} 
              className="mt-2 shadow-none border-0 p-2" 
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LuckPillarsSection; 