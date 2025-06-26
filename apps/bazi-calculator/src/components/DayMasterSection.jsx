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
                <li key={i} className="p-2">• {translateNote(note)}</li>
              ))}
              <li className="flex justify-between p-2 font-bold rounded">
                <span>Tổng điểm:</span>
                <span>{dayMasterStrengthDetails.score}</span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Không có dữ liệu chi tiết về các yếu tố đóng góp.</p>
          )}
          
          {/* Detailed explanation about Vượng and Nhược */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3">Giải thích chi tiết về Vượng - Nhược:</h4>
            <div className="text-sm space-y-3">
              <p>
                <strong>Không hẳn "vượng" tức là "rất hên" và "nhược" tức là "xui xẻo", mà:</strong>
              </p>
              <p>
                <strong>Vượng – Nhược chỉ phản ánh "mức độ nạp khí" của Nhật Chủ</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>"Vượng"</strong> nghĩa là yếu tố Ngũ hành của Can Ngày (Nhật Chủ) chiếm ưu thế, có nhiều "nhiên liệu" để phát triển.
                </li>
                <li>
                  <strong>"Nhược"</strong> là thiếu "nhiên liệu" ấy, cần được bổ sung từ các hành sinh ("Hỷ Thần") hoặc chế khắc bớt các hành khắc ("Dụng Thần").
                </li>
              </ul>
              
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Ý nghĩa khi xét đến vận trình:</h5>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Nếu Nhật Chủ vượng:</strong> bạn có nội lực, tự tin, dễ khởi nghiệp hay gánh vác trọng trách. Nhưng quá vượng cũng cần có hành khắc để cân bằng, nếu không dễ bốc đồng, nóng nảy, khó tiếp thu ý kiến.
                  </li>
                  <li>
                    <strong>Nếu Nhật Chủ nhược:</strong> bạn thường mềm dẻo, dễ thích nghi, nhưng cũng dễ bị người khác áp đảo, kiệt sức nếu không bổ sung "Hỷ Thần" kịp thời.
                  </li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Không phải chỉ "vượng = may mắn":</h5>
                <p>
                  May rủi trong đời còn phụ thuộc vào Cung Mệnh, Đại Vận – Tiểu Vận, Thiên Can – Địa Chi tương tác hằng năm, hằng tháng…
                </p>
                <p className="mt-2">
                  Một người Nhật Chủ nhược nếu đi vào Đại Vận có hành tương sinh, có thể "đổi vận" rất tốt. Ngược lại, dù Nhật Chủ vượng, nhưng rơi vào giai đoạn gặp nhiều Khắc Xung nặng vẫn có thể gặp trắc trở.
                </p>
              </div>
              
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Áp dụng trong đầu tư – nghề nghiệp – sức khỏe:</h5>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Với người Nhật Chủ vượng:</strong> nên phát huy "khí" mạnh vào ngành đòi hỏi năng động, lãnh đạo, sáng tạo…
                  </li>
                  <li>
                    <strong>Với người Nhật Chủ nhược:</strong> ưu tiên môi trường ổn định, hỗ trợ (giáo dục, chăm sóc sức khoẻ, quản lý nguồn lực) để tăng "nhiên liệu" cho bản thân.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DayMasterSection; 