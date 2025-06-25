import React, { useState } from 'react';
import { Card, Badge } from '@embed-tools/components';
import ElementIcon from './ElementIcon';
import InfoButton from './InfoButton';
import { EXPLANATIONS, translateNote } from '../data/explanations';
import { TRANSLATIONS, STYLE_CLASSES } from '../data/constants';

const DayMasterSection = ({ dayMaster, strength, dayMasterStrengthDetails, onOpenModal }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  if (!dayMaster) return null;

  const dayMasterElementVi = TRANSLATIONS.elements[dayMaster.element];
  const dayMasterStyle = STYLE_CLASSES[dayMasterElementVi] || {};

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Phân Tích Mệnh Chủ</h2>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Mệnh Chủ & Sức Mạnh', EXPLANATIONS.MENH_CHU)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-4">
        {/* Mệnh Chủ box */}
        <div className={`p-4 rounded-xl`} style={{ backgroundColor: 'rgba(253, 246, 178, 0.4)' }}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-black">Mệnh Chủ (Nhật Chủ):</span>
            <ElementIcon element={dayMasterElementVi} size="md" />
            <span className={`text-2xl font-bold leading-none ${dayMasterStyle.text || 'text-gray-700'}`}>
              {TRANSLATIONS.stems[dayMaster.stem] || dayMaster.stem}
            </span>
            <span className={`text-lg font-semibold ml-1 ${dayMasterStyle.text || 'text-gray-700'}`}>{dayMasterElementVi}</span>
            {dayMaster.stem && dayMaster.polarity && dayMaster.elementEn && (
              <span className="text-xs text-gray-500 mt-0.5">
                {translateYinYangElement(`${dayMaster.polarity} ${dayMaster.elementEn}`)}
              </span>
            )}
          </div>
        </div>
        {/* Sức mạnh box */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
          <span className="font-bold text-black">Sức mạnh:</span>
          <span className="ml-2 font-bold text-red-600">{strength}</span>
          <button
            onClick={() => setDetailsVisible(!detailsVisible)}
            className="cursor-pointer ml-2 text-sm text-blue-600 hover:text-blue-800"
          >
            (chi tiết)
          </button>
        </div>
      </div>
      {detailsVisible && dayMasterStrengthDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Yếu tố đóng góp vào sức mạnh:</h3>
          {dayMasterStrengthDetails.notes && Array.isArray(dayMasterStrengthDetails.notes) ? (
            <ul className="text-sm space-y-2">
              {dayMasterStrengthDetails.notes.map((note, i) => (
                <li key={i} className="p-2 rounded bg-gray-100">• {translateNote(note)}</li>
              ))}
              <li className="flex justify-between p-2 border-t font-bold bg-white rounded">
                <span>Tổng điểm:</span>
                <span>{dayMasterStrengthDetails.score}</span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Không có dữ liệu chi tiết về các yếu tố đóng góp.</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default DayMasterSection; 