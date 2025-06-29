// Debug script to test VNIndex calculation and compare with Python output
import NatalCalculator, { PRESET_INSTRUMENTS } from './src/utils/natalCalculator.js';
import { dateToJulianDay, getPlanetLongitude, getSunLongitudeDebug, getAscendantMidheavenDebug } from '@embed-tools/astro-utils';
import { calculateTransitPositions } from '@embed-tools/astro-utils';

async function debugVNIndex() {
  console.log('=== DEBUG: VNIndex Natal Chart and Events ===\n');
  
  // Get VNIndex preset data
  const vnindex = PRESET_INSTRUMENTS.VNIndex;
  console.log('VNIndex Preset Data:', vnindex);
  
  // Debug the parameters being passed to NatalCalculator
  console.log('Parameters being passed to NatalCalculator:');
  console.log('name:', typeof vnindex.name, vnindex.name);
  console.log('birthDate:', typeof vnindex.birthDate, vnindex.birthDate);
  console.log('birthTime:', typeof vnindex.birthTime, vnindex.birthTime);
  console.log('birthLocation:', typeof vnindex.birthLocation, vnindex.birthLocation);
  console.log('lat:', typeof vnindex.lat, vnindex.lat);
  console.log('lon:', typeof vnindex.lon, vnindex.lon);
  console.log('utcOffset:', typeof vnindex.utcOffset, vnindex.utcOffset);
  
  try {
    // Create calculator
    const calculator = new NatalCalculator(
      vnindex.name,
      vnindex.birthDate,
      vnindex.birthTime,
      vnindex.birthLocation,
      vnindex.lat,
      vnindex.lon,
      vnindex.utcOffset
    );
    
    // Debug timezone conversion
    console.log('\n=== TIMEZONE DEBUG ===');
    console.log(`Birth Date: ${vnindex.birthDate}`);
    console.log(`Birth Time: ${vnindex.birthTime}`);
    console.log(`UTC Offset: ${vnindex.utcOffset}`);
    console.log(`Birth Datetime: ${calculator.birthDatetime.toISOString()}`);
    console.log(`UTC Datetime: ${calculator.utcDatetime.toISOString()}`);
    console.log(`UTC Offset (hours): ${calculator.utcOffset}`);
    
    // Calculate natal chart
    console.log('\n=== NATAL CHART ===');
    const natalChart = calculator.getNatalChart();
    console.log('Natal Chart:', JSON.stringify(natalChart, null, 2));
    
    // Display natal chart in readable format
    console.log('\n=== NATAL CHART (Readable) ===');
    console.log(`ANALYSIS FOR ${vnindex.name.toUpperCase()}`);
    console.log('----------------------------------------');
    console.log(`NATAL CHART: ${vnindex.name.toUpperCase()}`);
    console.log(`Born: ${vnindex.birthDate} ${vnindex.birthTime} at ${vnindex.lat},${vnindex.lon} (UTC${vnindex.utcOffset})`);
    console.log(`Ruling Planet: ${natalChart.rulingPlanet || calculator.rulingPlanet || 'Unknown'}`);
    console.log('----------------------------------------');
    
    Object.entries(natalChart).forEach(([planet, data]) => {
      if (planet !== 'rulingPlanet' && data && data.longitude !== undefined) {
        const degrees = Math.floor(data.longitude);
        const minutes = Math.floor((data.longitude - degrees) * 60);
        const seconds = Math.floor(((data.longitude - degrees) * 60 - minutes) * 60);
        console.log(`${planet.padEnd(12)} : ${degrees}°${minutes}'${seconds}" ${data.sign}`);
      }
    });
    
    // Calculate transits for 2025
    console.log('\n=== TRANSIT EVENTS ===');
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    
    const results = calculator.calculateTransits(
      startDate,
      endDate,
      1, // orbDays
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter'], // transit planets - added more planets
      ['Ascendant', 'Midheaven', 'Sun', 'Moon', 'Mercury', 'Jupiter', 'Neptune'] // natal points
    );
    
    console.log(`Total raw events: ${results.events.length}`);
    console.log(`Total retrograde days: ${results.retroDays.length}`);
    
    // Test retrograde detection specifically
    console.log('\n=== RETROGRADE DETECTION TEST ===');
    const testDates = [
      new Date('2025-01-01'),
      new Date('2025-02-01'),
      new Date('2025-03-01'),
      new Date('2025-04-01'),
      new Date('2025-05-01')
    ];
    
    testDates.forEach(date => {
      const positions = calculateTransitPositions(date, ['Mercury', 'Venus', 'Mars', 'Jupiter']);
      console.log(`${date.toISOString().split('T')[0]}:`);
      Object.entries(positions).forEach(([planet, pos]) => {
        console.log(`  ${planet}: ${pos.longitude.toFixed(2)}° ${pos.sign} ${pos.retrograde ? '(R)' : ''}`);
      });
    });
    
    // Filter events by significance threshold
    const significantEvents = results.events.filter(e => e.score >= 3);
    console.log(`Significant events (score >= 3): ${significantEvents.length}`);
    
    // Show first 10 events
    console.log('\n=== FIRST 10 SIGNIFICANT EVENTS ===');
    significantEvents.slice(0, 10).forEach((event, index) => {
      console.log(`${index + 1}. ${event.date.toISOString().split('T')[0]}: ${event.transitPlanet} → ${event.natalPoint} ${event.aspect.name} (orb: ${event.aspect.orb.toFixed(2)}°, score: ${event.score.toFixed(2)})`);
    });
    
    // Prepare outputs (merge consecutive events)
    const outputs = calculator.prepareOutputs(
      results.events,
      results.retroDays,
      180.0,
      10
    );
    
    console.log('\n=== MERGED WINDOWS ===');
    console.log(`Aspect windows: ${outputs.aspectWindows.length}`);
    console.log(`Retrograde windows: ${outputs.retroWindows.length}`);
    
    // Show first 10 aspect windows
    console.log('\n=== FIRST 10 ASPECT WINDOWS ===');
    outputs.aspectWindows.slice(0, 10).forEach((window, index) => {
      const start = window.startDate.toISOString().split('T')[0];
      const end = window.endDate.toISOString().split('T')[0];
      const peak = window.peakDate.toISOString().split('T')[0];
      console.log(`${index + 1}. ${start} – ${end}: ${window.transitPlanet} → ${window.natalPoint} ${window.aspect.name} (peak: ${peak}, orb: ${window.peakOrb.toFixed(2)}°, score: ${window.maxScore.toFixed(2)}; ${window.aspect.interpretation})`);
    });
    
    // Show retrograde windows
    console.log('\n=== RETROGRADE WINDOWS ===');
    outputs.retroWindows.forEach((window, index) => {
      const start = window.startDate.toISOString().split('T')[0];
      const end = window.endDate.toISOString().split('T')[0];
      console.log(`${index + 1}. ${start} – ${end}: ${window.planet} Retrograde (${window.days} days)`);
    });
    
    // Compare with Python output
    console.log('\n=== COMPARISON WITH PYTHON OUTPUT ===');
    console.log('Expected first few events from Python:');
    console.log('• 2025/01/04 – 2025/01/07: Sun → Mercury Opposition (180°)');
    console.log('• 2025/01/11 – 2025/01/14: Sun → Ascendant Trine (120°)');
    console.log('• 2025/01/20 – 2025/01/20: Moon → Mercury Square (90°)');
    console.log('• 2025/01/23 – 2025/01/26: Sun → Jupiter Trine (120°)');
    console.log('• 2025/01/23 – 2025/01/26: Sun → Neptune Conjunction (0°)');
    
    console.log('\nActual JavaScript output:');
    outputs.aspectWindows.slice(0, 5).forEach((window, index) => {
      const start = window.startDate.toISOString().split('T')[0].replace(/-/g, '/');
      const end = window.endDate.toISOString().split('T')[0].replace(/-/g, '/');
      console.log(`• ${start} – ${end}: ${window.transitPlanet} → ${window.natalPoint} ${window.aspect.name}`);
    });
    
  } catch (error) {
    console.error('Error in debugVNIndex:', error);
    console.error('Error stack:', error.stack);
  }
}

async function debugAstrologComparison() {
  console.log('\n\n=== DEBUG: Astrolog Comparison ===\n');
  
  // Test with Astrolog's exact coordinates: 106:37E 10:49N, Zone 7E
  // Converting 106:37E to decimal: 106 + 37/60 = 106.6167E
  // Converting 10:49N to decimal: 10 + 49/60 = 10.8167N
  const astrologCoords = {
    name: "AstrologTest",
    birthDate: "2000-07-28",
    birthTime: "09:00",
    birthLocation: "Ho Chi Minh City, Vietnam",
    lat: "10.8167N",
    lon: "106.6167E",
    utcOffset: "+07:00", // Zone 7E = UTC+7
    description: "Astrolog Test Case - Exact Coordinates"
  };
  
  console.log('Astrolog Test Data:', astrologCoords);
  
  // Create calculator with Astrolog's coordinates
  const calculator = new NatalCalculator(
    astrologCoords.name,
    astrologCoords.birthDate,
    astrologCoords.birthTime,
    astrologCoords.birthLocation,
    astrologCoords.lat,
    astrologCoords.lon,
    astrologCoords.utcOffset
  );
  
  // Debug timezone conversion
  console.log('\n=== ASTROLOG TIMEZONE DEBUG ===');
  console.log(`Birth Date: ${astrologCoords.birthDate}`);
  console.log(`Birth Time: ${astrologCoords.birthTime}`);
  console.log(`UTC Offset: ${astrologCoords.utcOffset}`);
  console.log(`Birth Datetime: ${calculator.birthDatetime.toISOString()}`);
  console.log(`UTC Datetime: ${calculator.utcDatetime.toISOString()}`);
  
  // Calculate natal chart
  console.log('\n=== ASTROLOG NATAL CHART ===');
  const natalChart = calculator.getNatalChart();
  
  // Display natal chart in readable format
  console.log('\n=== ASTROLOG NATAL CHART (Readable) ===');
  console.log(`ANALYSIS FOR ASTROLOG TEST`);
  console.log('----------------------------------------');
  console.log(`NATAL CHART: ASTROLOG TEST`);
  console.log(`Born: ${astrologCoords.birthDate} ${astrologCoords.birthTime} at ${astrologCoords.lat},${astrologCoords.lon} (UTC${astrologCoords.utcOffset})`);
  console.log(`Ruling Planet: ${natalChart.rulingPlanet || calculator.rulingPlanet || 'Unknown'}`);
  console.log('----------------------------------------');
  
  Object.entries(natalChart).forEach(([planet, data]) => {
    if (planet !== 'rulingPlanet' && data && data.longitude !== undefined) {
      const degrees = Math.floor(data.longitude);
      const minutes = Math.floor((data.longitude - degrees) * 60);
      const seconds = Math.floor(((data.longitude - degrees) * 60 - minutes) * 60);
      console.log(`${planet.padEnd(12)} : ${degrees}°${minutes}'${seconds}" ${data.sign}`);
    }
  });
  
  console.log('\n=== ASTROLOG COMPARISON ===');
  console.log('Astrolog Output:');
  console.log('• Sun in Leo');
  console.log('• Moon in Gemini');
  console.log('• Mercury in Cancer');
  console.log('• Venus in Leo');
  console.log('• Mars in Cancer');
  console.log('• Jupiter in Gemini');
  console.log('• Saturn in Taurus');
  console.log('• Ascendant in Virgo');
  console.log('• Midheaven in Gemini');
  
  console.log('\nOur Output:');
  console.log(`• Sun in ${natalChart.Sun?.sign || 'Unknown'}`);
  console.log(`• Moon in ${natalChart.Moon?.sign || 'Unknown'}`);
  console.log(`• Mercury in ${natalChart.Mercury?.sign || 'Unknown'}`);
  console.log(`• Venus in ${natalChart.Venus?.sign || 'Unknown'}`);
  console.log(`• Mars in ${natalChart.Mars?.sign || 'Unknown'}`);
  console.log(`• Jupiter in ${natalChart.Jupiter?.sign || 'Unknown'}`);
  console.log(`• Saturn in ${natalChart.Saturn?.sign || 'Unknown'}`);
  console.log(`• Ascendant in ${natalChart.Ascendant?.sign || 'Unknown'}`);
  console.log(`• Midheaven in ${natalChart.Midheaven?.sign || 'Unknown'}`);
  
  console.log('\n=== DETAILED COMPARISON ===');
  console.log('Planet | Astrolog | Our JS | Difference');
  console.log('-------|----------|--------|-----------');
  const comparisons = [
    { name: 'Sun', astrolog: 'Leo', our: natalChart.Sun?.sign },
    { name: 'Moon', astrolog: 'Gemini', our: natalChart.Moon?.sign },
    { name: 'Mercury', astrolog: 'Cancer', our: natalChart.Mercury?.sign },
    { name: 'Venus', astrolog: 'Leo', our: natalChart.Venus?.sign },
    { name: 'Mars', astrolog: 'Cancer', our: natalChart.Mars?.sign },
    { name: 'Jupiter', astrolog: 'Gemini', our: natalChart.Jupiter?.sign },
    { name: 'Saturn', astrolog: 'Taurus', our: natalChart.Saturn?.sign },
    { name: 'Ascendant', astrolog: 'Virgo', our: natalChart.Ascendant?.sign },
    { name: 'Midheaven', astrolog: 'Gemini', our: natalChart.Midheaven?.sign }
  ];
  
  comparisons.forEach(comp => {
    const match = comp.astrolog === comp.our ? '✓' : '✗';
    console.log(`${comp.name.padEnd(10)} | ${comp.astrolog.padEnd(8)} | ${(comp.our || 'Unknown').padEnd(6)} | ${match}`);
  });
}

async function debugSunPosition() {
  console.log('\n\n=== DEBUG: Sun Position Test ===\n');
  
  // 9am local time in HCMC (UTC+7) is 2am UTC
  const testDate = new Date(Date.UTC(2000, 6, 28, 2, 0, 0));
  
  console.log('Test Date:', testDate.toISOString());
  
  // Get detailed Sun debug info
  const sunDebug = getSunLongitudeDebug(testDate);
  console.log('Raw Sun Debug Data:');
  console.log('  Julian Day:', sunDebug.julianDay);
  console.log('  T (Julian centuries):', sunDebug.T);
  console.log('\nAstronomia Calculation:');
  console.log('  Longitude (radians):', sunDebug.astronomia.longitudeRadians);
  console.log('  Longitude (degrees):', sunDebug.astronomia.longitudeDegrees);
  console.log('  Sign:', sunDebug.astronomia.sign);
  console.log('  Degree in Sign:', sunDebug.astronomia.degreeInSign);
  console.log('\nCustom Calculation:');
  console.log('  Longitude (degrees):', sunDebug.custom.longitudeDegrees);
  console.log('  Sign:', sunDebug.custom.sign);
  console.log('  Degree in Sign:', sunDebug.custom.degreeInSign);
  console.log('\nDifference between methods:', sunDebug.difference.toFixed(4) + '°');
  
  // Also test with getPlanetLongitude for comparison
  const sunLongitude = getPlanetLongitude(testDate, 'Sun');
  console.log('\nComparison:');
  console.log('  getPlanetLongitude result:', sunLongitude);
  console.log('  getSunLongitudeDebug (astronomia):', sunDebug.astronomia.longitudeDegrees);
  console.log('  getSunLongitudeDebug (custom):', sunDebug.custom.longitudeDegrees);
  
  // Expected: Sun should be in Leo (around 120-150°)
  console.log('\nExpected: Sun in Leo (120-150°)');
  console.log('Astronomia: Sun in', sunDebug.astronomia.sign, `(${sunDebug.astronomia.longitudeDegrees.toFixed(2)}°)`);
  console.log('Custom: Sun in', sunDebug.custom.sign, `(${sunDebug.custom.longitudeDegrees.toFixed(2)}°)`);
  
  const leoIndex = 4; // Leo is index 4
  const astronomiaSignIndex = Math.floor(sunDebug.astronomia.longitudeDegrees / 30);
  const customSignIndex = Math.floor(sunDebug.custom.longitudeDegrees / 30);
  
  if (astronomiaSignIndex === leoIndex) {
    console.log('✓ Astronomia Sun position is correct!');
  } else {
    console.log('✗ Astronomia Sun position is incorrect!');
    console.log('  Expected sign index:', leoIndex, '(Leo)');
    console.log('  Actual sign index:', astronomiaSignIndex, `(${sunDebug.astronomia.sign})`);
  }
  
  if (customSignIndex === leoIndex) {
    console.log('✓ Custom Sun position is correct!');
  } else {
    console.log('✗ Custom Sun position is incorrect!');
    console.log('  Expected sign index:', leoIndex, '(Leo)');
    console.log('  Actual sign index:', customSignIndex, `(${sunDebug.custom.sign})`);
  }
  
  // Test a few other dates to see if the pattern holds
  console.log('\n=== Testing Other Dates ===');
  const testDates = [
    new Date(Date.UTC(2000, 6, 28, 12, 0, 0)), // July 28, 2000 12pm UTC
    new Date(Date.UTC(2000, 6, 29, 2, 0, 0)),  // July 29, 2000 2am UTC
    new Date(Date.UTC(2000, 7, 1, 2, 0, 0))    // August 1, 2000 2am UTC
  ];
  
  testDates.forEach((date, index) => {
    const debug = getSunLongitudeDebug(date);
    console.log(`Date ${index + 1}: ${date.toISOString()}`);
    console.log(`  Astronomia: ${debug.astronomia.longitudeDegrees.toFixed(2)}° (${debug.astronomia.sign})`);
    console.log(`  Custom: ${debug.custom.longitudeDegrees.toFixed(2)}° (${debug.custom.sign})`);
    console.log(`  Difference: ${debug.difference.toFixed(4)}°`);
  });
}

async function debugAscendantMidheaven() {
  console.log('\n\n=== DEBUG: Ascendant and Midheaven ===\n');
  
  // Test with Astrolog's exact coordinates: 106:37E 10:49N, Zone 7E
  // Converting 106:37E to decimal: 106 + 37/60 = 106.6167E
  // Converting 10:49N to decimal: 10 + 49/60 = 10.8167N
  const testDate = new Date(Date.UTC(2000, 6, 28, 2, 0, 0)); // 9am local = 2am UTC
  const lat = 10.8167; // 10:49N
  const lon = 106.6167; // 106:37E
  
  console.log('Test Date:', testDate.toISOString());
  console.log('Coordinates:', `${lat}°N, ${lon}°E`);
  
  // Get detailed Ascendant/Midheaven debug info
  const debug = getAscendantMidheavenDebug(testDate, lat, lon);
  
  console.log('\n=== DETAILED CALCULATION ===');
  console.log('Julian Day:', debug.julianDay);
  console.log('\nCoordinates:');
  console.log('  Latitude:', debug.coordinates.lat + '°N');
  console.log('  Longitude:', debug.coordinates.lon + '°E');
  
  console.log('\nSidereal Time:');
  console.log('  Greenwich (seconds):', debug.sidereal.gastSeconds.toFixed(2));
  console.log('  Greenwich (hours):', debug.sidereal.gastHours.toFixed(6));
  console.log('  Local (hours):', debug.sidereal.localSiderealHours.toFixed(6));
  console.log('  Local (rad):', debug.sidereal.localSiderealRad.toFixed(6));
  
  console.log('\nObliquity of Ecliptic:');
  console.log('  Radians:', debug.obliquity.radians.toFixed(6));
  console.log('  Degrees:', debug.obliquity.degrees.toFixed(4) + '°');
  
  console.log('\nAscendant Calculation:');
  console.log('  Result (rad):', debug.ascendant.radians.toFixed(6));
  console.log('  Result (deg):', debug.ascendant.degrees.toFixed(4) + '°');
  console.log('  Sign:', debug.ascendant.sign);
  console.log('  Degree in Sign:', debug.ascendant.degreeInSign.toFixed(1) + '°');
  
  console.log('\nMidheaven Calculation:');
  console.log('  Result (rad):', debug.midheaven.radians.toFixed(6));
  console.log('  Result (deg):', debug.midheaven.degrees.toFixed(4) + '°');
  console.log('  Sign:', debug.midheaven.sign);
  console.log('  Degree in Sign:', debug.midheaven.degreeInSign.toFixed(1) + '°');
  
  console.log('\n=== COMPARISON WITH ASTROLOG ===');
  console.log('Expected (Astrolog):');
  console.log('  Ascendant: Virgo (150-180°)');
  console.log('  Midheaven: Gemini (60-90°)');
  
  console.log('\nOur Results:');
  console.log('  Ascendant:', debug.ascendant.sign, `(${debug.ascendant.degrees.toFixed(2)}°)`);
  console.log('  Midheaven:', debug.midheaven.sign, `(${debug.midheaven.degrees.toFixed(2)}°)`);
  
  // Check if our results match Astrolog
  const ascendantMatch = debug.ascendant.sign === 'Virgo';
  const midheavenMatch = debug.midheaven.sign === 'Gemini';
  
  console.log('\n=== ACCURACY CHECK ===');
  console.log('Ascendant:', ascendantMatch ? '✓' : '✗', `(Virgo vs ${debug.ascendant.sign})`);
  console.log('Midheaven:', midheavenMatch ? '✓' : '✗', `(Gemini vs ${debug.midheaven.sign})`);
  
  if (!ascendantMatch || !midheavenMatch) {
    console.log('\n=== POTENTIAL ISSUES ===');
    console.log('1. Sidereal time calculation might be off');
    console.log('2. Obliquity of ecliptic might be wrong');
    console.log('3. Quadrant adjustment logic might be incorrect');
    console.log('4. Coordinate conversion might have issues');
  }
}

// Run all debug functions
debugVNIndex().then(() => debugAstrologComparison()).then(() => debugSunPosition()).then(() => debugAscendantMidheaven()).catch(console.error); 