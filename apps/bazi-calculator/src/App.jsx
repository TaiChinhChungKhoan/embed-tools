import React, { useState } from 'react';
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind';
import { toDate } from 'date-fns-tz';
import { Card, Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@embed-tools/components';
import { TRANSLATIONS, WUXING_RELATIONS, INDUSTRY_MAP } from './data/constants';
import Results from './components/Results';
import Modal from './components/Modal';
import DatePickerComponent from './components/DatePicker';
import TimePickerComponent from './components/TimePicker';
import TimeZonePicker from './components/TimeZonePicker';
import ReferenceSection from './components/ReferenceSection';
import AuspiciousDaysSection from './components/AuspiciousDaysSection';

function App() {
  const [birthDate, setBirthDate] = useState(new Date('1990-05-15'));
  const [birthTime, setBirthTime] = useState('12:30');
  const [gender, setGender] = useState('male');
  const [timeZone, setTimeZone] = useState('Asia/Ho_Chi_Minh');
  const [isTimeKnown, setIsTimeKnown] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showReference, setShowReference] = useState(false);

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCalculate = () => {
    setError('');
    setIsLoading(true);

    if (!birthDate) {
      setError('Vui lòng nhập ngày sinh.');
      setIsLoading(false);
      return;
    }
    if (isTimeKnown && !birthTime) {
      setError('Vui lòng nhập giờ sinh hoặc bỏ tick "Biết giờ sinh".');
      setIsLoading(false);
      return;
    }

    try {
      const yyyy = birthDate.getFullYear();
      const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
      const dd = String(birthDate.getDate()).padStart(2, '0');
      const birthDateStr = `${yyyy}-${mm}-${dd}`;
      const birthDateTime = isTimeKnown ?
        toDate(`${birthDateStr}T${birthTime}`, { timeZone }) :
        toDate(birthDateStr, { timeZone });
      const calculator = new BaziCalculator(birthDateTime, gender, timeZone, isTimeKnown);

      const analysis = calculator.getCompleteAnalysis();
      if (!analysis || !analysis.basicAnalysis || !analysis.basicAnalysis.dayMaster || !analysis.detailedPillars) {
        throw new Error("Không thể phân tích lá số. Vui lòng kiểm tra lại thông tin đầu vào.");
      }

      const dayMaster = analysis.basicAnalysis.dayMaster;
      const strengthRaw = analysis.basicAnalysis.dayMasterStrength.strength;
      const dayMasterElementVi = TRANSLATIONS.elements[dayMaster.element];
      const strength = ['Strong', 'Extremely Strong', 'Vibrant'].includes(strengthRaw) ? 'Vượng' : 'Nhược';

      let favorableElements = [];
      if (strength === 'Vượng') {
        favorableElements.push(WUXING_RELATIONS.controls[dayMasterElementVi]);
        favorableElements.push(WUXING_RELATIONS.produces[dayMasterElementVi]);
      } else {
        const producingElement = Object.keys(WUXING_RELATIONS.produces).find(key => WUXING_RELATIONS.produces[key] === dayMasterElementVi);
        favorableElements.push(producingElement);
        favorableElements.push(dayMasterElementVi);
      }
      favorableElements = [...new Set(favorableElements)].filter(Boolean);

      const recommendedIndustries = {};
      favorableElements.forEach(el => {
        recommendedIndustries[el] = INDUSTRY_MAP[el];
      });

      // Get annual analysis for current year
      const today = new Date();
      const annualAnalysis = calculator.getAnalysisForDate(today, timeZone, { type: 'personalized' });

      const detailedPillars = analysis.detailedPillars;
      // Add withPolarity helper
      const withPolarity = (stem) => {
        if (!stem?.name) return stem;
        const [polarity, elementEn] = stem.name.split(' ');
        return {
          ...stem,
          polarity,
          elementEn,
        };
      };

      const mappedPillars = {
        year: { stem: withPolarity(detailedPillars.year.heavenlyStem), branch: detailedPillars.year.earthlyBranch },
        month: { stem: withPolarity(detailedPillars.month.heavenlyStem), branch: detailedPillars.month.earthlyBranch },
        day: { stem: withPolarity(detailedPillars.day.heavenlyStem), branch: detailedPillars.day.earthlyBranch },
        time: detailedPillars.hour ? { stem: withPolarity(detailedPillars.hour.heavenlyStem), branch: detailedPillars.hour.earthlyBranch } : null
      };

      // Process luck periods data
      const luckPeriodsData = { finance: [], health: [] };
      if (analysis.luckPillars) {
        // Broadened Ten-God groups
        const financeGods = ['Direct Wealth', 'Indirect Wealth', 'Rob Wealth', 'Seven Killings', 'Direct Officer'];
        const healthGods = ['Direct Resource', 'Indirect Resource', 'Eating God', 'Hurting Officer'];

        analysis.luckPillars.pillars.forEach(p => {
          const tenGodName = p.heavenlyStem.tenGod?.name;
          if (tenGodName) {
            const periodInfo = {
              age: p.ageStart,
              years: `${p.yearStart}-${p.yearEnd}`,
              tenGodName: TRANSLATIONS.tenGods[tenGodName] || tenGodName,
              key: p.number
            };
            if (financeGods.includes(tenGodName)) {
              luckPeriodsData.finance.push(periodInfo);
            }
            if (healthGods.includes(tenGodName)) {
              luckPeriodsData.health.push(periodInfo);
            }
          }
        });
      }

      // Process Eight Mansions data
      const rawEightMansions = analysis.basicAnalysis.eightMansions;
      let transformedEightMansions = null;
      if (rawEightMansions) {
        const trigramMap = {
          'East': 'Đông', 'West': 'Tây', 'South': 'Nam', 'North': 'Bắc',
          'Northeast': 'Đông Bắc', 'Southeast': 'Đông Nam',
          'Southwest': 'Tây Nam', 'Northwest': 'Tây Bắc'
        };
        const directions = {};
        if (rawEightMansions.lucky) {
          Object.entries(rawEightMansions.lucky).forEach(([kind, dir]) => {
            directions[kind] = {
              type: 'Auspicious',
              direction: dir,
              description: TRANSLATIONS.eightMansions[kind] || kind
            };
          });
        }
        if (rawEightMansions.unlucky) {
          Object.entries(rawEightMansions.unlucky).forEach(([kind, dir]) => {
            directions[kind] = {
              type: 'Inauspicious',
              direction: dir,
              description: TRANSLATIONS.eightMansions[kind] || kind
            };
          });
        }
        transformedEightMansions = {
          lifeGuaTrigram: trigramMap[rawEightMansions.group] || rawEightMansions.group,
          lifeGuaElement: rawEightMansions.elementName,
          directions
        }
      }

      // Ensure luckPillars heavenlyStem has polarity/elementEn
      if (analysis.luckPillars) {
        analysis.luckPillars.pillars = analysis.luckPillars.pillars.map(p => ({
          ...p,
          heavenlyStem: withPolarity(p.heavenlyStem)
        }));
      }

      setResults({
        birthYear: birthDateTime.getFullYear(),
        gender,
        pillars: mappedPillars,
        dayMaster: dayMaster,
        strength,
        favorableElements,
        industries: recommendedIndustries,
        luckPillars: analysis.luckPillars,
        annualAnalysis,
        fiveFactors: analysis.basicAnalysis.fiveFactors,
        eightMansions: transformedEightMansions,
        symbolicStars: analysis.basicAnalysis.symbolicStars,
        dayMasterStrengthDetails: analysis.basicAnalysis.dayMasterStrength,
        luckPeriodsData
      });

    } catch (e) {
      console.error('❌ calculation error', e);
      setError(e.message || 'Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin và múi giờ (VD: Asia/Ho_Chi_Minh).');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Đang phân tích...';
    return 'Xem Phân Tích';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Bát Tự & Gợi Ý Ngành Đầu Tư
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Khám phá các ngành nghề tiềm năng và phân tích vận hạn của bạn.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold"
            onClick={() => setShowReference((v) => !v)}
          >
            {showReference ? 'Ẩn Tra cứu' : 'Tra cứu Kiến Thức Bát Tự'}
          </button>
        </header>

        {showReference ? (
          <ReferenceSection />
        ) : (
          <>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                <div className="flex flex-col justify-start min-w-0">
                  <DatePickerComponent
                    value={birthDate}
                    onChange={setBirthDate}
                    label="Ngày Sinh"
                    id="birthDate"
                    inputClassName="cursor-pointer w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col justify-start min-w-0">
                  <TimePickerComponent
                    value={birthTime}
                    onChange={setBirthTime}
                    label="Giờ Sinh"
                    id="birthTime"
                    disabled={!isTimeKnown}
                    inputClassName="cursor-pointer w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col justify-start min-w-0">
                  <TimeZonePicker
                    value={timeZone}
                    onChange={setTimeZone}
                    label="Múi Giờ"
                    id="timeZone"
                    className="w-full h-10"
                  />
                </div>
                <div className="flex flex-col justify-start min-w-0">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="gender" className="text-sm font-medium">Giới Tính</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="timeKnown"
                    checked={isTimeKnown}
                    onChange={e => setIsTimeKnown(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <Label htmlFor="timeKnown">Biết giờ sinh</Label>
                </div>
                <Button
                  onClick={handleCalculate}
                  disabled={isLoading}
                  className="px-8"
                >
                  {getButtonText()}
                </Button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </Card>

            {!results && !isLoading && !error && (
              <Card className="mt-8 p-8 text-center">
                <p className="text-gray-500">Nhập thông tin của bạn và nhấn "Xem Phân Tích" để bắt đầu.</p>
              </Card>
            )}

            {isLoading && (
              <Card className="mt-8 p-8 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <p className="text-gray-500">Đang phân tích...</p>
                </div>
              </Card>
            )}

            {results && <>
              <Results data={results} onOpenModal={openModal} />
              <AuspiciousDaysSection
                calculator={new BaziCalculator(
                  isTimeKnown
                    ? toDate(`${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}T${birthTime}`, { timeZone })
                    : toDate(`${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`, { timeZone }),
                  gender,
                  timeZone,
                  isTimeKnown
                )}
                timeZone={timeZone}
                favorableElements={results.favorableElements}
                unfavorableElements={['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'].filter(e => !results.favorableElements.includes(e))}
                daysAhead={14}
              />
            </>}

            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              title={modalContent?.title}
              content={modalContent?.content}
            />

            <footer className="text-center mt-8 text-xs text-gray-500">
              <p>Sử dụng thư viện @aharris02/bazi-calculator-by-alvamind & date-fns-tz.</p>
              <p className="mt-2">
                <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Ứng dụng này được tạo ra cho mục đích tham khảo và giáo dục.
                Thông tin cung cấp không được coi là lời khuyên đầu tư chuyên nghiệp.
                Luôn tham khảo ý kiến chuyên gia tài chính trước khi ra quyết định.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
