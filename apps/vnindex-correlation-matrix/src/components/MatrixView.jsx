import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Label, Badge, Button, Input } from '@embed-tools/components';
import { Search, Filter, SortAsc, SortDesc, Download, Eye, EyeOff } from 'lucide-react';

const MatrixView = ({ data, selectedSymbol, onSymbolSelect }) => {
  const tableRef = useRef(null);
  
  // State for controls
  const [threshold, setThreshold] = useState(0.6); // Higher default threshold
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [hoveredCell, setHoveredCell] = useState(null);
  const [maxSymbols, setMaxSymbols] = useState(50); // Limit symbols for performance

  // Memoized data processing
  const processedData = useMemo(() => {
    if (!data) return null;

    const { symbols, significant_correlations } = data;
    
    // Create correlation matrix
    const matrix = {};
    
    // Filter symbols based on search first
    let filteredSymbols = symbols;
    if (searchTerm) {
      filteredSymbols = symbols.filter(s => 
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter symbols to only those with significant correlations
    const symbolsWithCorrelations = new Set();
    significant_correlations.forEach(corr => {
      if (Math.abs(corr.correlation) >= threshold) {
        symbolsWithCorrelations.add(corr.symbol1);
        symbolsWithCorrelations.add(corr.symbol2);
      }
    });
    filteredSymbols = filteredSymbols.filter(s => symbolsWithCorrelations.has(s));

    // Limit symbols for performance
    const limitedSymbols = filteredSymbols.slice(0, maxSymbols);
    
    // Initialize matrix for limited symbols with ALL symbols as columns
    limitedSymbols.forEach(s1 => {
      matrix[s1] = {};
      symbols.forEach(s2 => {
        matrix[s1][s2] = 0;
      });
    });

    // Fill in correlation values (for limited symbols with ALL symbols)
    significant_correlations.forEach(corr => {
      // Only fill if the row symbol is in our limited set
      if (matrix[corr.symbol1] && Math.abs(corr.correlation) >= threshold) {
        matrix[corr.symbol1][corr.symbol2] = corr.correlation;
      }
      if (matrix[corr.symbol2] && Math.abs(corr.correlation) >= threshold) {
        matrix[corr.symbol2][corr.symbol1] = corr.correlation;
      }
    });

    // Find all columns that are strongly related or opposite to any row
    const relatedColumnsSet = new Set();
    limitedSymbols.forEach(row => {
      symbols.forEach(col => {
        const val = matrix[row][col];
        if (val >= threshold || val <= -threshold) {
          relatedColumnsSet.add(col);
        }
      });
    });
    // Always include the row symbols themselves for context
    limitedSymbols.forEach(s => relatedColumnsSet.add(s));
    const relatedColumns = Array.from(relatedColumnsSet).sort();

    // Calculate average correlation strength for each symbol (only significant correlations)
    const symbolStrength = {};
    limitedSymbols.forEach(symbol => {
      const correlations = symbols
        .filter(s => s !== symbol)
        .map(s => Math.abs(matrix[symbol][s]))
        .filter(val => val >= threshold);
      
      symbolStrength[symbol] = correlations.length > 0 
        ? correlations.reduce((sum, val) => sum + val, 0) / correlations.length
        : 0;
    });

    // Sort symbols
    let sortedSymbols = [...limitedSymbols];
    switch (sortBy) {
      case 'alphabetical':
        sortedSymbols.sort();
        break;
      case 'correlation':
        sortedSymbols.sort((a, b) => symbolStrength[b] - symbolStrength[a]);
        break;
      case 'strength':
        sortedSymbols.sort((a, b) => {
          const aCount = symbols.filter(s => Math.abs(matrix[a][s]) >= threshold).length;
          const bCount = symbols.filter(s => Math.abs(matrix[b][s]) >= threshold).length;
          return bCount - aCount;
        });
        break;
    }

    return {
      symbols: sortedSymbols,
      allSymbols: relatedColumns, // Only show related/opposite columns
      matrix,
      symbolStrength,
      totalSymbols: symbols.length,
      displayedSymbols: sortedSymbols.length,
      significantSymbols: relatedColumns.length
    };
  }, [data, searchTerm, sortBy, threshold, maxSymbols]);

  // Get correlation color
  const getCorrelationColor = (value) => {
    if (value >= threshold) return 'bg-green-100'; // Strong positive
    if (value <= -threshold) return 'bg-red-100'; // Strong negative
    return 'bg-gray-100'; // Weak/none
  };

  // Get correlation text color
  const getCorrelationTextColor = (value) => {
    if (value >= threshold) return 'text-green-700 font-semibold';
    if (value <= -threshold) return 'text-red-700 font-semibold';
    return 'text-gray-400';
  };

  // Export function
  const exportData = () => {
    if (!processedData) return;
    
    const { symbols, matrix } = processedData;
    const csvContent = [
      ['Symbol1', 'Symbol2', 'Correlation'],
      ...symbols.flatMap(s1 => 
        symbols.map(s2 => [s1, s2, matrix[s1][s2].toFixed(4)])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'correlation_matrix.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data) {
    return <div className="text-center py-8 text-muted-foreground">Không có dữ liệu ma trận</div>;
  }

  const stats = processedData ? {
    total: processedData.totalSymbols,
    displayed: processedData.displayedSymbols,
    significant: processedData.significantSymbols
  } : { total: 0, displayed: 0, significant: 0 };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ma Trận Tương Quan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mã..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 w-48"
              />
            </div>

            {/* Max symbols limit */}
            <div className="flex items-center gap-2">
              <Label htmlFor="maxSymbols">Giới hạn: {maxSymbols}</Label>
              <input
                id="maxSymbols"
                type="range"
                min="20"
                max="100"
                step="10"
                value={maxSymbols}
                onChange={e => setMaxSymbols(parseInt(e.target.value))}
                className="w-32"
              />
            </div>

            {/* Threshold */}
            <div className="flex items-center gap-2">
              <Label htmlFor="threshold">Ngưỡng: {threshold.toFixed(2)}</Label>
              <input
                id="threshold"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={threshold}
                onChange={e => setThreshold(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Label htmlFor="sort">Sắp xếp:</Label>
              <select
                id="sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="alphabetical">Bảng chữ cái</option>
                <option value="correlation">Tương quan TB</option>
                <option value="strength">Số kết nối</option>
              </select>
            </div>

            {/* Threshold info */}
            <div className="text-sm text-muted-foreground">
              Chỉ hiển thị tương quan ≥ {threshold}
            </div>

            {/* Export */}
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Xuất CSV
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <Badge variant="secondary">Tổng: {stats.total}</Badge>
            <Badge variant="secondary">Có tương quan: {stats.significant}</Badge>
            <Badge variant="secondary">Hiển thị: {stats.displayed}</Badge>
            {selectedSymbol && (
              <Badge variant="default">Đã chọn: {selectedSymbol}</Badge>
            )}
          </div>

          {/* Performance warning */}
          {stats.total > 100 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Dữ liệu lớn ({stats.total} mã). Đang hiển thị {stats.displayed} mã đầu tiên để tối ưu hiệu suất.
                Sử dụng thanh "Giới hạn" để điều chỉnh.
              </p>
            </div>
          )}

          {/* Correlation Table */}
          <div className="bg-muted/50 rounded-lg p-4 relative overflow-auto">
            {processedData && (
              <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                <table ref={tableRef} className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-gray-800 text-white p-2 text-xs font-medium border border-gray-600 min-w-[80px]">
                        Mã
                      </th>
                      {processedData.allSymbols.map(symbol => (
                        <th 
                          key={symbol}
                          className={`p-2 text-xs font-medium border border-gray-600 min-w-[60px] cursor-pointer hover:bg-gray-700 transition-colors ${
                            symbol === selectedSymbol ? 'bg-yellow-600 text-black' : 'bg-gray-800 text-white'
                          }`}
                          onClick={() => onSymbolSelect(symbol)}
                          title={`Click để chọn ${symbol}`}
                        >
                          {symbol}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.symbols.map(symbol1 => (
                      <tr key={symbol1}>
                        <td 
                          className={`sticky left-0 p-2 text-xs font-medium border border-gray-600 cursor-pointer hover:bg-gray-200 transition-colors ${
                            symbol1 === selectedSymbol ? 'bg-yellow-200' : 'bg-gray-100'
                          }`}
                          onClick={() => onSymbolSelect(symbol1)}
                          title={`Click để chọn ${symbol1}`}
                        >
                          {symbol1}
                        </td>
                        {processedData.allSymbols.map(symbol2 => {
                          const correlation = processedData.matrix[symbol1][symbol2];
                          const isDiagonal = symbol1 === symbol2;
                          const isSelected = symbol1 === selectedSymbol || symbol2 === selectedSymbol;
                          
                          return (
                            <td
                              key={`${symbol1}-${symbol2}`}
                              className={`p-1 text-xs text-center border border-gray-300 cursor-pointer transition-all ${
                                isDiagonal 
                                  ? 'bg-gray-300 font-bold' 
                                  : getCorrelationColor(correlation)
                              } ${
                                isSelected ? 'ring-2 ring-yellow-400' : ''
                              } hover:ring-1 hover:ring-blue-400`}
                              onClick={() => {
                                if (!isDiagonal) {
                                  const targetSymbol = symbol1 === selectedSymbol ? symbol2 : symbol1;
                                  onSymbolSelect(targetSymbol);
                                }
                              }}
                              onMouseEnter={() => setHoveredCell({ symbol1, symbol2, correlation })}
                              onMouseLeave={() => setHoveredCell(null)}
                              title={
                                isDiagonal 
                                  ? `${symbol1} - Tự tương quan (1.000)`
                                  : `${symbol1} ↔ ${symbol2}: ${correlation.toFixed(3)}`
                              }
                            >
                              {isDiagonal ? '1.00' : Math.abs(correlation) >= threshold ? correlation.toFixed(2) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">📊 Chú Thích Màu Sắc</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300"></div>
                <span>Tương quan dương mạnh (≥{threshold})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300"></div>
                <span>Tương quan âm mạnh (≤-{threshold})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-200"></div>
                <span>Tương quan yếu hoặc không có</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Hướng Dẫn Sử Dụng Bảng</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h5 className="font-medium mb-2">🎯 Cách Đọc:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Màu xanh:</strong> Tương quan dương (cùng hướng)</li>
                  <li><strong>Màu đỏ:</strong> Tương quan âm (ngược hướng)</li>
                  <li><strong>Màu xám:</strong> Tương quan yếu hoặc không có</li>
                  <li><strong>Đường chéo:</strong> Tự tương quan (luôn = 1.00)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">🔍 Tương Tác:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Hover:</strong> Xem giá trị tương quan</li>
                  <li><strong>Click:</strong> Chọn mã cổ phiếu</li>
                  <li><strong>Tìm kiếm:</strong> Lọc theo tên mã</li>
                  <li><strong>Giới hạn:</strong> Điều chỉnh số mã hiển thị</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatrixView;
