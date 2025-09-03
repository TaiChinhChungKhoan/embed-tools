import React, { useState, useMemo } from 'react';
import { useDataLoader, useCompanies, useIndustries, enrichTickersWithIndustries } from '../utils/dataLoader';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Target, Clock, BarChart, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const VCPAnalysis = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [recencyFilter, setRecencyFilter] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [industryFilter, setIndustryFilter] = useState([]);

  const { data: vcpData, loading, error } = useDataLoader('VCP_ANALYSIS', timeframe);
  const { data: companies } = useCompanies();
  const { data: industries } = useIndustries();

  const summary = useMemo(() => {
    if (!vcpData) return null;
    
    // Handle different data formats: array, object with signals property, or object with numeric keys
    let signals = [];
    if (Array.isArray(vcpData)) {
      signals = vcpData;
    } else if (vcpData.results) {
      signals = vcpData.results;
    } else if (vcpData.signals) {
      signals = vcpData.signals;
    } else if (typeof vcpData === 'object' && vcpData !== null) {
      // Convert object with numeric keys to array
      signals = Object.values(vcpData);
    }
    
    const totalSignals = signals.length;
    const recentSignals = signals.filter(signal => Number(signal.bars_since_pattern_ended) <= 7).length;
    const activePatterns = signals.filter(signal => signal.still_contracting === true).length;
    const strongContraction = signals.filter(signal => Number(signal.contraction_rating) >= 7).length;
    
    // Filter out signals with invalid confidence values
    const validSignals = signals.filter(signal => {
      const confidence = Number(signal.confidence);
      return !isNaN(confidence) && confidence >= 0 && confidence <= 1;
    });
    
    const highConfidenceSignals = validSignals.filter(signal => Number(signal.confidence) >= 0.7).length;
    
    const averageConfidence = validSignals.length > 0 
      ? validSignals.reduce((sum, signal) => sum + Number(signal.confidence), 0) / validSignals.length 
      : 0;

    // Calculate average contraction rating
    const validRatings = signals.filter(signal => {
      const rating = Number(signal.contraction_rating);
      return !isNaN(rating) && rating >= 1 && rating <= 10;
    });
    
    const averageRating = validRatings.length > 0
      ? validRatings.reduce((sum, signal) => sum + Number(signal.contraction_rating), 0) / validRatings.length
      : 0;

    return {
      totalSignals,
      recentSignals,
      activePatterns,
      strongContraction,
      highConfidenceSignals,
      averageConfidence,
      averageRating
    };
  }, [vcpData]);

  // Enrich VCP data with industry information
  const enrichedVcpData = useMemo(() => {
    if (!vcpData || !companies || !industries) return vcpData;
    
    // Handle different data formats
    let signals = [];
    if (Array.isArray(vcpData)) {
      signals = vcpData;
    } else if (vcpData.results) {
      signals = vcpData.results;
    } else if (vcpData.signals) {
      signals = vcpData.signals;
    } else if (typeof vcpData === 'object' && vcpData !== null) {
      signals = Object.values(vcpData);
    }
    
    // Enrich signals with industry information
    const enrichedSignals = signals.map(signal => {
      const company = companies[signal.symbol];
      const primaryIndustry = company?.industries?.[0];
      const industryId = primaryIndustry?.custom_id;
      const industry = industryId ? industries[industryId] : null;
      
      return {
        ...signal,
        industry_name: industry?.name || '-',
        industry_id: industryId || null
      };
    });
    
    return enrichedSignals;
  }, [vcpData, companies, industries]);

  // Get available industries from the enriched data
  const availableIndustries = useMemo(() => {
    if (!enrichedVcpData) return [];
    
    // Get unique industries from enriched signals
    const industryMap = new Map();
    
    enrichedVcpData.forEach(signal => {
      if (signal.industry_name && signal.industry_id && signal.industry_name !== '-') {
        if (!industryMap.has(signal.industry_id)) {
          industryMap.set(signal.industry_id, {
            id: signal.industry_id,
            name: signal.industry_name
          });
        }
      }
    });
    
    return Array.from(industryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [enrichedVcpData]);

  // Create column helper for TanStack Table
  const columnHelper = createColumnHelper();

  // Define columns
  const columns = useMemo(() => {
    return [
      // Symbol column
      columnHelper.accessor('symbol', {
        header: () => (
          <div className="text-left text-xs font-medium">
            Mã CK
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="font-medium text-gray-900 text-left">
            {getValue()}
          </div>
        ),
        enableSorting: true,
        enableGlobalFilter: true,
      }),
      // Industry column
      columnHelper.accessor('industry_name', {
        header: () => (
          <div className="text-left text-xs font-medium">
            Ngành
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-xs text-gray-600 truncate max-w-[120px] text-left">
            {getValue() || '-'}
          </div>
        ),
        enableSorting: true,
        enableGlobalFilter: true,
      }),
      // Pattern start timestamp column (grouped with timing columns)
      columnHelper.accessor('pattern_start_timestamp', {
        header: 'Ngày bắt đầu',
        cell: ({ getValue }) => {
          const timestamp = getValue();
          const date = timestamp ? new Date(timestamp) : null;
          return (
            <div className="text-xs text-gray-600">
              {date ? date.toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit',
                year: 'numeric'
              }) : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      // Pattern duration column (grouped with timing columns)
      columnHelper.accessor('pattern_duration', {
        header: 'Thời gian nén',
        cell: ({ getValue }) => (
          <div className="text-xs text-gray-900">
            {getValue()}
          </div>
        ),
        enableSorting: true,
      }),
      // Bars since pattern ended column (grouped with timing columns)
      columnHelper.accessor('bars_since_pattern_ended', {
        header: 'Bars kết thúc',
        cell: ({ getValue }) => {
          const bars = getValue();
          return (
            <div className={`px-1 py-0.5 text-xs ${getRecencyColor(bars)}`}>
              {bars}
            </div>
          );
        },
        enableSorting: true,
      }),
      // Is contracting status column
      columnHelper.accessor('still_contracting', {
        header: 'Đang thắt',
        cell: ({ getValue }) => {
          const isContracting = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium text-center ${
              isContracting 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isContracting ? 'Có' : 'Không'}
            </div>
          );
        },
        enableSorting: true,
      }),
      // Contraction rating column
      columnHelper.accessor('contraction_rating', {
        header: 'Độ co hẹp',
        cell: ({ getValue }) => {
          const rating = getValue();
          let colorClass = 'text-gray-600';
          if (rating >= 8) colorClass = 'bg-green-100 text-green-800';
          else if (rating >= 6) colorClass = 'bg-yellow-100 text-yellow-800';
          else if (rating >= 4) colorClass = 'bg-orange-100 text-orange-800';
          else colorClass = 'bg-red-100 text-red-800';
          
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${colorClass}`}>
              {rating || '-'}/10
            </div>
          );
        },
        enableSorting: true,
      }),
      // Confidence column
      columnHelper.accessor('confidence', {
        header: 'Độ tin cậy',
        cell: ({ getValue }) => {
          const confidence = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getConfidenceColor(confidence)}`}>
              {formatPercent(confidence * 100)}
            </div>
          );
        },
        enableSorting: true,
      }),
      // Volume ratio column
      columnHelper.accessor('volume_ratio', {
        header: 'KL so với TB',
        cell: ({ getValue }) => {
          const ratio = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getVolumeRatioColor(ratio)}`}>
              {ratio ? `${ratio.toFixed(2)}x` : '-'}
            </div>
          );
        },
        enableSorting: true,
      }),
      // Distance from support column
      columnHelper.accessor('distance_from_support_pct', {
        header: 'KC từ hỗ trợ',
        cell: ({ getValue }) => {
          const distance = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getDistanceFromSupportColor(distance)}`}>
              {formatPercent(distance)}
            </div>
          );
        },
        enableSorting: true,
      }),
      // Distance from resistance column
      columnHelper.accessor('distance_from_resistance_pct', {
        header: 'KC từ kháng cự',
        cell: ({ getValue }) => {
          const distance = getValue();
          return (
            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getDistanceFromResistanceColor(distance)}`}>
              {formatPercent(distance)}
            </div>
          );
        },
        enableSorting: true,
      }),
    ];
  }, [columnHelper]);

  // Process data with custom filters before passing to TanStack Table
  const processedData = useMemo(() => {
    if (!enrichedVcpData) return [];
    
    let filtered = enrichedVcpData;

    // Apply confidence filter
    if (confidenceFilter !== 'all') {
      filtered = filtered.filter(signal => {
        const confidence = Number(signal.confidence);
        if (confidenceFilter === 'high') return confidence >= 0.7;
        if (confidenceFilter === 'medium') return confidence >= 0.5 && confidence < 0.7;
        if (confidenceFilter === 'low') return confidence < 0.5;
        return true;
      });
    }

    // Apply recency filter (now using bars_since_pattern_ended)
    if (recencyFilter !== 'all') {
      filtered = filtered.filter(signal => {
        const barsSince = Number(signal.bars_since_pattern_ended);
        if (recencyFilter === 'recent') return barsSince <= 3;
        if (recencyFilter === 'moderate') return barsSince > 3 && barsSince <= 7;
        if (recencyFilter === 'old') return barsSince > 7;
        return true;
      });
    }

    // Apply industry filter
    if (industryFilter.length > 0) {
      filtered = filtered.filter(signal => 
        signal.industry_id && industryFilter.includes(signal.industry_id)
      );
    }

    return filtered;
  }, [enrichedVcpData, confidenceFilter, recencyFilter, industryFilter]);

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
          id: 'contraction_rating',
          desc: true,
        },
      ],
    },
  });


  // Helper functions for colors and formatting
  const getConfidenceColor = (confidence) => {
    const conf = Number(confidence);
    if (conf >= 0.7) return 'text-green-600';
    if (conf >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecencyColor = (barsSince) => {
    const bars = Number(barsSince);
    if (bars <= 3) return 'text-green-600';
    if (bars <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDistanceFromSupportColor = (distance) => {
    const dist = Number(distance);
    if (isNaN(dist)) return 'text-gray-600';
    // Closer to support (smaller positive values) = better = green
    if (dist <= 2) return 'bg-green-100 text-green-800';
    if (dist <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDistanceFromResistanceColor = (distance) => {
    const dist = Number(distance);
    if (isNaN(dist)) return 'text-gray-600';
    // Further from resistance (larger negative values) = better = green
    if (dist <= -5) return 'bg-green-100 text-green-800';
    if (dist <= -2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getVolumeRatioColor = (ratio) => {
    const vol = Number(ratio);
    if (vol >= 1.5) return 'text-green-600';
    if (vol >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatPercent = (val) => {
    const num = Number(val);
    return isNaN(num) ? 'K/C' : `${num.toFixed(1)}%`;
  };

  const formatNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 'K/C' : num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu VCP...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500">{error?.message || error?.toString() || 'Lỗi không xác định'}</p>
        </div>
      </div>
    );
  }

  if (!vcpData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-medium">Không có dữ liệu VCP</div>
          <div className="text-gray-500 mt-2">Vui lòng thử lại sau</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Phân tích Mẫu VCP (Volume Contraction Pattern)
        </h3>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-gray-50 rounded-lg border p-4 flex items-center space-x-4 mb-6">
        <span className="text-sm font-medium text-gray-700">Khung thời gian:</span>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setTimeframe('1D')}
        >
          Hàng ngày (1D)
        </button>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setTimeframe('1W')}
        >
          Hàng tuần (1W)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Tổng tín hiệu</p>
              <p className="text-2xl font-semibold text-blue-900">{summary?.totalSignals || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-yellow-900">{summary?.activePatterns || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Co hẹp mạnh</p>
              <p className="text-2xl font-semibold text-green-900">{summary?.strongContraction || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Tin cậy cao</p>
              <p className="text-2xl font-semibold text-purple-900">{summary?.highConfidenceSignals || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-indigo-600">Độ nén TB</p>
              <p className="text-2xl font-semibold text-indigo-900">{(summary?.averageRating || 0).toFixed(1)}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm cổ phiếu..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Industry Filter */}
        <div className="min-w-[200px]">
          <MultiSelect
            options={availableIndustries.map(industry => ({
              value: industry.id,
              label: industry.name
            }))}
            value={industryFilter}
            onValueChange={setIndustryFilter}
            placeholder="Chọn ngành..."
            className="w-full"
          />
        </div>
        
        {/* Confidence Filter */}
        <select
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="all">Tất cả độ tin cậy</option>
          <option value="high">Cao (≥70%)</option>
          <option value="medium">Trung bình (≥50%)</option>
          <option value="low">Thấp (&lt;50%)</option>
        </select>

        {/* Recency Filter */}
        <select
          value={recencyFilter}
          onChange={(e) => setRecencyFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="all">Tất cả thời gian</option>
          <option value="recent">Gần đây (≤3 ngày)</option>
          <option value="moderate">Trung bình (≤7 ngày)</option>
          <option value="old">Cũ (&gt;7 ngày)</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setGlobalFilter('');
            setConfidenceFilter('all');
            setRecencyFilter('all');
            setIndustryFilter([]);
          }}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Xóa bộ lọc
        </button>
        
        <div className="text-sm text-gray-600">
          {table.getFilteredRowModel().rows.length} / {table.getCoreRowModel().rows.length} tín hiệu
        </div>
      </div>

      {/* VCP Signals Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                  {headerGroup.headers.map(header => {
                    const isLeftAligned = header.id === 'symbol' || header.id === 'industry_name';
                    return (
                      <th
                        key={header.id}
                        className={`px-1 py-1 text-xs font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors ${
                          isLeftAligned ? 'text-left' : 'text-center'
                        }`}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className={`flex items-center gap-1 ${
                          isLeftAligned ? 'justify-start' : 'justify-center'
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
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    Không có tín hiệu VCP nào phù hợp với bộ lọc hiện tại
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map(cell => {
                      const isLeftAligned = cell.column.id === 'symbol' || cell.column.id === 'industry_name';
                      return (
                        <td
                          key={cell.id}
                          className={`px-1 py-1 text-xs ${
                            isLeftAligned ? 'text-left' : 'text-center'
                          }`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
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
            {[25, 50, 100, 200].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            {table.getRowModel().rows.length} / {table.getFilteredRowModel().rows.length} tín hiệu
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Chú thích:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p><strong>Độ tin cậy:</strong></p>
            <ul className="space-y-1 mt-1">
              <li>• <span className="text-green-600">Cao (≥70%):</span> Tín hiệu mạnh, khả năng cao</li>
              <li>• <span className="text-yellow-600">Trung bình (≥50%):</span> Tín hiệu vừa phải</li>
              <li>• <span className="text-red-600">Thấp (&lt;50%):</span> Tín hiệu yếu, cần thận trọng</li>
            </ul>
          </div>
          <div>
            <p><strong>Thời gian:</strong></p>
            <ul className="space-y-1 mt-1">
              <li>• <span className="text-green-600">Gần đây (≤3 ngày):</span> Tín hiệu mới nhất</li>
              <li>• <span className="text-yellow-600">Trung bình (≤7 ngày):</span> Tín hiệu vừa phải</li>
              <li>• <span className="text-red-600">Cũ (&gt;7 ngày):</span> Tín hiệu cũ, cần xem xét lại</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCPAnalysis; 