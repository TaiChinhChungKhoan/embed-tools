import React, { useState, useMemo, useContext } from 'react';
import { TrendingUp, ChevronUp, ChevronDown, Search, Settings, Eye, EyeOff } from 'lucide-react';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";
import { DataReloadContext } from '../contexts/DataReloadContext';
import { useTickerInfoWithData } from '../utils/dataLoader';
import { getTrendIcon, getMomentumColor, getConsistencyColor, getRsTrendColor, getCrsColor } from './detailed-analysis/utils/colorUtils';
import SymbolInfoPanelMinified from './rrg/SymbolInfoPanelMinified';
import IndustryInfoPanelMinified from './rrg/IndustryInfoPanelMinified';
import { 
  getColorForRSValue, 
  getColorForCRS, 
  getColorForSlope, 
  getColorForSlopeDelta, 
  getColorForTurnUpPeriods, 
  getColorForUpRatio, 
  getColorForNetDecayed 
} from '../utils/rsColorUtils';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

// Color mappings are now imported from centralized rsColorUtils

const EnhancedRSAnalysis = ({ 
  data,
  dataType = 'industry', // 'industry' or 'ticker'
  filteredItems = null,
  title = 'Enhanced RS Analysis',
  loading = false,
  error = null,
  // Industry filter props
  availableIndustries = [],
  selectedIndustries = [],
  onIndustryFilterChange = null
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  
  // Get pre-loaded data from context
  const { companies, industries } = useContext(DataReloadContext);
  const { getIndustryName } = useTickerInfoWithData(companies, industries);

  // Process data based on type
  const processedData = useMemo(() => {
    if (!data) return [];
    
    let items = [];
    if (dataType === 'industry') {
      items = data.industries || [];
      // Enrich with industry names
      return items.map(industry => ({
        ...industry,
        industry: industry.name || getIndustryName(industry.custom_id) || industry.custom_id
      }));
    } else if (dataType === 'ticker') {
      items = data.symbols || [];
      
      // Filter tickers if filteredItems is provided
      if (filteredItems && filteredItems.length > 0) {
        const filteredIds = new Set(filteredItems.map(t => t.symbol));
        items = items.filter(symbol => filteredIds.has(symbol.id || symbol.symbol));
      }
      
      return items;
    }
    
    return items;
  }, [data, dataType, filteredItems, getIndustryName]);

  // Get all unique dates from the data for heatmap columns
  const allDates = useMemo(() => {
    const dates = new Set();
    processedData.forEach(item => {
      if (item.rs_bars) {
        item.rs_bars.forEach(bar => {
          if (bar.date) {
            dates.add(bar.date);
          }
        });
      }
    });
    
    // Sort dates chronologically with latest dates first (most recent to oldest)
    const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));
    return sortedDates;
  }, [processedData]);

  // Create column helper for TanStack Table
  const columnHelper = createColumnHelper();

  // Define columns
  const columns = useMemo(() => {
    const baseColumns = [
      // Counter column
      {
        id: 'counter',
        header: '#',
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const currentPageRows = table.getRowModel().rows;
          
          const displayIndex = currentPageRows.findIndex(r => r.id === row.id);
          return pageIndex * pageSize + displayIndex + 1;
        },
        size: 40,
        enableSorting: false,
      },
      
      // Name column
      columnHelper.accessor(dataType === 'industry' ? 'industry' : 'symbol', {
        header: dataType === 'industry' ? 'Industry' : 'Symbol',
        cell: ({ getValue }) => (
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm text-left">
            {getValue()}
          </div>
        ),
        enableSorting: true,
        enableGlobalFilter: true,
      }),

      // Industry column for tickers
      ...(dataType === 'ticker' ? [
        columnHelper.accessor('industry_name', {
          header: 'Sector',
          cell: ({ getValue }) => (
            <div className="text-xs text-gray-600">
              {getValue() || '-'}
            </div>
          ),
          enableSorting: true,
          enableGlobalFilter: true,
        })
      ] : []),

      // Core RS columns (always visible)
      columnHelper.accessor('current_crs', {
        header: 'CRS',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForCRS(value)}`}>
              {value !== undefined && value !== null ? `${(value * 100).toFixed(1)}%` : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      columnHelper.accessor(row => row.rs_slope_fast, {
        id: 'rs_slope_fast',
        header: 'Fast',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForSlope(value)}`}>
              {value !== undefined && value !== null ? `${(value * 100).toFixed(1)}%` : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      columnHelper.accessor(row => row.rs_slope_slow, {
        id: 'rs_slope_slow',
        header: 'Slow',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForSlope(value)}`}>
              {value !== undefined && value !== null ? `${(value * 100).toFixed(1)}%` : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      columnHelper.accessor(row => row.slope_delta, {
        id: 'slope_delta',
        header: 'Delta',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForSlopeDelta(value)}`}>
              {value !== undefined && value !== null ? `${(value * 100).toFixed(2)}%` : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      // MPS (Momentum Progress Score) - Primary ranking metric
      columnHelper.accessor(row => row.metrics?.mps, {
        id: 'mps',
        header: 'MPS',
        cell: ({ getValue }) => {
          const value = getValue();
          const getColorForMPS = (mps) => {
            if (mps >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            if (mps >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
          };
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium text-center ${getColorForMPS(value)}`}>
              {value !== undefined && value !== null ? value.toFixed(1) : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      // MPS Acceleration - Shows momentum improvement rate
      columnHelper.accessor(row => row.metrics?.mps_acceleration, {
        id: 'mps_acceleration', 
        header: 'MPS Δ',
        cell: ({ getValue }) => {
          const value = getValue();
          const getColorForMPSAccel = (accel) => {
            if (accel > 0.1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            if (accel > -0.1) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
          };
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium text-center ${getColorForMPSAccel(value)}`}>
              {value !== undefined && value !== null ? (value > 0 ? '+' : '') + value.toFixed(3) : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      columnHelper.accessor(row => row.up_ratio, {
        id: 'up_ratio',
        header: 'Up%',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForUpRatio(value)}`}>
              {value !== undefined && value !== null ? `${(value * 100).toFixed(0)}%` : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      
      columnHelper.accessor(row => row.net_decayed, {
        id: 'net_decayed',
        header: 'Net',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForNetDecayed(value)}`}>
              {value !== undefined && value !== null ? value.toFixed(1) : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
    ];

    // Add advanced columns if enabled
    if (showAdvanced) {
      baseColumns.push(
        // Direction
        columnHelper.accessor(row => row.performance_summary?.rs_trend, {
          id: 'direction',
          header: 'Direction',
          cell: ({ getValue }) => {
            const direction = getValue();
            const iconData = getTrendIcon(direction);
            const IconComponent = iconData?.icon;
            return (
              <div className="flex items-center gap-1">
                {IconComponent && <IconComponent className={iconData.className} />}
                <span className={`text-xs font-medium ${getRsTrendColor(direction)}`}>
                  {direction || '-'}
                </span>
              </div>
            );
          },
          enableSorting: true,
        }),

        // Speed
        columnHelper.accessor(row => row.metrics?.mps > 70 ? 'Nhanh' : row.metrics?.mps > 30 ? 'Trung bình' : 'Chậm', {
          id: 'speed_category',
          header: 'Speed',
          cell: ({ getValue }) => {
            const speed = getValue();
            return (
              <span className={`text-xs font-medium ${getMomentumColor(speed)}`}>
                {speed || '-'}
              </span>
            );
          },
          enableSorting: true,
        }),


      );
    }

    // Add RS heatmap date columns
    allDates.forEach(date => {
      baseColumns.push(
        columnHelper.accessor(`rs_bars.${date}`, {
          header: () => (
            <div className="text-center text-xs font-medium">
              {new Date(date).toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit' 
              })}
            </div>
          ),
          cell: ({ row }) => {
            const rsValue = row.original.rs_bars?.find(bar => bar.date === date)?.rs_value;
            return (
              <div 
                className={`w-full h-6 flex items-center justify-center text-xs font-medium ${getColorForRSValue(rsValue)}`}
                title={`${row.original.symbol || row.original.name || row.original.industry}: ${rsValue ? Math.round(rsValue * 100) : 'N/A'} (${date})`}
              >
                {rsValue ? Math.round(rsValue * 100) : '-'}
              </div>
            );
          },
          enableSorting: true,
          sortingFn: (rowA, rowB, columnId) => {
            const aValue = rowA.original.rs_bars?.find(bar => bar.date === date)?.rs_value || 0;
            const bValue = rowB.original.rs_bars?.find(bar => bar.date === date)?.rs_value || 0;
            return aValue - bValue;
          },
        })
      );
    });

    return baseColumns;
  }, [dataType, showAdvanced, allDates, columnHelper]);

  // Create table instance
  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 50,
      },
      sorting: [
        {
          id: 'mps',
          desc: true,
        },
      ],
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        Lỗi tải dữ liệu: {error}
      </div>
    );
  }

  if (!data || !processedData.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu RS 21-bar
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        
        {/* Advanced columns toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="cursor-pointer flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showAdvanced ? 'Ẩn cột nâng cao' : 'Hiện cột nâng cao'}
        </button>
      </div>

      {/* Color Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">Chú thích:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span>≥ 80</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-700 rounded"></div>
          <span>70-79</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>60-69</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>40-59</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>≤ 39</span>
        </div>
      </div>

             {/* Search and Filters */}
       <div className="flex items-center gap-4">
         <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
           <input
             type="text"
             placeholder={`Tìm kiếm ${dataType === 'industry' ? 'ngành' : 'cổ phiếu'}...`}
             value={globalFilter ?? ''}
             onChange={(e) => setGlobalFilter(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
         </div>
         
         {/* Industry Filter for tickers */}
         {dataType === 'ticker' && onIndustryFilterChange && availableIndustries.length > 0 && (
           <div className="flex items-center gap-2 flex-1">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
               Ngành:
             </label>
             <MultiSelect
               options={availableIndustries.map(industry => ({
                 value: industry.id,
                 label: industry.name
               }))}
               value={selectedIndustries}
               onValueChange={onIndustryFilterChange}
               placeholder="Chọn ngành..."
               className="flex-1 min-w-64"
             />
           </div>
         )}
         
         <div className="text-sm text-gray-600 whitespace-nowrap">
           {table.getFilteredRowModel().rows.length} / {table.getCoreRowModel().rows.length} {dataType === 'industry' ? 'ngành' : 'cổ phiếu'}
         </div>
         <div className="text-xs text-gray-500 italic whitespace-nowrap">
           💡 Click vào hàng để xem chi tiết
         </div>
       </div>

      {/* Enhanced RS Analysis Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full border-collapse min-w-max">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`text-xs font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors ${
                        header.id === 'industry' || header.id === 'name' ? 'text-left px-0.5 py-1' :
                        header.id.includes('rs_bars.') ? 'text-center px-0 py-1' : 'text-center px-0.5 py-1'
                      }`}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className={`flex items-center gap-1 ${
                        header.id === 'industry' || header.id === 'name' ? 'justify-start' : 'justify-center'
                      }`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3 opacity-30">
                                <ChevronUp className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <tr
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedRowIndex === row.index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => {
                      setSelectedRowIndex(selectedRowIndex === row.index ? null : row.index);
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id} 
                        className={`text-center text-xs ${
                          cell.column.id.includes('rs_bars.') ? 'px-0 py-1' : 'px-0.5 py-1'
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {selectedRowIndex === row.index && (
                    <tr>
                      <td colSpan={columns.length} className="px-3 py-4 bg-gray-50 dark:bg-gray-800">
                        {dataType === 'ticker' ? (
                          <SymbolInfoPanelMinified symbol={row.original} />
                        ) : (
                          <IndustryInfoPanelMinified industry={row.original} />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
          >
            {[50, 100, 200, 500].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Explanations */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Giải thích RS 21-Bar Enhanced Analysis
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>• <strong>Tương tác:</strong> Click vào bất kỳ hàng nào để xem thông tin chi tiết và phân tích sâu</p>
          <p>• <strong>MPS:</strong> Momentum Progress Score - Điểm số tiến bộ động lượng. Đo lường sự cải thiện liên tục của RS qua nhiều khung thời gian (5d, 10d, 21d). 70-100: Mạnh; 40-70: Chuyển tiếp; 0-40: Yếu</p>
          <p>• <strong>MPS Δ:</strong> Tốc độ gia tăng điểm MPS. &gt;0.1: Tăng tốc; -0.1~0.1: Ổn định; &lt;-0.1: Chậm lại</p>
          <p>• <strong>CRS:</strong> Cumulative Relative Strength - Sức mạnh tích lũy so với chỉ số</p>
          <p>• <strong>Fast:</strong> RS Slope Fast - Độ dốc RS ngắn hạn (5 phiên)</p>
          <p>• <strong>Slow:</strong> RS Slope Slow - Độ dốc RS dài hạn (21 phiên)</p>
          <p>• <strong>Delta:</strong> Chênh lệch Fast - Slow. &gt;0 = đang mạnh lên (bứt tốc); &lt;0 = đang yếu đi</p>
          <p>• <strong>Up%:</strong> Tỷ lệ các phiên RS tăng trong kỳ đánh giá. Gần 100% = tăng đều; gần 0% = giảm đều</p>
          <p>• <strong>Net:</strong> Số bar tăng ròng (có trọng số). &gt;0 = tăng đều; &lt;0 = giảm đều, xác nhận xu hướng gần đây</p>
        </div>
        
        {showAdvanced && (
          <>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 mt-4">Cột nâng cao:</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• <strong>Direction:</strong> Phương hướng chung của RS (Tăng/Giảm/Trung lập)</p>
              <p>• <strong>Speed:</strong> Mức độ thay đổi RS (Nhanh/Chậm/Ổn định)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedRSAnalysis;