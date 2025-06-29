import { getPlanetLongitude, getPlanetLatitude, getPlanetDeclination, getSunDeclination } from './natal.js';
import moonphase from 'astronomia/moonphase';
import solstice from 'astronomia/solstice';
import { addDays, dateToJulianDay, julianDayToDate } from './helper.js';
import { getPlanetAspect, getVenusRetrogradeConjunctMercuryDirect } from './aspects.js';

// --- Caches for repeated astro calls -------------
const lonCache = new Map();
const latCache = new Map();
function getCachedLongitude(date, planet) {
  const key = `${planet}-${date.toISOString().slice(0, 10)}`;
  if (lonCache.has(key)) return lonCache.get(key);
  const val = getPlanetLongitude(date, planet);
  lonCache.set(key, val);
  return val;
}
function getCachedLatitude(date, planet) {
  const key = `${planet}-lat-${date.toISOString().slice(0, 10)}`;
  if (latCache.has(key)) return latCache.get(key);
  const val = getPlanetLatitude(date, planet);
  latCache.set(key, val);
  return val;
}

// --- Moon phase finder -------------------------
// mean synodic month in days
const SYNODIC_MONTH = 29.530588861;
// Reference epoch: k=0 at JD 2451550.09765 (2000 Jan 6.0)
const EPOCH_JD = 2451550.09765;
// approximate k at or just before your date
function getNextPhaseJde(phaseFn, date) {
  const jd0 = dateToJulianDay(date);
  let k = Math.floor((jd0 - EPOCH_JD) / SYNODIC_MONTH);
  let jde = phaseFn(k);

  // bump k until we find the first JDE strictly after jd0
  while (jde <= jd0) {
    k++;
    jde = phaseFn(k);
  }
  return jde;
}
export function getNextNewMoon(date) {
  return julianDayToDate(getNextPhaseJde(moonphase.newMoon, date));
}

export function getNextFirstQuarter(date) {
  return julianDayToDate(getNextPhaseJde(moonphase.first, date));
}

export function getNextFullMoon(date) {
  return julianDayToDate(getNextPhaseJde(moonphase.full, date));
}

export function getNextLastQuarter(date) {
  return julianDayToDate(getNextPhaseJde(moonphase.last, date));
}
// --- Generic collector --------------------------
function collectEvents(eventGen, startYear, endYear) {
  const out = [];
  for (let y = startYear; y <= endYear; y++) {
    out.push(...eventGen(y));
  }
  return out;
}

// --- Moon Phases over range ---------------------
export function getMoonPhases(startDate, endDate, phaseDurations = {}) {
  const phases = [
    { name: 'new-moon', fn: moonphase.newMoon },
    { name: 'first-quarter', fn: moonphase.first },
    { name: 'full-moon', fn: moonphase.full },
    { name: 'last-quarter', fn: moonphase.last }
  ];
  const MS_PER_HOUR = 3600 * 1000;
  const MS_PER_DAY = 24 * MS_PER_HOUR;
  // Default durations (ms) if not overridden
  const defaultDurations = {
    'new-moon': 1 * MS_PER_DAY,   // 1 day
    'first-quarter': 1 * MS_PER_DAY,   // 1 day
    'full-moon': 2 * MS_PER_DAY,   // 2 days (48 hours)
    'last-quarter': 1 * MS_PER_DAY    // 1 day
  };

  const getDuration = name =>
    // user-supplied override, or default, or fall back to 48h
    phaseDurations[name] ?? defaultDurations[name] ?? 2 * MS_PER_DAY;

  const events = [];
  let cursor = new Date(startDate);

  while (cursor <= endDate) {
    const candidates = phases
      .map(({ name, fn }) => {
        const jd = getNextPhaseJde(fn, cursor);
        const date = julianDayToDate(jd);
        return (date > cursor && date <= endDate)
          ? { name, date }
          : null;
      })
      .filter(Boolean);

    if (candidates.length === 0) break;

    // pick the earliest upcoming phase
    const next = candidates.reduce((a, b) => a.date < b.date ? a : b);
    events.push(next);

    // advance cursor just past this phase moment
    cursor = new Date(next.date.getTime() + 1000);
  }

  return events
    .map(e => {
      const titleMap = {
        'new-moon': 'New Moon',
        'first-quarter': 'First Quarter Moon',
        'full-moon': 'Full Moon',
        'last-quarter': 'Last Quarter Moon'
      };
      const descMap = {
        'new-moon': 'Time for new beginnings.',
        'first-quarter': 'Building momentum.',
        'full-moon': 'Emotions reach peak.',
        'last-quarter': 'Release and let go.'
      };
      const durationMs = getDuration(e.name);

      return {
        type: e.name,
        title: titleMap[e.name],
        description: descMap[e.name],
        startDate: e.date,
        endDate: new Date(e.date.getTime() + durationMs)
      };
    })
    .sort((a, b) => a.startDate - b.startDate);
}

// --- Equinoxes & Solstices ----------------------
export function getEquinoxesSolstices(startDate, endDate) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const sy = startDate.getUTCFullYear();
  const ey = endDate.getUTCFullYear();
  const gen = year => [
    ['Spring Equinox', solstice.march(year), 'Sun enters Aries.'],
    ['Summer Solstice', solstice.june(year), 'Longest day.'],
    ['Autumn Equinox', solstice.september(year), 'Balance point.'],
    ['Winter Solstice', solstice.december(year), 'Shortest day.']
  ].map(([title, jd, desc]) => ({
    type: 'season',
    title,
    description: desc,
    date: julianDayToDate(jd),
    startDate: julianDayToDate(jd),
    endDate: new Date(julianDayToDate(jd).getTime() + 2 * 86400e3)
  })).filter(e => e.date.getUTCFullYear() === year);

  return collectEvents(gen, sy, ey)
    .filter(e => e.date >= startDate && e.date <= endDate)
    .sort((a, b) => a.date - b.date);
}

// --- Minor Seasons (Cross-Quarter) ---------------
export function getMinorSeasons(startDate, endDate) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const sy = startDate.getUTCFullYear();
  const ey = endDate.getUTCFullYear();
  const gen = year => {
    const base = [solstice.march, solstice.june, solstice.september, solstice.december];
    return base.map((fn, i) => {
      const delta = (i % 2 === 0 ? -45 : +45);
      const jd = fn(year) + delta;
      return {
        type: 'minor-season',
        title: 'Cross-Quarter Day',
        description: i % 2 === 0
          ? 'Midpoint Winter–Spring.'
          : 'Midpoint Summer–Autumn.',
        date: julianDayToDate(jd),
        startDate: julianDayToDate(jd),
        endDate: new Date(julianDayToDate(jd).getTime() + 2 * 86400e3)
      };
    }).filter(e => e.date.getUTCFullYear() === year);
  };

  return collectEvents(gen, sy, ey)
    .filter(e => e.date >= startDate && e.date <= endDate)
    .sort((a, b) => a.date - b.date);
}

// --- Planetary event generators -----------------
export function getPlanetRetrogrades(year, planet, title) {
  const res = [];
  const type = 'retrograde';
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  let prevLon = getCachedLongitude(start, planet);
  let inR = false;
  let st = null;

  for (let dt = new Date(start); dt <= end; dt = addDays(dt, 1)) {
    const lon = getCachedLongitude(dt, planet);
    let diff = (lon - prevLon + 360) % 360;
    if (diff > 180) diff -= 360;
    const retro = diff < 0;

    if (retro && !inR) {
      inR = true;
      st = new Date(dt);
    }
    else if (!retro && inR) {
      // retro just ended: last retro day is dt − 1
      res.push({
        type,
        title,
        description: planet === 'mercury'
          ? 'RETROGRADE; usually at short‐term peaks/bottoms'
          : title,
        startDate: st,
        endDate: addDays(dt, -1)
      });
      inR = false;
    }

    prevLon = lon;
  }

  // if still in retro at year-end, close it out
  if (inR) {
    res.push({
      type,
      title,
      description: planet === 'mercury'
        ? 'RETROGRADE; usually at short‐term peaks/bottoms'
        : title,
      startDate: st,
      endDate: end      // or addDays(end, -1) if you want Dec 31
    });
  }

  return res;
}

export function getVenusLatitudeExtremes(year) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));
  let prevLat = getCachedLatitude(start, 'venus');
  let prevDir = null;

  for (let dt = addDays(start, 1); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    const lat = getCachedLatitude(dt, 'venus');
    const dir = lat > prevLat ? 1 : -1;
    if (prevDir !== null && dir !== prevDir) {
      const p = addDays(dt, -1);
      res.push({
        type: 'latitude',
        title: `Venus Latitude Extreme (${prevDir > 0 ? 'North' : 'South'})`,
        description: 'REVERSAL',
        startDate: p,
        endDate: addDays(p, 1)
      });
    }
    prevLat = lat;
    prevDir = dir;
  }
  return res;
}

export function getMercurySpeedThreshold(year) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));
  let prev = getCachedLongitude(start, 'mercury');

  for (let dt = addDays(start, 1); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    const lon = getCachedLongitude(dt, 'mercury');
    const speed = Math.abs((lon - prev + 360) % 360);
    
    if (speed >= 0.59 && speed < 1.58) {
      res.push({
        type: 'speed-threshold',
        title: 'Mercury Speed ≥0.59°',
        description: 'PEAK or BOTTOM (Pivot) usually appears',
        startDate: new Date(dt),
        endDate: addDays(dt, 1)
      });
    } else if (speed >= 1.58) {
      res.push({
        type: 'speed-threshold',
        title: 'Mercury Speed ≥1.58°',
        description: 'PEAK or BOTTOM (Pivot) usually appears',
        startDate: new Date(dt),
        endDate: addDays(dt, 1)
      });
    }
    
    prev = lon;
  }
  return res;
}

export function getVenusSunDeclinationParallel(year) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));
  let inP = false;
  let st = null;

  for (let dt = new Date(start); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    const vDec = getPlanetDeclination(dt, 'venus');
    const sDec = getSunDeclination(dt);
    const diff = Math.abs(vDec - sDec);
    if (diff < 0.5 && !inP) {
      inP = true;
      st = new Date(dt);
    } else if (diff >= 0.5 && inP) {
      res.push({
        type: 'conjunction',
        title: 'Venus Parallel Sun',
        description: 'REVERSAL',
        startDate: st,
        endDate: new Date(dt)
      });
      inP = false;
    }
  }
  return res;
}

export function getPlanetAtFixedDegree(year, planet, target, tol = 0.5) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));
  let prev = getCachedLongitude(start, planet);

  for (let dt = addDays(start, 1); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    const lon = getCachedLongitude(dt, planet);
    const crossed = (prev < target - tol && lon >= target - tol && lon <= target + tol)
      || (prev > target + tol && lon <= target + tol && lon >= target - tol);
    if (crossed) {
      res.push({
        type: 'fixed-degree',
        title: `${planet} at ${target}°`,
        description: 'REVERSAL',
        startDate: new Date(dt),
        endDate: addDays(dt, 1)
      });
    }
    prev = lon;
  }
  return res;
}

export function getPlanetSunConjunction(year, planet, tol = 0.5) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));

  for (let dt = new Date(start); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    const p = getCachedLongitude(dt, planet);
    const s = getCachedLongitude(dt, 'sun');
    const diff = Math.abs((p - s + 360) % 360);
    if (diff < tol || diff > 360 - tol) {
      res.push({
        type: 'cazimi',
        title: `${planet} Conjunct Sun`,
        description: planet === 'mercury' ? 'REVERSAL' : 'CREATES PEAK',
        startDate: new Date(dt),
        endDate: addDays(dt, 1)
      });
    }
  }
  return res;
}

export function getRetrogradeMidpoints(retroEvents, planet) {
  return retroEvents.flatMap(ev => {
    const s = getCachedLongitude(ev.startDate, planet);
    const e = getCachedLongitude(ev.endDate, planet);
    const mid = (s + ((e - s + 360) % 360) / 2) % 360;

    for (let dt = new Date(ev.startDate); dt <= ev.endDate; dt = addDays(dt, 1)) {
      const lon = getCachedLongitude(dt, planet);
      if (Math.abs(((lon - mid + 360) % 360)) < 0.5) {
        return [{
          type: 'pivot',
          title: `${planet} Midpoint`,
          description: 'CREATES BOTTOM',
          startDate: new Date(dt),
          endDate: addDays(dt, 1)
        }];
      }
    }
    return [];
  });
}

/**
 * Merge only truly overlapping windows.
 *
 * @param {Array<Object>} events
 *   Each event must have `type`, `title`, `startDate`, `endDate`.
 */
export function mergeConsecutive(events) {
  const sorted = events
    .slice()
    .sort((a, b) => a.startDate - b.startDate);

  const out = [];
  for (const e of sorted) {
    if (!out.length) {
      out.push({ ...e });
      continue;
    }

    const last = out[out.length - 1];
    // only merge if the new window actually starts on or before the last one ends
    if (
      e.type === last.type &&
      e.title === last.title &&
      e.startDate.getTime() <= last.endDate.getTime()
    ) {
      // extend the end to cover any overhang
      last.endDate = new Date(
        Math.max(last.endDate.getTime(), e.endDate.getTime())
      );
    } else {
      out.push({ ...e });
    }
  }

  return out;
}

// --- Aggregate all events for a year --------------
export function getAllEventsForYear(year) {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  // const moon = getMoonPhases(start, end); // COMMENTED OUT - not in specific list
  // const seq = getEquinoxesSolstices(start, end); // COMMENTED OUT - not in specific list
  // const minorSeq = getMinorSeasons(start, end); // COMMENTED OUT - not in specific list

  const mR = getPlanetRetrogrades(year, 'mercury', 'Mercury Retrograde');
  // const hR = getPlanetRetrogrades(year, 'mars', 'Mars Retrograde'); // COMMENTED OUT - not in specific list
  // const jR = getPlanetRetrogrades(year, 'jupiter', 'Jupiter Retrograde'); // COMMENTED OUT - not in specific list
  // const nR = getPlanetRetrogrades(year, 'neptune', 'Neptune Retrograde'); // COMMENTED OUT - not in specific list
  // const vR = getPlanetRetrogrades(year, 'venus', 'Venus Retrograde'); // COMMENTED OUT - not in specific list

  const vLa = getVenusLatitudeExtremes(year);
  const mSp = getMercurySpeedThreshold(year);
  const vPar = getVenusSunDeclinationParallel(year);

  const mCon = getPlanetSunConjunction(year, 'mercury');
  const vCon = getPlanetSunConjunction(year, 'venus');

  const mMid = getRetrogradeMidpoints(mR, 'mercury');
  // const vMid = getRetrogradeMidpoints(vR, 'venus'); // COMMENTED OUT - not in specific list

  const fxd = [
    ...getPlanetAtFixedDegree(year, 'mercury', 105), // 15° Cancer
    ...getPlanetAtFixedDegree(year, 'mercury', 229), // 19° Scorpio
    ...getPlanetAtFixedDegree(year, 'mercury', 294), // 24° Capricorn
    ...getPlanetAtFixedDegree(year, 'mercury', 299), // 19° Sagittarius
    ...getPlanetAtFixedDegree(year, 'mars', 15),     // 15° Aries
    ...getPlanetAtFixedDegree(year, 'mars', 165),    // 15° Virgo
    ...getPlanetAtFixedDegree(year, 'mars', 195),    // 15° Cancer
    ...getPlanetAtFixedDegree(year, 'mars', 225),    // 15° Scorpio
    ...getPlanetAtFixedDegree(year, 'mars', 106),    // 16° Cancer
    ...getPlanetAtFixedDegree(year, 'venus', 130)    // 10° Leo (Heliocentric)
  ];

  const asp = [
    ...getPlanetAspect(year, 'mars', 'mercury', 161),
    ...getVenusRetrogradeConjunctMercuryDirect(year)
  ];

  const events = [
    // ...moon, // COMMENTED OUT - not in specific list
    // ...seq, // COMMENTED OUT - not in specific list
    // ...minorSeq, // COMMENTED OUT - not in specific list
    ...mR, // Mercury Retrograde - ĐẢO CHIỀU
    // ...hR, // Mars Retrograde - COMMENTED OUT (not in specific list)
    // ...jR, // Jupiter Retrograde - COMMENTED OUT
    // ...nR, // Neptune Retrograde - COMMENTED OUT
    // ...vR, // Venus Retrograde - COMMENTED OUT (not in specific list)
    ...vLa, // Venus Latitude Extremes - ĐẢO CHIỀU
    ...mSp, // Mercury Speed Threshold - ĐỈNH hoặc ĐÁY (Pivot)
    ...vPar, // Venus Parallel Sun - ĐẢO CHIỀU
    ...mCon, // Mercury Conjunct Sun - ĐẢO CHIỀU (những con sóng nhỏ)
    ...vCon, // Venus Conjunct Sun - TẠO ĐỈNH
    ...mMid, // Mercury Midpoint - TẠO ĐÁY
    // ...vMid, // Venus Midpoint - COMMENTED OUT (not in specific list)
    ...fxd, // Fixed degree events
    ...asp  // Aspect events
  ];

  events.sort((a, b) => a.startDate - b.startDate);
  return mergeConsecutive(events);
}
