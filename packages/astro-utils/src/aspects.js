// aspects.js
// Utility functions to compute astrological aspects between planetary positions.

import { ASPECTS, PLANETS } from './constants.js';
import { getPlanetLongitude } from './natal.js';
import { getPlanetRetrogrades } from './events.js';

/**
 * Normalize an angle to the range [0, 360).
 * @param {number} angle – Angle in degrees.
 * @returns {number} Normalized angle.
 */
function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

/**
 * Calculate the angular separation between two longitudes.
 * @param {number} long1 – First longitude in degrees.
 * @param {number} long2 – Second longitude in degrees.
 * @returns {number} Angular separation in degrees.
 */
export function calculateAngularSeparation(long1, long2) {
  const a1 = normalizeAngle(long1);
  const a2 = normalizeAngle(long2);
  const diff = Math.abs(a1 - a2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Find the closest aspect between two longitudes.
 * @param {number} lon1 – Longitude of the first body (degrees).
 * @param {number} lon2 – Longitude of the second body (degrees).
 * @param {number} orbMultiplier – Multiplier for orb allowances (default 1).
 * @param {string} planet1 – Name of the first planet (for custom orb lookup).
 * @returns {Object|null} Best aspect match or null if none.
 */
export function findBestAspect(lon1, lon2, orbMultiplier = 1, planet1) {
  const a1 = normalizeAngle(lon1);
  const a2 = normalizeAngle(lon2);
  const rawDiff = Math.abs(a1 - a2);
  const separation = rawDiff > 180 ? 360 - rawDiff : rawDiff;

  let bestAspect = null;
  let smallestDeviation = Infinity;
  const customOrbs = PLANETS[planet1]?.orb || {};

  for (const { name, angle: aspAngle, orb: baseOrb, polarity } of ASPECTS) {
    const maxOrb = (customOrbs[name] ?? baseOrb) * orbMultiplier;
    const deviation = Math.abs(separation - aspAngle);

    if (deviation <= maxOrb && deviation < smallestDeviation) {
      smallestDeviation = deviation;
      bestAspect = {
        name,
        angle: aspAngle,
        deviation,
        maxOrb,
        polarity,
        exact: deviation === 0
      };
      if (deviation === 0) break;  // exact match—no need to search further
    }
  }

  return bestAspect;
}

/**
 * Calculate the significance score of an aspect.
 * @param {string} transitPlanet – Name of the transit planet.
 * @param {string} natalPoint – Name of the natal point.
 * @param {Object} aspect – Aspect object from findBestAspect().
 * @param {boolean} isRetrograde – Whether the transit planet is retrograde.
 * @param {string} rulingPlanet – Ruling planet of the chart.
 * @param {Object} planetWeights – Map of planet names to weight objects.
 * @returns {number} Significance score.
 */
export function calculateAspectScore(
  transitPlanet,
  natalPoint,
  aspect,
  isRetrograde,
  rulingPlanet,
  planetWeights
) {
  let score = 0;

  // 1) Base score from aspect polarity
  score += Math.abs(aspect.polarity) * 2;

  // 2) Planet weights
  if (planetWeights[transitPlanet]) score += planetWeights[transitPlanet].weight;
  if (planetWeights[natalPoint])   score += planetWeights[natalPoint].weight;

  // 3) Ruling-planet bonus
  if (transitPlanet === rulingPlanet) score += 2.5;

  // 4) Retrograde bonus
  if (isRetrograde) score += 1.0;

  // 5) Orb tightness adjustment (tighter = more significant)
  // Guard against division by zero just in case
  if (aspect.maxOrb > 0) {
    score += 1 - (aspect.deviation / aspect.maxOrb);
  }

  return score;
}

/**
 * Check if two longitudes form a given aspect within orb.
 * @param {number} long1 – First longitude.
 * @param {number} long2 – Second longitude.
 * @param {number} aspectAngle – Target aspect angle.
 * @param {number} orb – Orb allowance.
 * @returns {boolean}
 */
export function isWithinOrb(long1, long2, aspectAngle, orb) {
  const sep = calculateAngularSeparation(long1, long2);
  return Math.abs(sep - aspectAngle) <= orb;
}

/**
 * Compute all unique aspects between planetary positions.
 * @param {Object} positions – Map of planet names to longitudes.
 * @param {number} orbMultiplier – Multiplier for orb allowances (default 1).
 * @returns {Array<Object>} List of aspect entries.
 */
export function getAllAspects(positions, orbMultiplier = 1) {
  const entries = Object.entries(positions);
  const results = [];

  for (let i = 0; i < entries.length; i++) {
    const [planet1, lon1] = entries[i];
    for (let j = i + 1; j < entries.length; j++) {
      const [planet2, lon2] = entries[j];
      const aspect = findBestAspect(lon1, lon2, orbMultiplier, planet1);
      if (aspect) {
        results.push({
          planet1,
          planet2,
          longitude1: lon1,
          longitude2: lon2,
          ...aspect
        });
      }
    }
  }

  return results;
}

/**
 * Group consecutive aspect events into windows.
 * @param {Array<Object>} rawEvents – Array of events with { date, planet1, planet2, name, deviation, maxOrb }.
 * @returns {Array<Object>} Array of windows with startDate, endDate, peakDate, etc.
 */
export function computeAspectWindows(rawEvents) {
  if (!rawEvents.length) return [];

  // Parse timestamps and sort chronologically
  const events = rawEvents
    .map(e => ({ ...e, ts: new Date(e.date).getTime() }))
    .sort((a, b) => a.ts - b.ts);

  const windows = [];
  let win = null;

  for (const ev of events) {
    if (!win) {
      win = createWindow(ev);
    } else {
      const dayGap = (ev.ts - win.endTs) / (1000 * 60 * 60 * 24);
      if (sameAspect(ev, win) && dayGap <= 1) {
        extendWindow(win, ev);
      } else {
        windows.push(finalizeWindow(win));
        win = createWindow(ev);
      }
    }
  }

  windows.push(finalizeWindow(win));
  return windows;
}

// ——— Helpers for computeAspectWindows ———

function createWindow(ev) {
  return {
    planet1:     ev.planet1,
    planet2:     ev.planet2,
    aspect:      ev.name,
    startDate:   ev.date,
    endDate:     ev.date,
    peakDate:    ev.date,
    peakDeviation: ev.deviation,
    maxOrb:      ev.maxOrb,
    endTs:       ev.ts
  };
}

function sameAspect(ev, win) {
  return (
    ev.planet1 === win.planet1 &&
    ev.planet2 === win.planet2 &&
    ev.name    === win.aspect
  );
}

function extendWindow(win, ev) {
  win.endDate = ev.date;
  win.endTs   = ev.ts;
  if (ev.deviation < win.peakDeviation) {
    win.peakDeviation = ev.deviation;
    win.peakDate      = ev.date;
  }
}

function finalizeWindow(win) {
  const {
    planet1,
    planet2,
    aspect,
    startDate,
    endDate,
    peakDate,
    peakDeviation,
    maxOrb
  } = win;
  return { planet1, planet2, aspect, startDate, endDate, peakDate, peakDeviation, maxOrb };
}

/**
 * Get planet longitude with caching for performance
 * @param {Date} date - Date to calculate
 * @param {string} planet - Planet name
 * @returns {number} Longitude in degrees
 */
function getCachedLongitude(date, planet) {
  return getPlanetLongitude(date, planet);
}

/**
 * Add days to a date
 * @param {Date} date - Base date
 * @param {number} days - Days to add
 * @returns {Date} New date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get planetary aspects for a specific year
 * @param {number} year - Year to calculate
 * @param {string} planetA - First planet
 * @param {string} planetB - Second planet
 * @param {number} angle - Aspect angle in degrees
 * @param {number} tol - Tolerance in degrees (default: 1)
 * @returns {Array} Array of aspect events
 */
export function getPlanetAspect(year, planetA, planetB, angle, tol = 1) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));

  for (let dt = new Date(start); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    const a = getCachedLongitude(dt, planetA);
    const b = getCachedLongitude(dt, planetB);
    const diff = Math.abs(((a - b + 360) % 360) - angle);
    if (diff < tol) {
      res.push({
        type: 'aspect',
        title: `${angle}° Aspect between ${planetA} and ${planetB}`,
        description: (planetA === 'mars' && planetB === 'mercury' && angle === 161)
          ? 'Short-term price increase and before increase there is rejection'
          : 'Aspect',
        startDate: new Date(dt),
        endDate: addDays(dt, 1)
      });
    }
  }
  return res;
}

/**
 * Get Venus retrograde conjunct Mercury direct events
 * @param {number} year - Year to calculate
 * @returns {Array} Array of aspect events
 */
export function getVenusRetrogradeConjunctMercuryDirect(year) {
  const res = [];
  const start = new Date(Date.UTC(year, 0, 1));
  
  // Get Venus retrograde periods
  const venusRetrograde = getPlanetRetrogrades(year, 'venus', 'Venus Retrograde');
  
  for (let dt = new Date(start); dt <= new Date(Date.UTC(year + 1, 0, 1)); dt = addDays(dt, 1)) {
    // Check if Venus is retrograde on this date
    const isVenusRetrograde = venusRetrograde.some(period => 
      dt >= period.startDate && dt <= period.endDate
    );
    
    if (isVenusRetrograde) {
      // Check if Mercury is direct (not retrograde)
      const isMercuryDirect = !getPlanetRetrogrades(year, 'mercury', 'Mercury Retrograde')
        .some(period => dt >= period.startDate && dt <= period.endDate);
      
      if (isMercuryDirect) {
        // Check for conjunction between Venus and Mercury
        const venusLon = getCachedLongitude(dt, 'venus');
        const mercuryLon = getCachedLongitude(dt, 'mercury');
        const diff = Math.abs((venusLon - mercuryLon + 360) % 360);
        
        if (diff < 1 || diff > 359) { // Within 1 degree
          res.push({
            type: 'aspect',
            title: 'venus retrograde conjunct mercury direct',
            description: 'Strong market increase for 5-8 days, then creates peak and drops sharply',
            startDate: new Date(dt),
            endDate: addDays(dt, 1)
          });
        }
      }
    }
  }
  return res;
}

/**
 * Get all major aspects for a year
 * @param {number} year - Year to calculate
 * @returns {Array} Array of all aspect events
 */
export function getAllAspectsForYear(year) {
  const aspects = [
    ...getPlanetAspect(year, 'mars', 'mercury', 161),
    ...getVenusRetrogradeConjunctMercuryDirect(year)
  ];
  
  return aspects.sort((a, b) => a.startDate - b.startDate);
}
