import React from 'react';
import { Card } from '@embed-tools/components';
import InfoButton from './InfoButton';
import { TRANSLATIONS } from '../data/constants';
import { EXPLANATIONS } from '../data/explanations';

const EightMansionsSection = ({ mansions, onOpenModal }) => {
  if (!mansions || !mansions.directions) return null;
  
  // Separate auspicious and inauspicious directions
  const auspiciousDirections = Object.entries(mansions.directions).filter(([key, value]) => value.type === 'Auspicious');
  const inauspiciousDirections = Object.entries(mansions.directions).filter(([key, value]) => value.type === 'Inauspicious');
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Bát Trạch Phong Thủy</h3>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Bát Trạch', EXPLANATIONS.BAT_TRACH)} />
      </div>
      
      {/* Life Gua Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">Cung Mệnh của bạn</h4>
        <p className="text-sm text-blue-700">
          <strong>{mansions.lifeGuaTrigram || "—"}</strong>
          {mansions.lifeGuaElement && (
            <span className="ml-2">
              (Hành {TRANSLATIONS.elements[mansions.lifeGuaElement] || mansions.lifeGuaElement})
            </span>
          )}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Cung Mệnh này xác định các hướng tốt và xấu cho bạn trong phong thủy
        </p>
      </div>
      
      {/* Auspicious Directions */}
      <div className="mb-6">
        <h4 className="font-semibold text-green-700 mb-3 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Hướng Thuận ({auspiciousDirections.length} hướng)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {auspiciousDirections.map(([key, value]) => (
            <div 
              key={key} 
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm text-green-800">
                  {TRANSLATIONS.directions[value.direction]}: {TRANSLATIONS.eightMansions[key] || key}
                </p>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                  {value.type === 'Auspicious' ? 'Tốt' : 'Xấu'}
                </span>
              </div>
              <p className="text-xs text-green-700">
                {getDirectionDescription(key)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Inauspicious Directions */}
      <div>
        <h4 className="font-semibold text-red-700 mb-3 flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          Hướng Hung ({inauspiciousDirections.length} hướng)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inauspiciousDirections.map(([key, value]) => (
            <div 
              key={key} 
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm text-red-800">
                  {TRANSLATIONS.directions[value.direction]}: {TRANSLATIONS.eightMansions[key] || key}
                </p>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                  {value.type === 'Inauspicious' ? 'Xấu' : 'Tốt'}
                </span>
              </div>
              <p className="text-xs text-red-700">
                {getDirectionDescription(key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Helper function to get direction descriptions
const DIRECTION_EXPLANATIONS = {
  wealth:    'Tốt nhất cho tài lộc, danh tiếng, thăng tiến. Nên đặt bàn làm việc, cửa chính, két sắt.',
  health:    'Tốt nhất cho sức khỏe, trường thọ. Nên đặt phòng ngủ, giường ngủ.',
  romance:   'Tốt cho tình cảm gia đình và xã hội. Nên đặt phòng khách, bàn ăn.',
  career:    'Mang lại bình yên, ổn định tinh thần. Nên đặt bàn học, bàn thờ.',
  obstacles: 'Gây thị phi, tranh cãi. Tránh đặt cửa chính, phòng làm việc.',
  quarrels:  'Gây bệnh tật, mất mát tài sản. Tránh đặt phòng ngủ, bếp.',
  lawsuits:  'Gây tai tiếng, kiện tụng. Tránh đặt khu vực quan trọng.',
  totalLoss: 'Hướng xấu nhất, gây phá sản, tai họa. Tuyệt đối tránh.'
};

const getDirectionDescription = key =>
  DIRECTION_EXPLANATIONS[key] || 'Hướng này ảnh hưởng đến vận may của bạn.';

export default EightMansionsSection; 