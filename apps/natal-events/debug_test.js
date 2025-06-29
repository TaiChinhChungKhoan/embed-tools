// Debug script to test VNIndex calculation and compare with Python output
import { NatalCalculator } from '@embed-tools/astro-utils';
import { getPlanetLongitude, getPlanetLatitude, isRetrograde, getZodiacSign } from '@embed-tools/astro-utils';
import { calculateTransitPositions } from '@embed-tools/astro-utils';
import { apparent as siderealApparent } from 'astronomia/sidereal';
import { calculateNatalChart, calculateAscendant, calculateMidheaven, getDegreeInSign } from '../../packages/astro-utils/src/natal.js';
import { dateToJulianDay } from '../../packages/astro-utils/src/helper.js';

async function debugVNIndex() {
  console.log('=== DEBUG: VNIndex Natal Chart and Events ===\n');
  
  // Use only the hardcoded input for the VNIndex test
  const vnindex = {
    name: "TestName",
    birthDate: "2000-07-28",
    birthTime: "09:00",
    birthLocation: "Ho Chi Minh City, Vietnam",
    lat: "10:49N", // Use degrees:minutes format like Astrolog
    lon: "106:37E", // Use degrees:minutes format like Astrolog
    utcOffset: "+07:00", // Zone 7E = UTC+7
    description: "Astrolog Test Case - Exact Coordinates"
  };
  
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
    lat: "10:49N", // Use degrees:minutes format like Astrolog
    lon: "106:37E", // Use degrees:minutes format like Astrolog
    utcOffset: "+07:00", // Zone 7E = UTC+7
    description: "Astrolog Test Case - Exact Coordinates"
  };
  
  console.log('Astrolog Test Data:', astrologCoords);
  
  // Debug coordinate parsing manually
  console.log('\n=== COORDINATE PARSING DEBUG ===');
  console.log('Input coordinates:');
  console.log('  lat: "10:49N"');
  console.log('  lon: "106:37E"');
  
  // Manual parsing to verify
  const latMatch = "10:49N".match(/(\d+):(\d+)([NS])/);
  const lonMatch = "106:37E".match(/(\d+):(\d+)([EW])/);
  
  if (latMatch) {
    const [, latDeg, latMin, latDir] = latMatch;
    const latDecimal = parseFloat(latDeg) + parseFloat(latMin) / 60;
    const latFinal = latDir === 'S' ? -latDecimal : latDecimal;
    console.log('  Latitude parsing:');
    console.log(`    Degrees: ${latDeg}, Minutes: ${latMin}, Direction: ${latDir}`);
    console.log(`    Decimal: ${latDecimal}°`);
    console.log(`    Final: ${latFinal}°`);
  }
  
  if (lonMatch) {
    const [, lonDeg, lonMin, lonDir] = lonMatch;
    const lonDecimal = parseFloat(lonDeg) + parseFloat(lonMin) / 60;
    const lonFinal = lonDir === 'W' ? -lonDecimal : lonDecimal;
    console.log('  Longitude parsing:');
    console.log(`    Degrees: ${lonDeg}, Minutes: ${lonMin}, Direction: ${lonDir}`);
    console.log(`    Decimal: ${lonDecimal}°`);
    console.log(`    Final: ${lonFinal}°`);
  }
  
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
  console.log(`Parsed Lat: ${calculator.lat}°`);
  console.log(`Parsed Lon: ${calculator.lon}°`);
  
  // Calculate natal chart
  console.log('\n=== ASTROLOG NATAL CHART ===');
  const natalChart = calculator.getNatalChart();
  
  // Expected Astrolog positions (from the output)
  const expectedPositions = {
    'Sun': { sign: 'Leo', degree: 5, minute: 18, retrograde: false },
    'Moon': { sign: 'Gemini', degree: 22, minute: 54, retrograde: false },
    'Mercury': { sign: 'Cancer', degree: 15, minute: 37, retrograde: false },
    'Venus': { sign: 'Leo', degree: 18, minute: 8, retrograde: false },
    'Mars': { sign: 'Cancer', degree: 27, minute: 25, retrograde: false },
    'Jupiter': { sign: 'Gemini', degree: 5, minute: 17, retrograde: true },
    'Saturn': { sign: 'Taurus', degree: 29, minute: 7, retrograde: false },
    'Uranus': { sign: 'Aquarius', degree: 19, minute: 24, retrograde: true },
    'Neptune': { sign: 'Aquarius', degree: 5, minute: 10, retrograde: true },
    'Pluto': { sign: 'Sagittarius', degree: 10, minute: 18, retrograde: true },
    'Ascendant': { sign: 'Virgo', degree: 22, minute: 37, retrograde: false },
    'Midheaven': { sign: 'Gemini', degree: 23, minute: 15, retrograde: false }
  };
  
  console.log('\n=== COMPARISON WITH ASTROLOG OUTPUT ===');
  console.log('Planet    | Expected (Astrolog) | Actual (JS) | Diff | Status');
  console.log('----------|---------------------|-------------|------|--------');
  
  Object.entries(expectedPositions).forEach(([planet, expected]) => {
    const actual = natalChart[planet];
    if (!actual) {
      console.log(`${planet.padEnd(10)} | ${expected.sign}${expected.degree.toString().padStart(2)}°${expected.minute.toString().padStart(2)}' | MISSING | --- | ❌`);
      return;
    }
    
    // Convert actual longitude to degrees and minutes
    const actualDegrees = Math.floor(actual.longitude);
    const actualMinutes = Math.floor((actual.longitude - actualDegrees) * 60);
    
    // Calculate difference in minutes
    const expectedTotalMinutes = expected.degree * 60 + expected.minute;
    const actualTotalMinutes = actualDegrees * 60 + actualMinutes;
    const diffMinutes = Math.abs(actualTotalMinutes - expectedTotalMinutes);
    
    // Check if retrograde status matches
    const retrogradeMatch = actual.retrograde === expected.retrograde;
    
    // Determine status
    let status = '✅';
    if (diffMinutes > 5) status = '⚠️'; // More than 5 minutes difference
    if (diffMinutes > 15) status = '❌'; // More than 15 minutes difference
    if (!retrogradeMatch) status = '❌';
    
    console.log(`${planet.padEnd(10)} | ${expected.sign}${expected.degree.toString().padStart(2)}°${expected.minute.toString().padStart(2)}'${expected.retrograde ? 'R' : ' '} | ${actual.sign}${actualDegrees.toString().padStart(2)}°${actualMinutes.toString().padStart(2)}'${actual.retrograde ? 'R' : ' '} | ${diffMinutes.toString().padStart(2)}m | ${status}`);
  });
  
  // Test individual planet calculations
  console.log('\n=== INDIVIDUAL PLANET CALCULATIONS ===');
  const testDate = calculator.utcDatetime;
  
  ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].forEach(planet => {
    try {
      const lon = getPlanetLongitude(testDate, planet);
      const lat = getPlanetLatitude(testDate, planet);
      const retro = isRetrograde(testDate, planet);
      const degrees = Math.floor(lon);
      const minutes = Math.floor((lon - degrees) * 60);
      
      console.log(`${planet.padEnd(10)}: ${degrees}°${minutes}' ${lat.toFixed(2)}° lat ${retro ? '(R)' : ''}`);
    } catch (error) {
      console.log(`${planet.padEnd(10)}: ERROR - ${error.message}`);
    }
  });
  
  // Test Ascendant and Midheaven calculations
  console.log('\n=== ASCENDANT & MIDHEAVEN CALCULATIONS ===');
  try {
    const asc = calculator.natalChart.Ascendant;
    const mc = calculator.natalChart.Midheaven;
    
    console.log(`Ascendant: ${Math.floor(asc.longitude)}°${Math.floor((asc.longitude - Math.floor(asc.longitude)) * 60)}' ${asc.sign}`);
    console.log(`Midheaven: ${Math.floor(mc.longitude)}°${Math.floor((mc.longitude - Math.floor(mc.longitude)) * 60)}' ${mc.sign}`);
    
    // Debug Ascendant calculation specifically
    console.log('\n=== ASCENDANT CALCULATION DEBUG ===');
    console.log(`Expected Ascendant: 22°37' Virgo (142.6°)`);
    console.log(`Our Ascendant: ${asc.longitude.toFixed(2)}° ${asc.sign}`);
    console.log(`Difference: ${Math.abs(asc.longitude - 142.6).toFixed(2)}°`);
    
    // Check if coordinates are the issue
    console.log('\n=== COORDINATE COMPARISON ===');
    console.log('Astrolog coordinates: 106:37E 10:49N');
    console.log('Our parsed coordinates:');
    console.log(`  Lat: ${calculator.lat}° (${calculator.lat >= 0 ? 'N' : 'S'})`);
    console.log(`  Lon: ${calculator.lon}° (${calculator.lon >= 0 ? 'E' : 'W'})`);
    
    // Convert back to degrees:minutes for comparison
    const latDeg = Math.floor(Math.abs(calculator.lat));
    const latMin = Math.floor((Math.abs(calculator.lat) - latDeg) * 60);
    const lonDeg = Math.floor(Math.abs(calculator.lon));
    const lonMin = Math.floor((Math.abs(calculator.lon) - lonDeg) * 60);
    
    console.log(`  Lat: ${latDeg}:${latMin.toString().padStart(2, '0')}${calculator.lat >= 0 ? 'N' : 'S'}`);
    console.log(`  Lon: ${lonDeg}:${lonMin.toString().padStart(2, '0')}${calculator.lon >= 0 ? 'E' : 'W'}`);
    
  } catch (error) {
    console.log(`Error calculating angles: ${error.message}`);
  }
  
  // Display full natal chart in Astrolog format
  console.log('\n=== FULL NATAL CHART (Astrolog Format) ===');
  console.log(`Astrolog 7.60 chart for ${astrologCoords.name}`);
  console.log(`Fri Jul 28, 2000  9:00am (ST Zone 7E) ${astrologCoords.birthLocation} ${astrologCoords.lon} ${astrologCoords.lat}`);
  console.log('Body  Locat. Ret. Lati. Rul.      House  Rul. Veloc.    Placidus Houses');
  
  Object.entries(natalChart).forEach(([planet, data]) => {
    if (planet === 'Ascendant' || planet === 'Midheaven') return; // Skip angles for now
    
    const degrees = Math.floor(data.longitude);
    const minutes = Math.floor((data.longitude - degrees) * 60);
    const retro = data.retrograde ? 'R' : ' ';
    const lat = data.latitude ? `${data.latitude > 0 ? '+' : ''}${data.latitude.toFixed(2)}` : '0.00';
    
    console.log(`${planet.padEnd(4)}: ${degrees.toString().padStart(2)}${data.sign.substring(0, 3)}${minutes.toString().padStart(2)}   ${retro} ${lat} (-) [-] +0.000`);
  });
  
  // Show Ascendant and Midheaven
  const asc = natalChart.Ascendant;
  const mc = natalChart.Midheaven;
  const ascDegrees = Math.floor(asc.longitude);
  const ascMinutes = Math.floor((asc.longitude - ascDegrees) * 60);
  const mcDegrees = Math.floor(mc.longitude);
  const mcMinutes = Math.floor((mc.longitude - mcDegrees) * 60);
  
  console.log(`Asce: ${ascDegrees.toString().padStart(2)}${asc.sign.substring(0, 3)}${ascMinutes.toString().padStart(2)}   + 0:00'     [ 1st house]     +362.5`);
  console.log(`Midh: ${mcDegrees.toString().padStart(2)}${mc.sign.substring(0, 3)}${mcMinutes.toString().padStart(2)}   + 0:00'     [10th house]     +332.0`);
}

// Add astronomical verification test
async function verifyAstronomicalPositions() {
  console.log('\n\n=== ASTRONOMICAL VERIFICATION ===\n');
  
  // Test date: July 28, 2000, 9:00 AM UTC+7 (2:00 AM UTC)
  const testDate = new Date('2000-07-28T02:00:00.000Z');
  
  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log('Checking astronomical positions against known values...\n');
  
  // Known astronomical positions for July 28, 2000 (from astronomical ephemeris)
  const knownPositions = {
    'Sun': { expected: '125.3°', description: 'Leo ~5°' },
    'Moon': { expected: '82.9°', description: 'Gemini ~23°' },
    'Mercury': { expected: '105.6°', description: 'Cancer ~15°' },
    'Venus': { expected: '138.1°', description: 'Leo ~18°' },
    'Mars': { expected: '117.4°', description: 'Cancer ~27°' },
    'Jupiter': { expected: '65.3°', description: 'Gemini ~5°' },
    'Saturn': { expected: '59.1°', description: 'Taurus ~29°' },
    'Uranus': { expected: '319.4°', description: 'Aquarius ~19°' },
    'Neptune': { expected: '305.2°', description: 'Aquarius ~5°' },
    'Pluto': { expected: '250.3°', description: 'Sagittarius ~10°' }
  };
  
  console.log('Planet    | Expected | Calculated | Diff | Status');
  console.log('----------|----------|------------|------|--------');
  
  Object.entries(knownPositions).forEach(([planet, known]) => {
    try {
      const calculated = getPlanetLongitude(testDate, planet);
      const diff = Math.abs(calculated - parseFloat(known.expected));
      const status = diff < 1 ? '✅' : diff < 5 ? '⚠️' : '❌';
      
      console.log(`${planet.padEnd(10)} | ${known.expected.padStart(7)} | ${calculated.toFixed(1).padStart(10)} | ${diff.toFixed(1).padStart(4)} | ${status}`);
    } catch (error) {
      console.log(`${planet.padEnd(10)} | ${known.expected.padStart(7)} | ERROR     | --- | ❌`);
    }
  });
  
  console.log('\n=== CONCLUSION ===');
  console.log('If our astronomical positions are correct (✅), then Astrolog may be using:');
  console.log('1. A different coordinate system (e.g., tropical vs sidereal)');
  console.log('2. A different epoch (e.g., J2000 vs B1950)');
  console.log('3. A different calculation method');
  console.log('4. A different time interpretation');
}

// Add a simple sidereal time test
async function testSiderealTime() {
  console.log('\n\n=== SIDEREAL TIME TEST ===\n');
  
  // Test date: July 28, 2000, 02:00 UTC
  const testDate = new Date('2000-07-28T02:00:00.000Z');
  const jd = 2451753.5833333335; // Julian Day for this date
  
  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log(`Julian Day: ${jd}`);
  
  // Test what siderealApparent actually returns
  const gstRaw = siderealApparent(jd);
  console.log(`\nsiderealApparent(${jd}) returns:`);
  console.log(`  Raw value: ${gstRaw}`);
  console.log(`  In degrees: ${gstRaw * 180 / Math.PI}°`);
  console.log(`  In hours: ${gstRaw * 12 / Math.PI} hours`);
  console.log(`  Modulo 2π: ${gstRaw % (2 * Math.PI)}`);
  console.log(`  Modulo 2π in degrees: ${(gstRaw % (2 * Math.PI)) * 180 / Math.PI}°`);
  
  // Expected GST for July 28, 2000, 02:00 UTC should be around 120° (8 hours)
  console.log(`\nExpected GST for July 28, 2000, 02:00 UTC:`);
  console.log(`  Should be around: 120° (8 hours)`);
  console.log(`  Our calculation: ${(gstRaw % (2 * Math.PI)) * 180 / Math.PI}°`);
  
  // Test with a known reference
  // For 2000-01-01 00:00 UTC, GST should be around 6.6 hours (99°)
  const jd2000 = 2451544.5;
  const gst2000 = siderealApparent(jd2000);
  console.log(`\nReference: GST for 2000-01-01 00:00 UTC:`);
  console.log(`  Julian Day: ${jd2000}`);
  console.log(`  Raw value: ${gst2000}`);
  console.log(`  In degrees: ${gst2000 * 180 / Math.PI}°`);
  console.log(`  Expected: ~99° (6.6 hours)`);
  
  console.log('\n=== END SIDEREAL TIME TEST ===\n');
}

// Add a focused Julian Day and sidereal time test
async function testJulianDayAndSidereal() {
  console.log('\n\n=== JULIAN DAY & SIDEREAL TIME TEST ===\n');
  
  // Test date: July 28, 2000, 02:00 UTC
  const testDate = new Date('2000-07-28T02:00:00.000Z');
  
  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log(`Expected Julian Day: ~2451753.5833333335`);
  
  // Test Julian Day calculation
  const jd = 2451753.5833333335; // This should match what your code calculates
  console.log(`\nJulian Day: ${jd}`);
  
  // Test sidereal time calculation
  const gstSeconds = siderealApparent(jd);
  const gstHours = gstSeconds / 3600;
  const gstDegrees = gstHours * 15;
  
  console.log(`\nSidereal Time Calculation:`);
  console.log(`  GST (seconds): ${gstSeconds}`);
  console.log(`  GST (hours): ${gstHours}`);
  console.log(`  GST (degrees): ${gstDegrees}°`);
  
  // Expected GST for July 28, 2000, 02:00 UTC should be around 8 hours (120°)
  console.log(`\nExpected GST for July 28, 2000, 02:00 UTC:`);
  console.log(`  Should be around: 8 hours (120°)`);
  console.log(`  Our calculation: ${gstHours.toFixed(2)} hours (${gstDegrees.toFixed(2)}°)`);
  console.log(`  Difference: ${Math.abs(gstHours - 8).toFixed(2)} hours`);
  
  // Test with a known reference date
  // For 2000-01-01 00:00 UTC, GST should be around 6.6 hours (99°)
  const jd2000 = 2451544.5;
  const gst2000Seconds = siderealApparent(jd2000);
  const gst2000Hours = gst2000Seconds / 3600;
  const gst2000Degrees = gst2000Hours * 15;
  
  console.log(`\nReference: GST for 2000-01-01 00:00 UTC:`);
  console.log(`  Julian Day: ${jd2000}`);
  console.log(`  GST (seconds): ${gst2000Seconds}`);
  console.log(`  GST (hours): ${gst2000Hours}`);
  console.log(`  GST (degrees): ${gst2000Degrees}°`);
  console.log(`  Expected: ~6.6 hours (99°)`);
  console.log(`  Difference: ${Math.abs(gst2000Hours - 6.6).toFixed(2)} hours`);
  
  console.log('\n=== END JULIAN DAY & SIDEREAL TIME TEST ===\n');
}

// Add a Julian Day verification test
async function testJulianDay() {
  console.log('\n\n=== JULIAN DAY VERIFICATION TEST ===\n');
  
  // Test date: July 28, 2000, 02:00 UTC
  const testDate = new Date('2000-07-28T02:00:00.000Z');
  
  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log(`Expected Julian Day: 2451753.5833333335`);
  
  // Calculate Julian Day using our function
  const jd = dateToJulianDay(testDate);
  console.log(`\nOur calculation:`);
  console.log(`  Julian Day: ${jd}`);
  console.log(`  Difference from expected: ${Math.abs(jd - 2451753.5833333335)}`);
  
  // Manual calculation for verification
  // July 28, 2000 = 2000-07-28
  // For 2000-07-28 02:00:00 UTC
  // JD = 2451544.5 + days since 2000-01-01 + time of day
  const daysSince2000 = 210; // July 28 is day 210 of 2000 (leap year)
  const timeOfDay = 2/24; // 2 hours = 2/24 of a day
  const manualJD = 2451544.5 + daysSince2000 + timeOfDay;
  
  console.log(`\nManual calculation:`);
  console.log(`  Days since 2000-01-01: ${daysSince2000}`);
  console.log(`  Time of day: ${timeOfDay} (${timeOfDay * 24} hours)`);
  console.log(`  Manual Julian Day: ${manualJD}`);
  console.log(`  Difference from our calculation: ${Math.abs(manualJD - jd)}`);
  
  // Test with a known reference: 2000-01-01 00:00 UTC should be JD 2451544.5
  const refDate = new Date('2000-01-01T00:00:00.000Z');
  const refJD = dateToJulianDay(refDate);
  console.log(`\nReference: 2000-01-01 00:00 UTC:`);
  console.log(`  Expected JD: 2451544.5`);
  console.log(`  Our calculation: ${refJD}`);
  console.log(`  Difference: ${Math.abs(refJD - 2451544.5)}`);
  
  // Test with a different approach - calculate days between 2000-01-01 and 2000-07-28
  const startDate = new Date('2000-01-01T00:00:00.000Z');
  const endDate = new Date('2000-07-28T02:00:00.000Z');
  const daysDiff = (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
  const alternativeJD = 2451544.5 + daysDiff;
  
  console.log(`\nAlternative calculation:`);
  console.log(`  Days between 2000-01-01 and 2000-07-28: ${daysDiff}`);
  console.log(`  Alternative Julian Day: ${alternativeJD}`);
  console.log(`  Difference from our calculation: ${Math.abs(alternativeJD - jd)}`);
  
  // Test what sidereal time should be with the correct JD
  const correctJD = 2451754.5833333335; // This is what it should be
  const gstCorrect = siderealApparent(correctJD);
  const gstCorrectHours = gstCorrect / 3600;
  const gstCorrectDegrees = gstCorrectHours * 15;
  
  console.log(`\nSidereal time with correct JD (${correctJD}):`);
  console.log(`  GST (seconds): ${gstCorrect}`);
  console.log(`  GST (hours): ${gstCorrectHours}`);
  console.log(`  GST (degrees): ${gstCorrectDegrees}°`);
  console.log(`  Expected: ~8 hours (120°)`);
  console.log(`  Difference: ${Math.abs(gstCorrectHours - 8)} hours`);
  
  console.log('\n=== END JULIAN DAY VERIFICATION TEST ===\n');
}

// Add a sidereal time verification test
async function testSiderealTimeVerification() {
  console.log('\n\n=== SIDEREAL TIME VERIFICATION TEST ===\n');
  
  // Test with a known reference: 2000-01-01 00:00 UTC
  // This should have GST around 6.6 hours (99°)
  const refDate = new Date('2000-01-01T00:00:00.000Z');
  const refJD = 2451544.5;
  
  console.log(`Reference Date: ${refDate.toISOString()}`);
  console.log(`Reference Julian Day: ${refJD}`);
  
  // Test siderealApparent with the reference date
  const gstRef = siderealApparent(refJD);
  const gstRefHours = gstRef / 3600;
  const gstRefDegrees = gstRefHours * 15;
  
  console.log(`\nSidereal time for 2000-01-01 00:00 UTC:`);
  console.log(`  GST (seconds): ${gstRef}`);
  console.log(`  GST (hours): ${gstRefHours}`);
  console.log(`  GST (degrees): ${gstRefDegrees}°`);
  console.log(`  Expected: ~6.6 hours (99°)`);
  console.log(`  Difference: ${Math.abs(gstRefHours - 6.6)} hours`);
  
  // Test with a different approach - use mean sidereal time
  // Let's try importing mean sidereal time function
  try {
    const siderealModule = await import('astronomia/sidereal');
    const gstMean = siderealModule.mean(refJD);
    const gstMeanHours = gstMean / 3600;
    const gstMeanDegrees = gstMeanHours * 15;
    
    console.log(`\nMean sidereal time for 2000-01-01 00:00 UTC:`);
    console.log(`  GST (seconds): ${gstMean}`);
    console.log(`  GST (hours): ${gstMeanHours}`);
    console.log(`  GST (degrees): ${gstMeanDegrees}°`);
    console.log(`  Expected: ~6.6 hours (99°)`);
    console.log(`  Difference: ${Math.abs(gstMeanHours - 6.6)} hours`);
  } catch (e) {
    console.log(`\nCould not import mean sidereal time: ${e.message}`);
  }
  
  // Test with July 28, 2000, 02:00 UTC using mean sidereal time
  const testDate = new Date('2000-07-28T02:00:00.000Z');
  const testJD = 2451753.5833333335;
  
  console.log(`\nTest Date: ${testDate.toISOString()}`);
  console.log(`Test Julian Day: ${testJD}`);
  
  const gstTest = siderealApparent(testJD);
  const gstTestHours = gstTest / 3600;
  const gstTestDegrees = gstTestHours * 15;
  
  console.log(`\nApparent sidereal time for July 28, 2000, 02:00 UTC:`);
  console.log(`  GST (seconds): ${gstTest}`);
  console.log(`  GST (hours): ${gstTestHours}`);
  console.log(`  GST (degrees): ${gstTestDegrees}°`);
  console.log(`  Expected: ~8 hours (120°)`);
  console.log(`  Difference: ${Math.abs(gstTestHours - 8)} hours`);
  
  // Try mean sidereal time for test date
  try {
    const siderealModule = await import('astronomia/sidereal');
    const gstTestMean = siderealModule.mean(testJD);
    const gstTestMeanHours = gstTestMean / 3600;
    const gstTestMeanDegrees = gstTestMeanHours * 15;
    
    console.log(`\nMean sidereal time for July 28, 2000, 02:00 UTC:`);
    console.log(`  GST (seconds): ${gstTestMean}`);
    console.log(`  GST (hours): ${gstTestMeanHours}`);
    console.log(`  GST (degrees): ${gstTestMeanDegrees}°`);
    console.log(`  Expected: ~8 hours (120°)`);
    console.log(`  Difference: ${Math.abs(gstTestMeanHours - 8)} hours`);
  } catch (e) {
    console.log(`\nCould not import mean sidereal time: ${e.message}`);
  }
  
  console.log('\n=== END SIDEREAL TIME VERIFICATION TEST ===\n');
}

// Run all debug functions
debugVNIndex().then(() => debugAstrologComparison()).then(() => verifyAstronomicalPositions()).then(() => testSiderealTime()).then(() => testJulianDayAndSidereal()).then(() => testJulianDay()).then(() => testSiderealTimeVerification()).then(() => {
  console.log('\n\n=== DEBUG: Longitude and Zodiac Test ===\n');
  
  // Test longitude and zodiac sign calculations
  const testDate = new Date('2000-07-28T02:00:00.000Z');
  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log(`Expected Sun position: ~125° (Leo)`);
  
  const sunLon = getPlanetLongitude(testDate, 'Sun');
  const sunSign = getZodiacSign(sunLon);
  const sunDegree = getDegreeInSign(sunLon);
  console.log(`Sun: ${sunLon.toFixed(2)}° ${sunSign} ${sunDegree.toFixed(1)}°`);
  console.log(`Expected: ~125° Leo ~5°`);
  console.log(`Difference: ${Math.abs(sunLon - 125).toFixed(2)}°`);
  
  // Test zodiac sign function
  console.log('\n=== ZODIAC SIGN TEST ===');
  const testLongitudes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const expectedSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  testLongitudes.forEach((lon, i) => {
    const sign = getZodiacSign(lon);
    const expected = expectedSigns[i];
    const status = sign === expected ? '✓' : '✗';
    console.log(`  ${lon}° → ${sign.padEnd(12)} (expected: ${expected.padEnd(12)}) ${status}`);
  });
  
  // Test specific longitudes from Astrolog output
  console.log('\n=== SPECIFIC LONGITUDE TEST ===');
  const astrologLongitudes = [
    { lon: 125, expected: 'Leo', expectedDeg: 5 },
    { lon: 82, expected: 'Gemini', expectedDeg: 22 },
    { lon: 105, expected: 'Cancer', expectedDeg: 15 },
    { lon: 138, expected: 'Leo', expectedDeg: 18 },
    { lon: 117, expected: 'Cancer', expectedDeg: 27 },
    { lon: 65, expected: 'Gemini', expectedDeg: 5 },
    { lon: 59, expected: 'Taurus', expectedDeg: 29 },
    { lon: 319, expected: 'Aquarius', expectedDeg: 19 },
    { lon: 305, expected: 'Aquarius', expectedDeg: 5 },
    { lon: 250, expected: 'Sagittarius', expectedDeg: 10 }
  ];
  
  astrologLongitudes.forEach(({ lon, expected, expectedDeg }) => {
    const sign = getZodiacSign(lon);
    const degree = getDegreeInSign(lon);
    const signStatus = sign === expected ? '✓' : '✗';
    const degStatus = Math.abs(degree - expectedDeg) < 1 ? '✓' : '✗';
    console.log(`  ${lon}° → ${sign.padEnd(12)} ${degree.toFixed(1)}° (expected: ${expected.padEnd(12)} ${expectedDeg}°) ${signStatus}${degStatus}`);
  });
  
  console.log('\n=== END DEBUG ===');
}).catch(error => {
  console.error('Error in debug chain:', error);
});