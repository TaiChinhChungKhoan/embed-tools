import { Card } from '@embed-tools/components';
import PillarSection from './PillarSection';
import DayMasterSection from './DayMasterSection';
import InvestmentSuggestionSection from './InvestmentSuggestionSection';
import LuckPillarsSection from './LuckPillarsSection';
import AnnualAnalysisSection from './AnnualAnalysisSection';
import FavorablePeriodsSection from './FavorablePeriodsSection';
import FiveElementChart from './FiveElementChart';
import SymbolicStarsSection from './SymbolicStarsSection';
import EightMansionsSection from './EightMansionsSection';

const Results = ({ data, onOpenModal }) => {
  if (!data) return null;

  return (
    <div className="space-y-6 mt-8">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kết Quả Phân Tích Bát Tự
        </h1>
        <p className="text-gray-600">
          Sinh năm {data.birthYear} - {data.gender === 'male' ? 'Nam' : 'Nữ'}
        </p>
      </Card>

      <PillarSection pillars={data.pillars} onOpenModal={onOpenModal} />
      
      <DayMasterSection 
        dayMaster={data.dayMaster} 
        strength={data.strength} 
        dayMasterStrengthDetails={data.dayMasterStrengthDetails}
        onOpenModal={onOpenModal} 
      />
      
      {data.luckPillars && (
        <LuckPillarsSection 
          luckPillars={data.luckPillars} 
          birthYear={data.birthYear} 
          onOpenModal={onOpenModal} 
        />
      )}
      
      {data.annualAnalysis && (
        <AnnualAnalysisSection annualAnalysis={data.annualAnalysis} />
      )}
      
      {data.luckPeriodsData && (
        <FavorablePeriodsSection periods={data.luckPeriodsData} onOpenModal={onOpenModal} />
      )}

      <InvestmentSuggestionSection 
        favorableElements={data.favorableElements} 
        industries={data.industries} 
        onOpenModal={onOpenModal} 
      />

      {/* Supplementary Analysis */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Phân Tích Bổ Sung</h2>
        </div>
        <div className="space-y-6">
          {data.fiveFactors && <FiveElementChart fiveFactors={data.fiveFactors} />}
          {data.symbolicStars && <SymbolicStarsSection stars={data.symbolicStars} />}
          {data.eightMansions && <EightMansionsSection mansions={data.eightMansions} onOpenModal={onOpenModal} />}
        </div>
      </Card>
    </div>
  );
};

export default Results; 