import React from 'react';
import { Card } from '@embed-tools/components';
import InfoButton from './InfoButton';
import { TRANSLATIONS } from '../data/constants';
import { EXPLANATIONS } from '../data/explanations';

const EightMansionsSection = ({ mansions, onOpenModal }) => {
  if (!mansions || !mansions.directions) return null;
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Bát Trạch Phong Thủy</h3>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Bát Trạch', EXPLANATIONS.BAT_TRACH)} />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Cung Mệnh của bạn là <strong>{mansions.lifeGuaTrigram || "—"}{mansions.lifeGuaElement ? ` (${TRANSLATIONS.elements[mansions.lifeGuaElement]})` : ""}</strong>. 
        Các hướng tốt và xấu:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(mansions.directions).map(([key, value]) => {
          const isAuspicious = value.type === 'Auspicious';
          return (
            <div 
              key={key} 
              className={`p-3 rounded-md ${
                isAuspicious ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`font-bold text-sm ${
                isAuspicious ? 'text-green-800' : 'text-red-800'
              }`}>
                {TRANSLATIONS.directions[value.direction]}: {TRANSLATIONS.eightMansions[key] || key}
              </p>
              <p className={`text-xs ${
                isAuspicious ? 'text-green-700' : 'text-red-700'
              }`}>
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default EightMansionsSection; 