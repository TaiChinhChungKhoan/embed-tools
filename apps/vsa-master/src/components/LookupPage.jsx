import React, { useState, useMemo } from 'react';
import { vsaPatternsDatabase } from '../data/vsaData';

const LookupPage = () => {
    const [filters, setFilters] = useState({
        zone: 'any',
        bar_type: 'any',
        spread: 'any',
        close_pos: 'any',
        volume: 'any'
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const filterOptions = {
        zone: [{value: 'any', label: 'Bất kỳ'}, {value: 'supply', label: 'Vùng Cung'}, {value: 'demand', label: 'Vùng Cầu'}],
        bar_type: [{value: 'any', label: 'Bất kỳ'}, {value: 'up', label: 'Upbar'}, {value: 'down', label: 'Downbar'}],
        spread: [{value: 'any', label: 'Bất kỳ'}, {value: 'narrow', label: 'Hẹp'}, {value: 'medium', label: 'Trung bình'}, {value: 'wide', label: 'Rộng'}],
        close_pos: [{value: 'any', label: 'Bất kỳ'}, {value: 'very_high', label: 'Rất cao'}, {value: 'high', label: 'Trên 1/2'}, {value: 'mid', label: 'Giữa'}, {value: 'low', label: 'Dưới 1/2'}, {value: 'very_low', label: 'Rất thấp'}],
        volume: [{value: 'any', label: 'Bất kỳ'}, {value: 'very_low', label: 'Rất thấp'}, {value: 'low', label: 'Thấp'}, {value: 'medium', label: 'Trung bình'}, {value: 'high', label: 'Cao'}, {value: 'very_high', label: 'Rất cao'}]
    };
    
    // This is the new, smarter matching logic
    const analysisResult = useMemo(() => {
        if (Object.values(filters).every(v => v === 'any')) {
            return { matched: [], generic: null };
        }

        const scorePattern = (pattern) => {
            let score = 0;
            const weights = { zone: 5, bar_type: 3, spread: 2, close_pos: 4, volume: 4 };

            // Critical rule: Effort vs Result
            const high_effort = ['high', 'very_high'].includes(filters.volume) || filters.spread === 'wide';
            const poor_result_up = ['low', 'very_low'].includes(filters.close_pos);
            const poor_result_down = ['high', 'very_high'].includes(filters.close_pos);

            // Penalize contradictions
            if(filters.bar_type === 'up' && high_effort && poor_result_up) {
                 if(pattern.title.toLowerCase().includes('breakout')) return 0; // Contradiction, disqualify
                 if(pattern.title.toLowerCase().includes('phân phối') || pattern.title.toLowerCase().includes('upthrust') || pattern.title.toLowerCase().includes('climax')) score += 5; // Reward
            }
             if(filters.bar_type === 'down' && high_effort && poor_result_down) {
                 if(pattern.title.toLowerCase().includes('hấp thụ cung')) return 0; // Contradiction, disqualify
                 if(pattern.title.toLowerCase().includes('tiếp diễn')) score += 5; // Reward
            }
            
            // Match zone
            if (filters.zone !== 'any') {
                if (pattern.tags.zone === filters.zone) score += weights.zone;
                else return 0; 
            }
            
            // Match other tags
            const checkMatch = (key) => {
                 if (filters[key] !== 'any' && pattern.tags[key] !== 'any') {
                    if (pattern.tags[key].includes(filters[key])) score += weights[key];
                 }
            }

            checkMatch('bar_type');
            checkMatch('spread');
            checkMatch('close_pos');
            checkMatch('volume');
            
            return score;
        };

        const scoredPatterns = vsaPatternsDatabase
            .map(p => ({ ...p, score: scorePattern(p) }))
            .filter(p => p.score > 0)
            .sort((a, b) => b.score - a.score);

        if (scoredPatterns.length > 0 && scoredPatterns[0].score > 6) {
            return { matched: scoredPatterns.slice(0, 2), generic: null };
        }
        
        // --- Generic Interpretation Logic ---
        const getDesc = (obj, key) => obj.find(o => o.value === key)?.label || '';
        
        let interpretation = '';
        const zonePart = filters.zone !== 'any' ? `Tại **${getDesc(filterOptions.zone, filters.zone)}**` : '';
        if (zonePart) interpretation += zonePart;
        
        let actionPart = '';
        if (filters.bar_type !== 'any') {
            actionPart = `một nỗ lực **${filters.bar_type === 'up' ? 'tăng giá (Up-bar)' : 'giảm giá (Down-bar)'}**`;
        }

        let detailParts = [];
        if (filters.spread !== 'any') {
            detailParts.push(`Spread **${getDesc(filterOptions.spread, filters.spread).toLowerCase()}**`);
        }
        if (filters.volume !== 'any') {
            detailParts.push(`Volume **${getDesc(filterOptions.volume, filters.volume).toLowerCase()}**`);
        }

        if(detailParts.length > 0) {
            actionPart += ` với ${detailParts.join(' và ')}`;
        }

        if(actionPart){
            if(interpretation) {
                 interpretation += `, ${actionPart}`;
            } else {
                 actionPart = actionPart.charAt(0).toUpperCase() + actionPart.slice(1);
                 interpretation += actionPart;
            }
        }
        
        let conclusionPart = '';
        if (filters.close_pos !== 'any') {
            const closeDesc = getDesc(filterOptions.close_pos, filters.close_pos).toLowerCase();
            if (['rất cao', 'trên 1/2'].includes(closeDesc)) conclusionPart = `cho thấy **phe mua đang chiếm ưu thế** cuối phiên`;
            else if (['rất thấp', 'dưới 1/2'].includes(closeDesc)) conclusionPart = `cho thấy **phe bán đã can thiệp mạnh** và chiếm ưu thế cuối phiên`;
            else conclusionPart = `cho thấy **sự giằng co** giữa hai bên`;
            
            if(interpretation) {
                interpretation += `, ${conclusionPart}`;
            } else {
                conclusionPart = conclusionPart.charAt(0).toUpperCase() + conclusionPart.slice(1);
                interpretation += conclusionPart;
            }
        }
        
        const genericInterpretation = interpretation ? interpretation.trim() + '.' : null;

        return { matched: [], generic: genericInterpretation };

    }, [filters]);
    
    const FilterSelect = ({ name, label, value, onChange }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-400">{label}</label>
            <select
                id={name} name={name} value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-800 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md cursor-pointer"
            >
                {filterOptions[name].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white text-center">Công Cụ Phân Tích Thanh Bar</h2>
            <p className="text-center text-gray-400 mt-2 max-w-2xl mx-auto">Chọn các đặc điểm của thanh bar bạn muốn phân tích để nhận diễn giải.</p>

            <div className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.keys(filters).map((key, i) => (
                        <FilterSelect key={key} name={key} label={`${i + 1}. ${key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`} value={filters[key]} onChange={handleFilterChange} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                 <h3 className="text-xl font-semibold text-white">Kết quả phân tích:</h3>
                 <div className="mt-4">
                    {analysisResult.matched.length > 0 ? (
                        <>
                         <p className="text-sm text-gray-400 mb-4">Dưới đây là các mẫu hình kinh điển phù hợp nhất với lựa chọn của bạn:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {analysisResult.matched.map(p => (
                                <div key={p.title} className={`p-6 rounded-lg border-2 ${p.interpretation.includes('TĂNG') || p.interpretation.includes('mua') ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                                    <h4 className={`text-xl font-bold ${p.interpretation.includes('TĂNG') || p.interpretation.includes('mua') ? 'text-emerald-300' : 'text-red-300'}`}>{p.title}</h4>
                                    <p className="mt-2 text-gray-300">{p.interpretation}</p>
                                </div>
                            ))}
                        </div>
                        </>
                    ) : analysisResult.generic ? (
                        <div className="text-center py-8 text-gray-300 bg-gray-800/30 rounded-lg px-6">
                             <h4 className="text-lg font-semibold text-cyan-400">Diễn giải theo Nguyên tắc VSA</h4>
                             <p className="mt-2" dangerouslySetInnerHTML={{ __html: analysisResult.generic.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-cyan-300">$1</strong>') }} />
                        </div>
                    ) : (
                         <div className="text-center py-12 text-gray-500 bg-gray-800/30 rounded-lg">
                            <p className="text-lg">Vui lòng chọn các tiêu chí để bắt đầu phân tích.</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default LookupPage; 