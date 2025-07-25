import { Card, Button } from '@embed-tools/components';
import { getBrowserLocale } from '../utils/locale';
import PillarSection from './PillarSection';
import DayMasterSection from './DayMasterSection';
import InvestmentSuggestionSection from './InvestmentSuggestionSection';
import LuckPillarsSection from './LuckPillarsSection';
import AnnualAnalysisSection from './AnnualAnalysisSection';
import FavorablePeriodsSection from './FavorablePeriodsSection';
import FiveElementChart from './FiveElementChart';
import SymbolicStarsSection from './SymbolicStarsSection';
import EightMansionsSection from './EightMansionsSection';
import LifestyleSuggestionsSection from './LifestyleSuggestionsSection';
import AuspiciousDaysSection from './AuspiciousDaysSection';

const Results = ({ data, onOpenModal, calculator, timeZone }) => {
  if (!data) return null;

  // Format birth date and time for display using browser locale
  const formatDateTime = (birthDateTime) => {
    if (!birthDateTime) return 'N/A';
    const date = new Date(birthDateTime);
    return date.toLocaleString(getBrowserLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Export function to download results as JSON
  const exportResults = () => {
    // Convert UTC time back to local timezone for display using browser locale
    const localDateTime = data.birthDateTime ? 
      new Date(data.birthDateTime).toLocaleString(getBrowserLocale(), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: data.timeZone
      }) : 'N/A';

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        source: 'Bazi Calculator App'
      },
      inputData: {
        birthDateTimeUTC: data.birthDateTime, // UTC time (for calculations)
        birthDateTimeLocal: localDateTime, // Local time in user's timezone
        birthYear: data.birthYear,
        gender: data.gender,
        timeZone: data.timeZone,
        isTimeKnown: data.isTimeKnown,
        originalInputs: {
          date: data.originalBirthDate || 'N/A',
          time: data.originalBirthTime || 'N/A',
          timeZone: data.timeZone
        }
      },
      results: {
        ...data,
        birthDateTimeUTC: data.birthDateTime, // UTC time (for calculations)
        birthDateTimeLocal: localDateTime // Local time in user's timezone
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bazi-analysis-${data.birthYear}-${data.gender}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 mt-8">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Kết Quả Phân Tích Bát Tự
          </h1>
          <Button 
            onClick={exportResults}
            className="px-8"
            size="sm"
          >
            Xuất Kết Quả
          </Button>
        </div>
        
        {/* Input Information Display */}
        <div className="bg-white p-4 rounded-lg border border-blue-100 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông Tin Đầu Vào:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Ngày giờ sinh:</span>
              <span className="ml-2 text-gray-600">{formatDateTime(data.birthDateTime)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Giới tính:</span>
              <span className="ml-2 text-gray-600">{data.gender === 'male' ? 'Nam' : 'Nữ'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Múi giờ:</span>
              <span className="ml-2 text-gray-600">{data.timeZone || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Biết giờ sinh:</span>
              <span className="ml-2 text-gray-600">{data.isTimeKnown ? 'Có' : 'Không'}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Auspicious Days Section - moved up right after main header */}
      {calculator && (
        <AuspiciousDaysSection
          calculator={calculator}
          timeZone={timeZone}
          favorableElements={data.favorableElements}
          unfavorableElements={['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'].filter(e => !data.favorableElements.includes(e))}
          daysAhead={14}
        />
      )}

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
        unfavorableElements={data.unfavorableElements}
        unfavorableIndustries={data.unfavorableIndustries}
        onOpenModal={onOpenModal} 
      />

      {/* Supplementary Analysis */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Phân Tích Bổ Sung</h2>
        </div>
        <div className="space-y-6">
          {data.fiveFactors && <FiveElementChart fiveFactors={data.fiveFactors} onOpenModal={onOpenModal} />}
          {data.symbolicStars && <SymbolicStarsSection stars={data.symbolicStars} />}
          {data.eightMansions && <EightMansionsSection mansions={data.eightMansions} onOpenModal={onOpenModal} />}
          <LifestyleSuggestionsSection 
            favorableElements={data.favorableElements} 
            unfavorableElements={data.unfavorableElements} 
            onOpenModal={onOpenModal} 
          />
        </div>
      </Card>
    </div>
  );
};

export default Results; 