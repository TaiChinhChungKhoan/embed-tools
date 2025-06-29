import { getPlanetLongitude, getPlanetLatitude } from './natal.js';
import { findBestAspect, calculateAspectScore } from './aspects.js';
import { PLANETS, SIGNIFICANCE_THRESHOLD } from './constants.js';
import { daysDiff, dateToJulianDay, julianDayToDate } from './helper.js';


const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

/**
 * Get zodiac sign from normalized longitude
 * @param {number} normLon - longitude in [0,360)
 * @returns {string}
 */
function getZodiacSign(normLon) {
  const idx = Math.floor(normLon / 30) % 12;
  return SIGNS[idx];
}

/**
 * Get degree within its zodiac sign
 * @param {number} normLon - longitude in [0,360)
 * @returns {number}
 */
function getDegreeInSign(normLon) {
  return normLon % 30;
}

/**
 * Calculate transit positions for a given Date.
 */
export function calculateTransitPositions(date, planets) {
  const positions = {};
  // “Yesterday” for retrograde check
  const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);

  for (const planet of planets) {
    try {
      // 1) Raw longitudes
      const currLonRaw = getPlanetLongitude(date, planet);
      const prevLonRaw = getPlanetLongitude(prevDate, planet);

      // 2) Retrograde?
      let diff = (currLonRaw - prevLonRaw + 360) % 360;
      if (diff > 180) diff -= 360;
      const retrograde = diff < 0;

      // 3) Latitude
      const latitude = getPlanetLatitude(date, planet);

      // 4) Normalize + sign/degree
      const normLon = (currLonRaw % 360 + 360) % 360;
      const sign    = getZodiacSign(normLon);
      const degree  = Math.round(getDegreeInSign(normLon) * 10) / 10;

      positions[planet] = {
        longitude: normLon,
        latitude,
        sign,
        degree,
        retrograde
      };
    } catch (err) {
      console.warn(`Transit calc failed for ${planet}:`, err.message);
    }
  }

  return positions;
}

/**
 * Calculate transit events and retrograde days between two dates.
 *
 * @param {Date}   startDate       - inclusive start
 * @param {Date}   endDate         - inclusive end
 * @param {Object} natalChart      - natal positions keyed by point
 * @param {string[]} transitPlanets
 * @param {string[]} natalPoints
 * @param {number} orbDays         - orb allowance (days)
 * @param {number} minScore        - significance threshold
 * @param {string|null} rulingPlanet
 * @returns {{ events: Object[], retroDays: Object[] }}
 */
export function calculateTransits(
  startDate,
  endDate,
  natalChart,
  transitPlanets,
  natalPoints,
  orbDays = 1,
  minScore = SIGNIFICANCE_THRESHOLD,
  rulingPlanet = null
) {
  const events   = [];
  const retroDays = [];

  // Convert start/end to Julian Days
  let currentJd = dateToJulianDay(startDate);
  const endJd   = dateToJulianDay(endDate);

  while (currentJd <= endJd) {
    const currentDate = julianDayToDate(currentJd);
    const transits    = calculateTransitPositions(currentDate, transitPlanets);

    // 1) Aspect events
    for (const tp of transitPlanets) {
      const tpos = transits[tp];
      if (!tpos) continue;

      for (const np of natalPoints) {
        const natalPos = natalChart[np];
        if (!natalPos) continue;

        const aspect = findBestAspect(
          tpos.longitude,
          natalPos.longitude,
          orbDays,
          /* aspectsList? */ PLANETS,
          tp
        );
        if (!aspect) continue;

        const score = calculateAspectScore(
          tp,
          np,
          aspect,
          tpos.retrograde,
          rulingPlanet,
          PLANETS
        );
        if (score < minScore) continue;

        events.push({
          date:       new Date(currentDate),
          transitPlanet: tp,
          natalPoint:    np,
          aspect,
          score,
          type:      'transit',
          title:     `${tp} ${aspect.name} ${np}`,
          description:`${aspect.interpretation} Score: ${score.toFixed(1)}`
        });
      }
    }

    // 2) Retrograde days
    for (const planet of transitPlanets) {
      const p = transits[planet];
      if (p && p.retrograde) {
        retroDays.push({
          date:   new Date(currentDate),
          planet,
          type:   'retrograde'
        });
      }
    }

    currentJd += 1;  // step one day
  }

  return { events, retroDays };
}

/**
 * Group individual retrograde days into contiguous windows.
 *
 * @param {Array<{date:Date,planet:string}>} retroDays
 * @returns {Array<{planet:string,startDate:Date,endDate:Date,days:number}>}
 */
export function computeRetrogradeWindows(retroDays) {
  const windows = [];
  let currentWindow = null;

  retroDays.forEach(({ date: d, planet }) => {
    if (!currentWindow) {
      currentWindow = {
        planet,
        startDate: new Date(d),
        endDate:   new Date(d),
        days:      1
      };
    } else {
      const samePlanet = planet === currentWindow.planet;
      const gapDays    = daysDiff(currentWindow.endDate, d);
      // only merge if d is the same day or exactly one day after
      if (samePlanet && gapDays >= 0 && gapDays <= 1) {
        currentWindow.endDate = new Date(d);
        currentWindow.days++;
      } else {
        windows.push(currentWindow);
        currentWindow = {
          planet,
          startDate: new Date(d),
          endDate:   new Date(d),
          days:      1
        };
      }
    }
  });

  if (currentWindow) windows.push(currentWindow);
  return windows;
}
