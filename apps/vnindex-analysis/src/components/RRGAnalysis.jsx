import React, { useState } from 'react';
import RRGChart from './RRGChart';
import { loadRRGData } from '../utils/rrgDataLoader';

export default function RRGAnalysis() {
  const [activeTab, setActiveTab] = useState('industries');
  const rrgData = loadRRGData();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đồ thị Xoay Tương đối (RRG)
        </h2>
        <p className="text-gray-600 mb-4">
          Phân tích sức mạnh tương đối và động lượng của các ngành và cổ phiếu so với VN-Index.
        </p>
        
        {/* Data Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Ngày phân tích</div>
            <div className="text-gray-900">{new Date(rrgData.rrgDate).toLocaleDateString()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Độ dài vệt</div>
            <div className="text-gray-900">{rrgData.tailLength} days</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Tổng số chuỗi</div>
            <div className="text-gray-900">{rrgData.industries.length + rrgData.tickers.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('industries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === 'industries'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ngành nghề ({rrgData.industries.length})
            </button>
            <button
              onClick={() => setActiveTab('tickers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === 'tickers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cổ phiếu ({rrgData.tickers.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'industries' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG ngành nghề</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các ngành. Ngành ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
                </p>
              </div>
              <RRGChart type="industries" />
            </div>
          )}

          {activeTab === 'tickers' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG cổ phiếu</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các cổ phiếu. Sử dụng bộ lọc ngành để tập trung vào các nhóm cụ thể và giảm nhiễu.
                </p>
              </div>
              <RRGChart type="tickers" />
            </div>
          )}
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn đọc RRG</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Các góc phần tư</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium text-green-600">Dẫn đầu:</span> Vượt trội với động lượng tích cực</li>
              <li><span className="font-medium text-yellow-600">Suy yếu:</span> Vượt trội nhưng động lượng giảm</li>
              <li><span className="font-medium text-red-600">Tụt hậu:</span> Kém hiệu quả với động lượng tiêu cực</li>
              <li><span className="font-medium text-blue-600">Cải thiện:</span> Kém hiệu quả nhưng động lượng tăng</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Chỉ số</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium">Tỷ số RS:</span> Sức mạnh tương đối hiện tại so với VN-Index</li>
              <li><span className="font-medium">CRS:</span> Sức mạnh tương đối tích lũy (chuẩn hóa về 100)</li>
              <li><span className="font-medium">Vệt:</span> Đường đi lịch sử thể hiện sự xoay chuyển theo thời gian</li>
              <li><span className="font-medium">Màu sắc:</span> Dựa trên thời lượng dữ liệu (xanh = ngắn, đỏ = dài)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 