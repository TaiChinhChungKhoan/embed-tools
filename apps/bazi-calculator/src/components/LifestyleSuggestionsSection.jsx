import React from 'react';
import { Card, Badge } from '@embed-tools/components';
import ElementIcon from './ElementIcon';
import InfoButton from './InfoButton';
import { getBaziSuggestions, TRANSLATIONS } from '../data/constants';

const LIFESTYLE_HELP = `
<p>Dựa trên phân tích Bát Tự, mỗi hành (Ngũ Hành) có những đặc tính riêng về màu sắc, vật liệu và môi trường phù hợp:</p>
<ul>
<li><strong>Kim (Kim loại):</strong> Màu trắng, xám bạc, vàng kim; vật liệu kim loại, inox; hướng Tây – Tây Bắc</li>
<li><strong>Thổ (Đất):</strong> Màu vàng đất, nâu, be; vật liệu đá tự nhiên, gốm sứ; nơi cao ráo, vùng đồi núi</li>
<li><strong>Mộc (Gỗ):</strong> Màu xanh lá cây, xanh cốm; vật liệu gỗ tự nhiên, tre, nứa; hướng Đông – Đông Nam</li>
<li><strong>Hỏa (Lửa):</strong> Màu đỏ, hồng, cam; vật liệu đèn LED, thủy tinh màu; hướng Nam, nơi ấm áp</li>
<li><strong>Thủy (Nước):</strong> Màu đen, xanh dương; vật liệu thủy tinh, gương; hướng Bắc, gần nước</li>
</ul>
<p><strong>Lưu ý:</strong> Những gợi ý này giúp tạo môi trường sống và làm việc phù hợp với vận khí của bạn, mang lại sự cân bằng và thuận lợi trong cuộc sống.</p>
`;

const LifestyleSuggestionsSection = ({ favorableElements, unfavorableElements, onOpenModal }) => {
  if (!favorableElements || !unfavorableElements) return null;

  const suggestions = getBaziSuggestions(favorableElements, unfavorableElements);

  // Helper function to translate element names for display
  const translateElement = (element) => {
    return TRANSLATIONS.elements[element] || element;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Gợi Ý Lối Sống & Môi Trường</h2>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Gợi Ý Lối Sống', LIFESTYLE_HELP)} />
      </div>
      <p className="text-gray-600 mb-4">Dựa trên hành tốt và hành cần tránh, đây là những gợi ý về màu sắc, vật liệu và môi trường phù hợp.</p>
      
      <div className="space-y-6">
        {/* Recommendations to Use */}
        {suggestions.goiYNenDung.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Nên Sử Dụng:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.goiYNenDung.map((item, index) => (
                <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <ElementIcon element={item.element} size="md" />
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>{translateElement(item.element)}</span>
                    </Badge>
                  </div>
                  
                  {item.colors.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Màu sắc:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.colors.map((color, colorIndex) => (
                          <Badge key={colorIndex} variant="secondary" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.materials.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Vật liệu:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.materials.map((material, materialIndex) => (
                          <Badge key={materialIndex} variant="secondary" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.environment.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Môi trường:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.environment.map((env, envIndex) => (
                          <Badge key={envIndex} variant="secondary" className="text-xs">
                            {env}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations to Avoid */}
        {suggestions.goiYNenTranh.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Nên Tránh:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.goiYNenTranh.map((item, index) => (
                <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <ElementIcon element={item.element} size="md" />
                    <Badge variant="destructive" className="flex items-center space-x-1">
                      <span>{translateElement(item.element)}</span>
                    </Badge>
                  </div>
                  
                  {item.colors.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Màu sắc:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.colors.map((color, colorIndex) => (
                          <Badge key={colorIndex} variant="destructive" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.materials.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Vật liệu:</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.materials.map((material, materialIndex) => (
                          <Badge key={materialIndex} variant="destructive" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LifestyleSuggestionsSection; 