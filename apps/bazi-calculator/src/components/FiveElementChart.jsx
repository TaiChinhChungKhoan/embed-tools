import { TRANSLATIONS } from '../data/constants';
import InfoButton from './InfoButton';
import { EXPLANATIONS } from '../data/explanations';

const FiveElementChart = ({ fiveFactors, onOpenModal }) => {
  if (!fiveFactors) return null;

  const totalScore = Object.values(fiveFactors).reduce((sum, v) => sum + v, 0);
  const elements = Object.entries(fiveFactors).map(([key, score]) => ({
    name: TRANSLATIONS.elements[key],
    score,
    percentage: totalScore > 0 ? (score / totalScore) * 100 : 0
  }));
  const strongest = elements.reduce((max, el) => el.score > max.score ? el : max, { score: -Infinity });
  const weakest = elements.reduce((min, el) => el.score < min.score ? el : min, { score: Infinity });

  const getElementColor = (elementName) => {
    const colorMap = {
      'Mộc': 'bg-green-500',
      'Hỏa': 'bg-red-500',
      'Thổ': 'bg-yellow-500',
      'Kim': 'bg-blue-500',
      'Thủy': 'bg-gray-500'
    };
    return colorMap[elementName] || 'bg-gray-500';
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Phân Bổ Ngũ Hành</h3>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Phân Bổ Ngũ Hành', EXPLANATIONS.PHAN_BO_NGU_HANH)} />
      </div>
      <div className="space-y-3">
        {elements.map(el => (
          <div key={el.name} className="flex items-center">
            <span className="w-16 font-medium text-sm">{el.name}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-5 mx-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getElementColor(el.name)}`}
                style={{ width: `${el.percentage}%` }}
              ></div>
            </div>
            <span className="w-12 text-right font-semibold text-sm">{el.score}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-center mt-3 text-gray-600">
        <strong>Vượng nhất:</strong> {strongest.name} | <strong>Suy nhất:</strong> {weakest.name}
      </div>
    </div>
  );
};

export default FiveElementChart; 