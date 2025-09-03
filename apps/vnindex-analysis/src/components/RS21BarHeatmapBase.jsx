import React, { useState, useMemo } from 'react';
import { TrendingUp, ChevronUp, ChevronDown, Search } from 'lucide-react';
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

const RS21BarHeatmapBase = ({ 
  data, 
  dataType = 'industry', // 'industry' or 'ticker'
  filteredItems = null, // For ticker filtering
  title = 'RS 21-Bar Heatmap',
  showAdditionalColumns = true, // Show CRS, Fast, Slow columns
  onItemClick = null,
  selectedItem = null,
  setSelectedItem = null
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  // Process data based on type
  const processedData = useMemo(() => {
    if (!data) return [];
    
    let items = [];
    if (dataType === 'industry') {
      items = data.industries || [];
    } else if (dataType === 'ticker') {
      items = data.symbols || [];
      
      // Filter tickers if filteredItems is provided
      if (filteredItems && filteredItems.length > 0) {
        const filteredIds = new Set(filteredItems.map(t => t.symbol));
        items = items.filter(symbol => filteredIds.has(symbol.id || symbol.symbol));
      }
    }
    
    return items;
  }, [data, dataType, filteredItems]);

  // Get all unique dates from the data
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
      // Numbering column
      {
        id: 'counter',
        header: '#',
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const currentPageRows = table.getRowModel().rows;
          
          // Find the index by comparing row IDs instead of object references
          const displayIndex = currentPageRows.findIndex(r => r.id === row.id);
          return pageIndex * pageSize + displayIndex + 1;
        },
        size: 60,
        enableSorting: false,
      },
      // Name column
      columnHelper.accessor('name', {
        header: dataType === 'industry' ? 'Ngành' : 'Mã CP',
        cell: ({ getValue }) => (
          <div className="font-medium text-gray-900">
            {getValue()}
          </div>
        ),
        enableSorting: true,
        enableGlobalFilter: true,
      }),
    ];

    // Industry column for tickers
    if (dataType === 'ticker') {
      baseColumns.push(
        columnHelper.accessor('industry_name', {
          header: 'Ngành',
          cell: ({ getValue }) => (
            <div className="text-xs text-gray-600">
              {getValue() || '-'}
            </div>
          ),
          enableSorting: true,
          enableGlobalFilter: true,
        })
      );
    }

    // Additional columns (CRS, Fast, Slow)
    if (showAdditionalColumns) {
      baseColumns.push(
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
        })
      );
    }

    // Date columns
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
                title={`${row.original.name}: ${rsValue ? Math.round(rsValue * 100) : 'N/A'} (${date})`}
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
  }, [dataType, showAdditionalColumns, allDates, columnHelper]);

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
          id: 'current_crs',
          desc: true,
        },
      ],
    },
  });

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
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Tìm kiếm ${dataType === 'industry' ? 'ngành' : 'cổ phiếu'}...`}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-600">
          {table.getFilteredRowModel().rows.length} / {table.getCoreRowModel().rows.length} {dataType === 'industry' ? 'ngành' : 'cổ phiếu'}
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-1 py-1 text-center text-xs font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors ${
                        header.id === 'name' ? 'sticky left-8 bg-gray-50 z-10 text-left' : ''
                      }`}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center justify-center gap-1">
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
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    selectedItem && selectedItem.id === row.original.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    if (onItemClick) {
                      onItemClick(selectedItem && selectedItem.id === row.original.id ? null : row.original);
                    }
                    if (setSelectedItem) {
                      setSelectedItem(selectedItem && selectedItem.id === row.original.id ? null : row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={`px-1 py-1 text-center text-xs ${
                        cell.column.id === 'name' ? 'sticky left-8 bg-white z-10 text-left' : ''
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
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
    </div>
  );
};

export default RS21BarHeatmapBase; 