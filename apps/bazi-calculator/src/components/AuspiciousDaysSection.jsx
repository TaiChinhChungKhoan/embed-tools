import React, { useMemo, useState } from 'react';
import { Card, Button, Label } from '@embed-tools/components';

const MAX_DAYS = 60; // Maximum days allowed for performance reasons

function findAuspiciousDays(startDate, endDate, calculator, timeZone, favorableElements, unfavorableElements) {
    const good = [], bad = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
        const analysisDate = calculator.getAnalysisForDate(currentDate, timeZone, { type: 'personalized' });

        // Try both possible locations for the day pillar
        const dayPillar =
            analysisDate?.detailedPillars?.day ||
            analysisDate?.dayPillar;

        // Try both possible property names for the element
        const stemElement =
            dayPillar?.heavenlyStem?.elementEn ||
            dayPillar?.stemElement; // fallback for top-level dayPillar

        if (!stemElement) {
            console.warn(`No stemElement for date: ${currentDate.toISOString()}`, dayPillar, analysisDate);
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }
        
        if (favorableElements.includes(stemElement)) {
            good.push(new Date(currentDate));
        } else if (unfavorableElements.includes(stemElement)) {
            bad.push(new Date(currentDate));
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { good, bad };
}

const AuspiciousDaysSection = ({
    calculator,
    timeZone,
    favorableElements,
    unfavorableElements,
    daysAhead = 14,
}) => {
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() + daysAhead);
        return today.toISOString().split('T')[0];
    });

    // Calculate the number of days in the selected range
    const daysInRange = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
        return diffDays;
    }, [startDate, endDate]);

    // Check if range is too large
    const isRangeTooLarge = daysInRange > MAX_DAYS;

    // Check if date range is valid (end date should be after start date)
    const isDateRangeValid = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return end >= start;
    }, [startDate, endDate]);

    const { good: auspicious, bad: inauspicious } = useMemo(() => {
        if (!calculator || !timeZone || !favorableElements || !unfavorableElements || isRangeTooLarge || !isDateRangeValid) {
            return { good: [], bad: [] };
        }
        return findAuspiciousDays(
            new Date(startDate),
            new Date(endDate),
            calculator,
            timeZone,
            favorableElements,
            unfavorableElements
        );
    }, [calculator, timeZone, favorableElements, unfavorableElements, startDate, endDate, isRangeTooLarge, isDateRangeValid]);

    const handleQuickRange = (days) => {
        const today = new Date();
        const end = new Date();
        end.setDate(today.getDate() + days);
        
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const formatDateRange = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
    };

    const handleDateChange = (type, value) => {
        if (type === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ngày Cát & Ngày Hung</h2>
                
                {/* Date Range Controls */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Button 
                            onClick={() => handleQuickRange(7)} 
                            variant="outline" 
                            size="sm"
                        >
                            1 Tuần
                        </Button>
                        <Button 
                            onClick={() => handleQuickRange(14)} 
                            variant="outline" 
                            size="sm"
                        >
                            2 Tuần
                        </Button>
                        <Button 
                            onClick={() => handleQuickRange(30)} 
                            variant="outline" 
                            size="sm"
                        >
                            1 Tháng
                        </Button>
                        <Button 
                            onClick={() => handleQuickRange(60)} 
                            variant="outline" 
                            size="sm"
                        >
                            2 Tháng
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate" className="text-sm font-medium">Từ ngày:</Label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate" className="text-sm font-medium">Đến ngày:</Label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Đang xem: <span className="font-medium">{formatDateRange()}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            {daysInRange} ngày
                        </p>
                    </div>

                    {/* Warning for large ranges */}
                    {isRangeTooLarge && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-yellow-800 text-sm">
                                ⚠️ Khoảng thời gian quá lớn ({daysInRange} ngày). Vui lòng chọn tối đa {MAX_DAYS} ngày để đảm bảo hiệu suất.
                            </p>
                        </div>
                    )}

                    {/* Warning for invalid date range */}
                    {!isDateRangeValid && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-800 text-sm">
                                ❌ Ngày kết thúc phải sau ngày bắt đầu. Vui lòng chọn lại khoảng thời gian.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        Ngày Cát ({auspicious.length} ngày)
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {!isDateRangeValid ? (
                            <p className="text-gray-500 text-sm">Vui lòng chọn khoảng thời gian hợp lệ.</p>
                        ) : isRangeTooLarge ? (
                            <p className="text-gray-500 text-sm">Vui lòng giảm khoảng thời gian để xem kết quả.</p>
                        ) : auspicious.length > 0 ? (
                            <ul className="space-y-2">
                                {auspicious.map((d) => (
                                    <li key={d.toISOString()} className="flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                        <span className="text-sm">
                                            {d.toLocaleDateString('vi-VN', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">Không có ngày cát nào trong khoảng thời gian này.</p>
                        )}
                    </div>
                </div>
                
                <div>
                    <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        Ngày Hung ({inauspicious.length} ngày)
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {!isDateRangeValid ? (
                            <p className="text-gray-500 text-sm">Vui lòng chọn khoảng thời gian hợp lệ.</p>
                        ) : isRangeTooLarge ? (
                            <p className="text-gray-500 text-sm">Vui lòng giảm khoảng thời gian để xem kết quả.</p>
                        ) : inauspicious.length > 0 ? (
                            <ul className="space-y-2">
                                {inauspicious.map((d) => (
                                    <li key={d.toISOString()} className="flex items-center">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                                        <span className="text-sm">
                                            {d.toLocaleDateString('vi-VN', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">Không có ngày hung nào trong khoảng thời gian này.</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AuspiciousDaysSection; 