import React from 'react';
import { learningPath, absorptionPairsByZone, specialPatterns, tradingPlan, traderMindset } from '../data/vsaData';
import { CheckCircle, ClipboardList, Shield } from './Icons';

const PairedPatternCard = ({ pattern, type }) => {
    if (!pattern) {
        return <div className="border border-dashed border-gray-700 rounded-lg min-h-full"></div>;
    }
    const isBullish = type === 'supply';
    return (
        <div className={`border-2 ${isBullish ? 'border-emerald-500/50' : 'border-red-500/50'} bg-gray-800/20 rounded-lg p-4 flex flex-col h-full`}>
            <div className="flex-grow">
                 <h4 className={`font-bold text-lg ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>{pattern.title}</h4>
                <div className="mt-3 space-y-2 text-gray-300 text-sm">
                    <div><strong className="font-semibold text-white w-20 inline-block">Spread:</strong> {pattern.analysis.spread}</div>
                    <div><strong className="font-semibold text-white w-20 inline-block">Volume:</strong> {pattern.analysis.volume}</div>
                    <div><strong className="font-semibold text-white w-20 inline-block">Close:</strong> {pattern.analysis.close}</div>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-600/50">
                 <p className={`font-semibold text-center text-lg ${isBullish ? 'text-emerald-300' : 'text-red-300'}`}>{pattern.result}</p>
            </div>
        </div>
    );
}

const AbsorptionZoneSection = ({ zone, description, pairs }) => {
    return (
        <div>
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">{zone}</h3>
                <p className="text-gray-400 mt-1">{description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                 <h4 className="text-xl font-semibold text-emerald-400 text-center md:mb-2">Tín hiệu Hấp thụ CUNG (Tích cực)</h4>
                 <h4 className="text-xl font-semibold text-red-400 text-center md:mb-2">Tín hiệu Hấp thụ CẦU (Tiêu cực)</h4>
                 {pairs.map((pair, index) => (
                    <React.Fragment key={index}>
                       <PairedPatternCard pattern={pair.supply} type="supply" />
                       <PairedPatternCard pattern={pair.demand} type="demand" />
                    </React.Fragment>
                 ))}
            </div>
        </div>
    )
}

const LearningPage = () => {
    return (
        <div className="animate-fade-in space-y-12">
            <div>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">{learningPath[0].title}</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-400">{learningPath[0].description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {learningPath[0].concepts.map(c => (
                        <div key={c.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:border-r border-gray-700 pr-4 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-cyan-400">{c.title}</h3>
                                    <p className="mt-3 text-gray-300">{c.content}</p>
                                </div>
                                <div className="flex items-center justify-center min-h-[120px]">
                                    {c.illustration}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">So sánh các Mẫu Hình Hấp Thụ</h2>
                </div>
                {absorptionPairsByZone.map(zoneData => <AbsorptionZoneSection key={zoneData.zone} {...zoneData} />)}
            </div>
             {/* Special Patterns Section */}
            <div>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Các Mẫu Hình VSA Đặc Biệt</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {specialPatterns.map(pattern => (
                        <div key={pattern.title} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">{pattern.title}</h3>
                            <p className="text-gray-300 italic mb-4">"{pattern.meaning}"</p>
                            <ul className="space-y-2 list-none pl-0">
                                {pattern.characteristics.map((char, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-400 leading-relaxed">{char}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">{tradingPlan.title}</h2>
                    </div>
                    <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-8 space-y-6">
                        {tradingPlan.steps.map(step => (
                            <div key={step.title} className="flex items-start space-x-4">
                                <ClipboardList className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-xl font-bold text-white">{step.title}</h4>
                                    <p className="mt-1 text-gray-300">{step.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">{traderMindset.title}</h2>
                    </div>
                    <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-8 space-y-6">
                        {traderMindset.points.map(point => (
                            <div key={point.title} className="flex items-start space-x-4">
                                <Shield className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-xl font-bold text-white">{point.title}</h4>
                                    <p className="mt-1 text-gray-300">{point.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPage; 