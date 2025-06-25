import React from 'react';
import { Card } from '@embed-tools/components';
import InfoButton from './InfoButton';
import { EXPLANATIONS } from '../data/explanations';

const FavorablePeriodsSection = ({ periods, onOpenModal }) => {
  if (!periods) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex flex-row items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-green-700">Giai Đoạn Thuận Tài</h2>
          <InfoButton onClick={() => onOpenModal && onOpenModal('Giải Thích: Giai Đoạn Thuận Tài', EXPLANATIONS.GIAI_DOAN_THUAN_TAI)} />
        </div>
        <div className="space-y-2 text-sm">
          {periods.finance && periods.finance.length > 0 ? (
            periods.finance.map(p => (
              <p key={p.key} className="p-2 bg-green-50 rounded-md">
                Từ <strong>{p.age}</strong> tuổi ({p.years}) — Thiên Can: <strong>{p.tenGodName}</strong>
              </p>
            ))
          ) : (
            <p className="text-gray-500">Không có giai đoạn hỗ trợ tài chính rõ ràng trong các Đại Vận sắp tới.</p>
          )}
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex flex-row items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-blue-700">Giai Đoạn Thuận Sức Khỏe & Học Vấn</h2>
          <InfoButton onClick={() => onOpenModal && onOpenModal('Giải Thích: Giai Đoạn Thuận Sức Khỏe & Học Vấn', EXPLANATIONS.GIAI_DOAN_THUAN_SUC_KHOE)} />
        </div>
        <div className="space-y-2 text-sm">
          {periods.health && periods.health.length > 0 ? (
            periods.health.map(p => (
              <p key={p.key} className="p-2 bg-blue-50 rounded-md">
                Từ <strong>{p.age}</strong> tuổi ({p.years}) — Thiên Can: <strong>{p.tenGodName}</strong>
              </p>
            ))
          ) : (
            <p className="text-gray-500">Không có giai đoạn hỗ trợ sức khỏe/học vấn rõ ràng trong các Đại Vận sắp tới.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FavorablePeriodsSection; 