import React from 'react';
import { Card, Badge } from '@embed-tools/components';
import ElementIcon from './ElementIcon';
import InfoButton from './InfoButton';
import { EXPLANATIONS } from '../data/explanations';
import { TRANSLATIONS } from '../data/constants';

const INVESTMENT_HELP = `
<p>Bát Tự (Tứ Trụ), mỗi người có một "Nhật Chủ" (Day Master) – là Can của Trụ Ngày – mang một trong năm hành (Mộc, Hỏa, Thổ, Kim, Thủy). Tùy theo độ "Vượng" hay "Nhược" của Nhật Chủ, ta sẽ tìm ra các hành "hỷ thần" (favorable elements) để cân bằng và hỗ trợ:</p>
<ul>
<li><strong>Xác định sức mạnh Nhật Chủ</strong><br/>
– Nếu Nhật Chủ nhược, tức chưa đủ năng lượng, thì cần các hành sinh (produces) và cả hành bản thân (itself) để bồi dưỡng.<br/>
– Nếu Nhật Chủ vượng, đã thừa năng lượng, thì cần các hành khống chế (controls) lẫn hành bị sinh (produced by it) để điều tiết, tránh "quá đà".</li>
<li><strong>Chọn "Hỷ Thần"</strong><br/>
– Ví dụ, Nhật Chủ là Mộc:<br/>
&nbsp;&nbsp;Nhược → ưu tiên hành Thủy (sinh Mộc) và Mộc (bản thân)<br/>
&nbsp;&nbsp;Vượng → ưu tiên hành Thổ (Mộc khống chế Thổ) và Hỏa (Mộc sinh Hỏa)<br/>
– Chúng tôi đã chọn các cặp đó tự động.</li>
<li><strong>Gán ngành nghề theo Ngũ Hành</strong><br/>
Mỗi hành trong tự nhiên tương ứng với những lĩnh vực kinh tế:<br/>
&nbsp;&nbsp;Mộc: nông – lâm – dệt may – giáo dục…<br/>
&nbsp;&nbsp;Hỏa: năng lượng – công nghệ cao – giải trí – mỹ phẩm…<br/>
&nbsp;&nbsp;Thổ: bất động sản – xây dựng – bảo hiểm – khai khoáng…<br/>
&nbsp;&nbsp;Kim: ngân hàng – cơ khí – kim loại – phần cứng…<br/>
&nbsp;&nbsp;Thủy: logistics – thương mại – du lịch – thủy sản…</li>
<li><strong>Tại sao đầu tư vào ngành của "hỷ thần"?</strong><br/>
– Trong Tứ Trụ, khi bạn "tương hợp" với một hành, đó là môi trường, ngành nghề, hay con người mang năng lượng của hành đó – bạn sẽ "thuận dòng", dễ thăng tiến, ít biến động.<br/>
– Ngược lại, khắc hành (inimical elements) có thể gây nhiều trở ngại, mâu thuẫn, cạnh tranh quá mạnh.</li>
<li><strong>Ví dụ minh hoạ:</strong><br/>
Nhật Chủ là Kim (vượng) → Hỷ Thần: Thủy (Kim sinh Thủy) và Mộc (Kim khống chế Mộc) → gợi ý: "Vận tải & Logistics" (Thủy) và "Nông nghiệp/Giáo dục" (Mộc) sẽ hỗ trợ tốt cho bạn.<br/>
Nhật Chủ là Hỏa (nhược) → Hỷ Thần: Thổ (Hỏa sinh Thổ) và Hỏa → gợi ý: "Bất động sản/Xây dựng" (Thổ) và "Năng lượng/Công nghệ" (Hỏa).</li>
</ul>
<p><strong>Tóm lại:</strong> "(Dựa trên Hỷ Dụng Thần) Các ngành thuộc hành vượng…" có nghĩa là:<br/>
Hãy tập trung đầu tư vào những lĩnh vực thuộc hành mà Bát Tự xác định là "hỗ trợ" hay "cân bằng" cho bạn, vì khi "thuận hành" bạn sẽ dễ thành công, ít trắc trở hơn.</p>
`;

const InvestmentSuggestionSection = ({ favorableElements, industries, unfavorableElements, unfavorableIndustries, onOpenModal }) => {
  if (!favorableElements || !industries) return null;

  // Helper function to translate element names for display
  const translateElement = (element) => {
    return TRANSLATIONS.elements[element] || element;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Ngành Đầu Tư Gợi Ý (Dựa trên Hỷ Dụng Thần)</h2>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Ngành Đầu Tư Gợi Ý', INVESTMENT_HELP)} />
      </div>
      <p className="text-gray-600 mb-4">Các ngành thuộc hành vượng sẽ mang lại nhiều thuận lợi hơn cho việc đầu tư và phát triển.</p>
      
      <div className="space-y-6">
        {/* Favorable Industries Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Hành Tốt Cho Bạn:</h3>
            <div className="flex flex-wrap gap-2">
              {favorableElements.map((element, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <ElementIcon element={element} size="sm" />
                  <span>{translateElement(element)}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Ngành Nghề Phù Hợp:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(industries).map(([element, industryList]) => (
                <div key={element} className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <ElementIcon element={element} size="md" />
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>{translateElement(element)}</span>
                    </Badge>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {industryList.map((industry, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <div>
                          <div className="font-medium text-gray-800">{industry.name}</div>
                          <div className="text-gray-500 text-xs">{industry.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unfavorable Industries Section */}
        {unfavorableElements && unfavorableIndustries && (
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Hành Nên Tránh:</h3>
              <div className="flex flex-wrap gap-2">
                {unfavorableElements.map((element, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center space-x-1">
                    <ElementIcon element={element} size="sm" />
                    <span>{translateElement(element)}</span>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Ngành Nghề Nên Tránh:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(unfavorableIndustries).map(([element, industryList]) => (
                  <div key={element} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <ElementIcon element={element} size="md" />
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <span>{translateElement(element)}</span>
                      </Badge>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {industryList.map((industry, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          <div>
                            <div className="font-medium text-gray-800">{industry.name}</div>
                            <div className="text-gray-500 text-xs">{industry.desc}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InvestmentSuggestionSection; 