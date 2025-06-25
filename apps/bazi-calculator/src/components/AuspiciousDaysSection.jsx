import React, { useMemo } from 'react';
import { Card } from '@embed-tools/components';

function findAuspiciousDays(startDate, daysAhead, calculator, timeZone, favorableElements, unfavorableElements) {
    const good = [], bad = [];
    for (let i = 1; i <= daysAhead; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const analysisDate = calculator.getAnalysisForDate(d, timeZone, { type: 'personalized' });

        // Try both possible locations for the day pillar
        const dayPillar =
            analysisDate?.detailedPillars?.day ||
            analysisDate?.dayPillar;

        // Try both possible property names for the element
        const stemElement =
            dayPillar?.heavenlyStem?.elementEn ||
            dayPillar?.stemElement; // fallback for top-level dayPillar

        if (!stemElement) {
            console.warn(`No stemElement for date: ${d.toISOString()}`, dayPillar, analysisDate);
            continue;
        }
        if (favorableElements.includes(stemElement)) {
            good.push(new Date(d));
        } else if (unfavorableElements.includes(stemElement)) {
            bad.push(new Date(d));
        }
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
    const { good: auspicious, bad: inauspicious } = useMemo(() => {
        if (!calculator || !timeZone || !favorableElements || !unfavorableElements)
            return { good: [], bad: [] };
        return findAuspiciousDays(
            new Date(),
            daysAhead,
            calculator,
            timeZone,
            favorableElements,
            unfavorableElements
        );
    }, [calculator, timeZone, favorableElements, unfavorableElements, daysAhead]);

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
                <h3 className="font-semibold text-green-700 mb-2">
                    Danh sách Ngày Cát (2 tuần tới)
                </h3>
                <ul className="list-disc ml-5">
                    {auspicious.length > 0 ? (
                        auspicious.map((d) => (
                            <li key={d.toISOString()}>{d.toLocaleDateString('vi-VN')}</li>
                        ))
                    ) : (
                        <li>Không có ngày cát nào trong 2 tuần tới.</li>
                    )}
                </ul>
            </Card>
            <Card className="p-6">
                <h3 className="font-semibold text-red-700 mb-2">
                    Danh sách Ngày Hung (2 tuần tới)
                </h3>
                <ul className="list-disc ml-5">
                    {inauspicious.length > 0 ? (
                        inauspicious.map((d) => (
                            <li key={d.toISOString()}>{d.toLocaleDateString('vi-VN')}</li>
                        ))
                    ) : (
                        <li>Không có ngày hung nào trong 2 tuần tới.</li>
                    )}
                </ul>
            </Card>
        </div>
    );
};

export default AuspiciousDaysSection; 