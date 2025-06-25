import React from 'react';
import { TRANSLATIONS } from '../data/constants';

const SymbolicStarsSection = ({ stars }) => {
  if (!stars) return null;

  const starData = [
    {
      key: 'nobleman',
      emoji: '🤝',
      name: 'Quý Nhân',
      value: Array.isArray(stars.nobleman) && stars.nobleman.length 
        ? stars.nobleman.map(b => TRANSLATIONS.branches[b]).join(', ') 
        : 'Không có'
    },
    {
      key: 'intelligence',
      emoji: '💡',
      name: 'Văn Xương',
      value: stars.intelligence ? TRANSLATIONS.branches[stars.intelligence] : 'Không có'
    },
    {
      key: 'skyHorse',
      emoji: '🐎',
      name: 'Thiên Mã',
      value: stars.skyHorse ? TRANSLATIONS.branches[stars.skyHorse] : 'Không có'
    },
    {
      key: 'peachBlossom',
      emoji: '🌸',
      name: 'Đào Hoa',
      value: stars.peachBlossom ? TRANSLATIONS.branches[stars.peachBlossom] : 'Không có'
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Thần Sát Đặc Biệt</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {starData.map(star => (
          <div key={star.key} className="p-3 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">{star.emoji}</div>
            <p className="font-semibold text-gray-800 mb-1">{star.name}</p>
            <p className="text-gray-600 text-sm">{star.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymbolicStarsSection; 