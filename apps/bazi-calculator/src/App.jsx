import React, { useState, useRef, useEffect } from 'react';
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind';
import { toDate } from 'date-fns-tz';
import { Card, Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@embed-tools/components';
import { TRANSLATIONS, WUXING_RELATIONS, INDUSTRY_MAP, getBaziSuggestions } from './data/constants';
import { translateNote } from './data/explanations';
import { getBrowserLocale, createBaziDate } from './utils/locale';
import Results from './components/Results';
import Modal from './components/Modal';
import TimePickerComponent from './components/TimePicker';
import TimeZonePicker from './components/TimeZonePicker';
import ReferenceSection from './components/ReferenceSection';
import iframeUtils from '@embed-tools/iframe-utils';

function App() {
  const [birthDate, setBirthDate] = useState(() => {
    const defaultDate = new Date('1990-05-15');
    return isNaN(defaultDate.getTime()) ? null : defaultDate;
  });
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
  const containerRef = useRef(null);
  const isEmbedded = iframeUtils.isEmbedded();

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCalculate = async () => {
    setError('');
    setIsLoading(true);

    if (!birthDate || isNaN(birthDate.getTime())) {
      setError('Vui lòng nhập ngày sinh hợp lệ.');
      setIsLoading(false);
      return;
    }
    if (isTimeKnown && !birthTime) {
      setError('Vui lòng nhập giờ sinh hoặc bỏ tick "Biết giờ sinh".');
      setIsLoading(false);
      return;
    }

    try {
      const birthDateTime = createBaziDate(birthDate, birthTime, timeZone, isTimeKnown, toDate);
      
      // Validate birthDateTime is a valid Date object
      if (!(birthDateTime instanceof Date) || isNaN(birthDateTime.getTime())) {
        throw new Error('Ngày giờ sinh không hợp lệ. Vui lòng kiểm tra lại thông tin và múi giờ.');
      }
      
      // IMPORTANT: BaziCalculator requires timezone-aware Date objects created with toDate from date-fns-tz
      // Regular Date objects will not work correctly for timezone-sensitive calculations
      const calculator = new BaziCalculator(birthDateTime, gender, timeZone, isTimeKnown);

      const analysis = calculator.getCompleteAnalysis();

      if (!analysis || !analysis.basicAnalysis || !analysis.basicAnalysis.dayMaster || !analysis.detailedPillars) {
        throw new Error("Không thể phân tích lá số. Vui lòng kiểm tra lại thông tin đầu vào.");
      }

      const dayMaster = analysis.basicAnalysis.dayMaster;
      const strengthRaw = analysis.basicAnalysis.dayMasterStrength.strength;
      const dayMasterElementEn = dayMaster.element;
      const strength = ['Strong', 'Extremely Strong', 'Vibrant'].includes(strengthRaw) ? 'Vượng' : 'Nhược';

      // English Wu Xing relationships
      const WUXING_EN = {
        produces: { 'WOOD': 'FIRE', 'FIRE': 'EARTH', 'EARTH': 'METAL', 'METAL': 'WATER', 'WATER': 'WOOD' },
        controls: { 'WOOD': 'EARTH', 'FIRE': 'METAL', 'EARTH': 'WATER', 'METAL': 'WOOD', 'WATER': 'FIRE' }
      };

      let favorableElements = [];
      if (strength === 'Vượng') {
        // For strong day master, use controlling and producing elements
        const controllingElement = WUXING_EN.controls[dayMasterElementEn];
        if (controllingElement) favorableElements.push(controllingElement);
        
        const producingElement = WUXING_EN.produces[dayMasterElementEn];
        if (producingElement) favorableElements.push(producingElement);
      } else {
        // For weak day master, use producing and self elements
        const producingElement = Object.keys(WUXING_EN.produces).find(key => WUXING_EN.produces[key] === dayMasterElementEn);
        if (producingElement) favorableElements.push(producingElement);
        
        // Add self element
        favorableElements.push(dayMasterElementEn);
      }
      favorableElements = [...new Set(favorableElements)].filter(Boolean);

      const recommendedIndustries = {};
      favorableElements.forEach(el => {
        // Map English element to Vietnamese for industry lookup
        const elementVi = TRANSLATIONS.elements[el];
        recommendedIndustries[el] = INDUSTRY_MAP[elementVi];
      });

      // Calculate unfavorable industries (industries to avoid)
      const unfavorableElements = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'].filter(e => !favorableElements.includes(e));
      const unfavorableIndustries = {};
      unfavorableElements.forEach(el => {
        // Map English element to Vietnamese for industry lookup
        const elementVi = TRANSLATIONS.elements[el];
        unfavorableIndustries[el] = INDUSTRY_MAP[elementVi];
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
        // Updated Ten-God groups to match API response format
        const financeGods = ['Zheng Cai', 'Pian Cai', 'Jie Cai', 'Qi Sha', 'Zheng Guan'];
        const healthGods = ['Zheng Yin', 'Pian Yin', 'Shi Shen', 'Shang Guan'];
        
        // Collect all available Ten-God names for debugging
        const allTenGods = new Set();

        analysis.luckPillars.pillars.forEach((p, index) => {
          // Check if tenGod exists on heavenlyStem
          let tenGodName = p.heavenlyStem.tenGod?.name;
          
          // If not found on heavenlyStem, check hiddenStems
          if (!tenGodName && p.earthlyBranch.hiddenStems) {
            p.earthlyBranch.hiddenStems.forEach((hiddenStem, hiddenIndex) => {
              if (hiddenStem.tenGod) {
                tenGodName = hiddenStem.tenGod.name;
                allTenGods.add(hiddenStem.tenGod.name);
              }
            });
          }
          
          // If still not found, check if there's a heavenlyStemTenGod property
          if (!tenGodName && p.heavenlyStemTenGod) {
            tenGodName = p.heavenlyStemTenGod.name;
            allTenGods.add(p.heavenlyStemTenGod.name);
          }
          
          // If still not found, try to get from detailedPillars based on the pillar type
          if (!tenGodName && analysis.detailedPillars) {
            // Map pillar number to pillar type (year, month, day, hour)
            const pillarTypes = ['year', 'month', 'day', 'hour'];
            const pillarType = pillarTypes[index % 4];
            const detailedPillar = analysis.detailedPillars[pillarType];
            
            if (detailedPillar && detailedPillar.heavenlyStemTenGod) {
              tenGodName = detailedPillar.heavenlyStemTenGod.name;
              allTenGods.add(detailedPillar.heavenlyStemTenGod.name);
            }
          }
          
          if (tenGodName) {
            const periodInfo = {
              age: p.ageStart,
              years: `${p.yearStart}-${p.yearEnd}`,
              tenGodName: translateNote(tenGodName),
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
        birthDateTime: birthDateTime.toISOString(),
        originalBirthDate: birthDate.toISOString().split('T')[0],
        originalBirthTime: birthTime,
        gender,
        timeZone,
        isTimeKnown,
        pillars: mappedPillars,
        dayMaster: dayMaster,
        strength,
        favorableElements,
        industries: recommendedIndustries,
        unfavorableElements,
        unfavorableIndustries,
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

  // Get expected date format based on locale
  const getExpectedDateFormat = () => {
    const locale = getBrowserLocale();
    const testDate = new Date(2025, 0, 15); // January 15, 2025
    
    // Get the date format for the current locale
    const formattedDate = testDate.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Replace the actual values with format placeholders
    return formattedDate
      .replace('2025', 'YYYY')
      .replace('01', 'MM')
      .replace('15', 'DD');
  };

  const getButtonText = () => {
    if (isLoading) return 'Đang phân tích...';
    return 'Xem Phân Tích';
  };

  // Resize observer for iframe communication
  useEffect(() => {
    if (!isEmbedded || !containerRef.current) return;

    const resizeObserver = new window.ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        iframeUtils.sendResizeMessage(width, height);
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial size notification
    const { width, height } = containerRef.current.getBoundingClientRect();
    iframeUtils.sendResizeMessage(width, height);

    return () => resizeObserver.disconnect();
  }, [isEmbedded]);

  // Set locale for the application based on browser settings
  useEffect(() => {
    const locale = getBrowserLocale();
    document.documentElement.lang = locale;
    document.documentElement.setAttribute('lang', locale);
  }, []);

  // Notify parent when state changes (results, modal, etc.)
  useEffect(() => {
    if (!isEmbedded) return;
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        iframeUtils.sendResizeMessage(width, height);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [results, isModalOpen, showReference, isEmbedded]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          {!isEmbedded && (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Bát Tự & Gợi Ý Ngành Đầu Tư
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Khám phá các ngành nghề tiềm năng và phân tích vận hạn của bạn.
              </p>
            </>
          )}

          <button
            className="cursor-pointer mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold"
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
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="birthDate" className="text-sm font-medium">Ngày Sinh:</Label>
                      <span className="text-xs text-gray-500">({getExpectedDateFormat()})</span>
                    </div>
                    <input
                      type="date"
                      id="birthDate"
                      value={birthDate && !isNaN(birthDate.getTime()) ? birthDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setBirthDate(isNaN(newDate.getTime()) ? null : newDate);
                      }}
                      lang={getBrowserLocale()}
                      className="cursor-pointer w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
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
              {(() => {
                try {
                  if (!birthDate || isNaN(birthDate.getTime())) {
                    throw new Error('Invalid birth date');
                  }
                  
                  const birthDateTimeForResults = createBaziDate(birthDate, birthTime, timeZone, isTimeKnown, toDate);
                  
                  // IMPORTANT: BaziCalculator requires timezone-aware Date objects created with toDate from date-fns-tz
                  const calculator = new BaziCalculator(birthDateTimeForResults, gender, timeZone, isTimeKnown);
                  
                  return (
                    <Results 
                      data={results} 
                      onOpenModal={openModal} 
                      calculator={calculator}
                      timeZone={timeZone}
                    />
                  );
                } catch (e) {
                  console.warn('⚠️ Could not create calculator for results:', e.message);
                  return (
                    <Results 
                      data={results} 
                      onOpenModal={openModal} 
                      calculator={null}
                      timeZone={timeZone}
                    />
                  );
                }
              })()}
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
