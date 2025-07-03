import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Label, Badge } from '@embed-tools/components';
import * as d3 from 'd3';

const PairsView = ({ data, selectedSymbol, onSymbolSelect }) => {
  const [threshold, setThreshold] = useState(0.8);

  const pairs = useMemo(() => {
    if (!data) return [];
    return data.significant_correlations
      .filter(c => Math.abs(c.correlation) >= threshold)
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [data, threshold]);

  const getColor = (corr) => {
    return corr > 0 ? d3.interpolateBlues(Math.abs(corr)) : d3.interpolateReds(Math.abs(corr));
  };

  const getColorClass = (corr) => {
    if (corr > 0) return 'bg-green-200 text-green-900';
    if (corr < 0) return 'bg-red-200 text-red-900';
    return 'bg-gray-100 text-gray-700';
  };

  if (!data) {
    return <div className="text-center py-8 text-muted-foreground">Không có dữ liệu cặp tương quan</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Các Cặp Tương Quan Cao</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex gap-4 items-center">
            <Label htmlFor="pairs-threshold">Tương Quan Tối Thiểu: {threshold.toFixed(2)}</Label>
            <input
              id="pairs-threshold"
              type="range"
              min="0.7"
              max="1"
              step="0.01"
              value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
              className="w-48"
            />
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Mã 1</th>
                  <th className="p-2 border">Mã 2</th>
                  <th className="p-2 border">Tương Quan</th>
                </tr>
              </thead>
              <tbody>
                {pairs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-muted-foreground">Không có cặp nào vượt ngưỡng</td>
                  </tr>
                ) : (
                  pairs.map((pair, idx) => (
                    <tr key={pair.symbol1 + '-' + pair.symbol2} className="hover:bg-muted/50">
                      <td className="p-2 border text-center">{idx + 1}</td>
                      <td className="p-2 border">
                        <Badge
                          variant={selectedSymbol === pair.symbol1 ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => onSymbolSelect(pair.symbol1)}
                        >
                          {pair.symbol1}
                        </Badge>
                      </td>
                      <td className="p-2 border">
                        <Badge
                          variant={selectedSymbol === pair.symbol2 ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => onSymbolSelect(pair.symbol2)}
                        >
                          {pair.symbol2}
                        </Badge>
                      </td>
                      <td className="p-2 border text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded font-semibold ${getColorClass(pair.correlation)}`}
                        >
                          {pair.correlation.toFixed(3)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Guide/Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Hướng Dẫn Sử Dụng Bảng Cặp Tương Quan</h4>
            <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>Bảng liệt kê các cặp mã có tương quan mạnh nhất (dương hoặc âm) theo ngưỡng bạn chọn.</li>
              <li>Màu <span className="inline-block px-2 py-0.5 rounded bg-green-200 text-green-900 font-semibold">xanh lá</span>: Cặp cùng chiều (tương quan dương).</li>
              <li>Màu <span className="inline-block px-2 py-0.5 rounded bg-red-200 text-red-900 font-semibold">đỏ</span>: Cặp ngược chiều (tương quan âm).</li>
              <li>Bấm vào mã để lọc hoặc phân tích sâu hơn.</li>
              <li>Bạn có thể dùng bảng này để tìm ý tưởng giao dịch pairs trading hoặc nhận diện các cặp cổ phiếu có mối liên hệ chặt chẽ.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairsView; 