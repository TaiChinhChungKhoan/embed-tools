import React, { useState } from 'react';
import { Info, X, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';

const SignalInterpretationGuide = ({ variant = 'stock' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const signals = [
        {
            key: 'widespread',
            name: 'WIDESPREAD SIGNAL',
            definition: 'Khoảng giá (High - Low) rộng hơn đáng kể so với bình thường',
            interpretations: [
                {
                    type: 'BULLISH',
                    description: 'Khoảng giá rộng với giá đóng cửa gần mức cao nhất cho thấy áp lực mua mạnh',
                    action: 'Theo dõi xu hướng tăng tiếp theo'
                },
                {
                    type: 'BEARISH', 
                    description: 'Khoảng giá rộng với giá đóng cửa gần mức thấp nhất cho thấy áp lực bán mạnh',
                    action: 'Theo dõi xu hướng giảm tiếp theo'
                },
                {
                    type: 'NEUTRAL',
                    description: 'Khoảng giá rộng với giá đóng cửa ở giữa cho thấy sự do dự/biến động',
                    action: 'Chờ tín hiệu rõ ràng hơn'
                }
            ]
        },
        {
            key: 'narrowspread',
            name: 'NARROWSPREAD SIGNAL',
            definition: 'Khoảng giá (High - Low) hẹp hơn đáng kể so với bình thường',
            interpretations: [
                {
                    type: 'BULLISH',
                    description: 'Khoảng giá hẹp với khối lượng cao cho thấy tích lũy/mua có kiểm soát',
                    action: 'Tìm hướng breakout khi khoảng giá mở rộng'
                },
                {
                    type: 'BEARISH',
                    description: 'Khoảng giá hẹp với khối lượng thấp cho thấy phân phối/bán có kiểm soát',
                    action: 'Chờ tín hiệu breakout'
                },
                {
                    type: 'NEUTRAL',
                    description: 'Khoảng giá hẹp với khối lượng trung bình cho thấy củng cố',
                    action: 'Theo dõi xu hướng tiếp theo'
                }
            ]
        },
        {
            key: 'highvolume',
            name: 'HIGHVOLUME SIGNAL',
            definition: 'Khối lượng giao dịch cao hơn đáng kể so với trung bình động',
            interpretations: [
                {
                    type: 'BULLISH',
                    description: 'Khối lượng cao với giá tăng cho thấy sự quan tâm mua mạnh',
                    action: 'Khối lượng xác nhận xu hướng giá; theo dõi xu hướng'
                },
                {
                    type: 'BEARISH',
                    description: 'Khối lượng cao với giá giảm cho thấy áp lực bán mạnh',
                    action: 'Theo dõi xu hướng giảm'
                },
                {
                    type: 'NEUTRAL',
                    description: 'Khối lượng cao với giá đi ngang cho thấy phân phối/tích lũy',
                    action: 'Chờ tín hiệu breakout'
                }
            ]
        },
        {
            key: 'lowvolume',
            name: 'LOWVOLUME SIGNAL',
            definition: 'Khối lượng giao dịch thấp hơn đáng kể so với trung bình động',
            interpretations: [
                {
                    type: 'BULLISH',
                    description: 'Pullback với khối lượng thấp cho thấy áp lực bán yếu',
                    action: 'Chờ xác nhận khối lượng'
                },
                {
                    type: 'BEARISH',
                    description: 'Rally với khối lượng thấp cho thấy sự quan tâm mua yếu',
                    action: 'Chờ xác nhận khối lượng'
                },
                {
                    type: 'NEUTRAL',
                    description: 'Đi ngang với khối lượng thấp cho thấy thiếu niềm tin',
                    action: 'Chờ tín hiệu rõ ràng hơn'
                }
            ]
        },
        {
            key: 'effortgtresult',
            name: 'EFFORTGTRESULT SIGNAL',
            definition: 'Khối lượng cao với khoảng giá hẹp (nỗ lực cao, kết quả thấp)',
            interpretations: [
                {
                    type: 'BULLISH',
                    description: 'Nỗ lực mua mạnh với biến động giá có kiểm soát cho thấy tích lũy',
                    action: 'Thường đi trước các động thái quan trọng; theo dõi hướng breakout'
                },
                {
                    type: 'BEARISH',
                    description: 'Nỗ lực bán mạnh với biến động giá có kiểm soát cho thấy phân phối',
                    action: 'Theo dõi hướng breakout'
                }
            ]
        },
        {
            key: 'resultgteffort',
            name: 'RESULTGTEFFORT SIGNAL',
            definition: 'Khối lượng thấp với khoảng giá rộng (nỗ lực thấp, kết quả cao)',
            interpretations: [
                {
                    type: 'BULLISH',
                    description: 'Biến động giá lớn với khối lượng thấp cho thấy bán yếu cho tay mạnh',
                    action: 'Có thể chỉ ra sự kiệt sức; thận trọng với sự tiếp tục'
                },
                {
                    type: 'BEARISH',
                    description: 'Biến động giá lớn với khối lượng thấp cho thấy short covering hoặc mua yếu',
                    action: 'Thận trọng với xu hướng tiếp theo'
                }
            ]
        },
        {
            key: 'abnormalerratio',
            name: 'ABNORMALERRATIO SIGNAL',
            definition: 'Tỷ lệ khối lượng-trên-lợi nhuận dư thừa khác biệt đáng kể so với bình thường',
            interpretations: [
                {
                    type: 'HIGH RATIO',
                    description: 'Khối lượng cao so với biến động giá cho thấy niềm tin mạnh',
                    action: 'Sử dụng để xác nhận sức mạnh xu hướng'
                },
                {
                    type: 'LOW RATIO',
                    description: 'Khối lượng thấp so với biến động giá cho thấy niềm tin yếu',
                    action: 'Sử dụng để xác nhận điểm yếu xu hướng'
                }
            ]
        }
    ];

    const combinedSignals = [
        {
            type: 'MULTIPLE BULLISH SIGNALS',
            description: 'Tín hiệu mua mạnh, xác suất cao cho chuyển động tăng',
            action: 'Có thể mua với xác suất cao'
        },
        {
            type: 'MULTIPLE BEARISH SIGNALS',
            description: 'Tín hiệu bán mạnh, xác suất cao cho chuyển động giảm',
            action: 'Có thể bán hoặc short với xác suất cao'
        },
        {
            type: 'MIXED SIGNALS',
            description: 'Thị trường do dự, chờ hướng rõ ràng hơn',
            action: 'Chờ tín hiệu rõ ràng hơn trước khi hành động'
        },
        {
            type: 'NO SIGNALS',
            description: 'Điều kiện thị trường bình thường',
            action: 'Tiếp tục với chiến lược hiện tại'
        }
    ];

    const performanceMetrics = [
        {
            name: 'Top Gainers/Losers',
            description: 'Xếp hạng hiệu suất 1 ngày',
            usage: 'Sử dụng để xác định momentum và thay đổi xu hướng'
        },
        {
            name: 'Top Improving/Degrading',
            description: 'Cải thiện hiệu suất so với giai đoạn trước',
            usage: 'Sử dụng để xác định thay đổi xu hướng'
        },
        {
            name: 'Immediate Returns',
            description: 'Chuyển động giá gần nhất',
            usage: 'Sử dụng để xác định momentum ngắn hạn'
        }
    ];

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
            >
                <Info className="h-4 w-4" />
                <span className="font-medium">
                    Hướng dẫn giải thích tín hiệu bất thường
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isOpen && (
                <div className="mt-4 space-y-6">
                    {/* Individual Signals */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Giải thích từng loại tín hiệu
                        </h3>
                        {signals.map((signal) => (
                            <Card key={signal.key} className="p-4">
                                <button
                                    onClick={() => toggleSection(signal.key)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                        {signal.name}
                                    </h4>
                                    {expandedSections[signal.key] ? 
                                        <ChevronUp className="h-4 w-4" /> : 
                                        <ChevronDown className="h-4 w-4" />
                                    }
                                </button>
                                
                                {expandedSections[signal.key] && (
                                    <div className="mt-3 space-y-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <strong>Định nghĩa:</strong> {signal.definition}
                                        </p>
                                        
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Giải thích:
                                            </p>
                                            {signal.interpretations.map((interpretation, index) => (
                                                <div key={index} className="ml-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            interpretation.type === 'BULLISH' || interpretation.type === 'HIGH RATIO'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                : interpretation.type === 'BEARISH' || interpretation.type === 'LOW RATIO'
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                                                        }`}>
                                                            {interpretation.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                        {interpretation.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        <strong>Hành động:</strong> {interpretation.action}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Combined Signals */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Giải thích tín hiệu kết hợp
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {combinedSignals.map((signal, index) => (
                                <Card key={index} className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {signal.type}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {signal.description}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        <strong>Hành động:</strong> {signal.action}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Chỉ số hiệu suất
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            {performanceMetrics.map((metric, index) => (
                                <Card key={index} className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {metric.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {metric.description}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {metric.usage}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Industry Specific */}
                    {variant === 'industry' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Giải thích tín hiệu ngành nghề
                            </h3>
                            <Card className="p-4">
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>• Tín hiệu ngành nghề tuân theo cùng cách giải thích như tín hiệu cổ phiếu</li>
                                    <li>• Tín hiệu toàn ngành có thể chỉ ra cơ hội luân chuyển ngành</li>
                                    <li>• Nhiều ngành thể hiện tín hiệu tương tự có thể chỉ ra xu hướng thị trường rộng hơn</li>
                                    <li>• Tín hiệu ngành có thể được sử dụng cho quyết định phân bổ ngành</li>
                                </ul>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignalInterpretationGuide; 