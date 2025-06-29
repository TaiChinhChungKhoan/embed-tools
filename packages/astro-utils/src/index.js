// Main export file for @embed-tools/astro-utils

// Export all constants
export * from './constants.js';

// Export helper functions
export * from './helper.js';

// Export natal chart utilities
export * from './natal.js';

// Export transit utilities
export * from './transits.js';

// Export aspect utilities
export * from './aspects.js';

// Export formatting utilities
export * from './formatting.js';

// Export event utilities
export * from './events.js';

// Export translation utilities
export * from './translations.js';

// Main NatalCalculator class
import { calculateNatalChart, getRulingPlanet } from './natal.js';
import { calculateTransits, computeRetrogradeWindows } from './transits.js';
import { computeAspectWindows } from './aspects.js';
import { PLANETS, SIGNIFICANCE_THRESHOLD } from './constants.js';

// Import event calculation functions
import {
  getMoonPhases,
  getEquinoxesSolstices,
  getPlanetRetrogrades,
  getVenusLatitudeExtremes,
  getMercurySpeedThreshold,
  getVenusSunDeclinationParallel,
  getPlanetAtFixedDegree,
  getPlanetSunConjunction,
  getRetrogradeMidpoints,
  getMinorSeasons,
  getAllEventsForYear,
  mergeConsecutive
} from './events.js';

// Import aspect calculation functions
import {
  getPlanetAspect,
  getVenusRetrogradeConjunctMercuryDirect,
  getAllAspectsForYear
} from './aspects.js';

// Import translation functions
import {
  translateEventToVietnamese,
  translateFixedDegreeEventToVietnamese,
  getVietnameseEventDefinitions
} from './translations.js';

// Import formatting functions
import {
  formatAspectEvent,
  getPlanetName
} from './formatting.js';

// Import core calculation functions
import {
  getPlanetLongitude,
  getPlanetLatitude,
  getPlanetDeclination,
  getSunDeclination,  
} from './natal.js';

import {
  dateToJulianDay,
  julianDayToDate
} from './helper.js';

function parseLocalToUTC(dateStr, timeStr, utcOffsetStr) {
  // dateStr: '2000-07-28', timeStr: '09:00', utcOffsetStr: '+07:00'
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const offsetSign = utcOffsetStr.startsWith('-') ? -1 : 1;
  const [offsetHour, offsetMinute] = utcOffsetStr.slice(1).split(':').map(Number);
  const totalOffsetMinutes = offsetSign * (offsetHour * 60 + offsetMinute);

  // Create a Date object in UTC for the local time
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  // Subtract the offset to get the correct UTC time
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() - totalOffsetMinutes);
  return utcDate;
}

/**
 * Main NatalCalculator class for natal chart analysis
 */
export class NatalCalculator {
  constructor(instrumentName, birthDate, birthTime, birthLocation, lat, lon, utcOffset = "+07:00") {
    this.instrumentName = instrumentName;
    this.birthLocation = birthLocation;
    this.birthDate = birthDate;
    this.birthTime = birthTime;
    this.utcOffsetStr = utcOffset;
    
    // Parse coordinates
    this.lat = this._parseLatLon(lat, "lat");
    this.lon = this._parseLatLon(lon, "lon");
    
    // Calculate birth datetime in UTC robustly
    this.birthDatetime = parseLocalToUTC(birthDate, birthTime, utcOffset);
    this.utcDatetime = this.birthDatetime;
    
    // Initialize natal chart
    this.natalChart = null;
    this.rulingPlanet = null;
  }

  _parseUTCOffset(utcOffset) {
    const sign = utcOffset.startsWith("+") ? 1 : -1;
    const timePart = utcOffset.substring(1);
    const [h, m] = timePart.split(":").map(Number);
    return sign * (h + m / 60);
  }

  _parseLatLon(coord, coordType) {
    if (!coord) return 0;
    
    const match = coord.match(/(\d+\.?\d*)([NSWE])/);
    if (!match) {
      throw new Error(`Invalid ${coordType} format: ${coord}. Use format like "10.7769N" or "106.7009E"`);
    }
    
    const [, value, direction] = match;
    let result = parseFloat(value);
    
    if (coordType === "lat" && (direction === "S" || direction === "s")) {
      result = -result;
    } else if (coordType === "lon" && (direction === "W" || direction === "w")) {
      result = -result;
    }
    
    return result;
  }

  getNatalChart() {
    if (!this.natalChart) {
      this.natalChart = calculateNatalChart(this.utcDatetime, this.lat, this.lon);
      this.rulingPlanet = getRulingPlanet(this.natalChart["Ascendant"]?.sign);
    }
    return this.natalChart;
  }

  calculateTransits(startDate, endDate, orbDays = 1, transitPlanets = null, natalPointsFilter = null) {
    // Default transit planets if not specified (matching Python defaults)
    if (!transitPlanets) {
      transitPlanets = ["Sun", "Moon"];
    }
    
    // Default natal points if not specified (matching Python defaults)
    if (!natalPointsFilter) {
      natalPointsFilter = ["Ascendant", "Midheaven", "Sun", "Moon", "Mercury", "Jupiter", "Neptune"];
    }
    
    // Get natal chart if not already calculated
    if (!this.natalChart) {
      this.getNatalChart();
    }
    
    return calculateTransits(
      startDate,
      endDate,
      this.natalChart,
      transitPlanets,
      natalPointsFilter,
      orbDays,
      SIGNIFICANCE_THRESHOLD,
      this.rulingPlanet
    );
  }

  prepareOutputs(events, retroDays, maxOrb = 180.0, topN = 2) {
    // Filter events by minimum score and sort by date
    const filteredEvents = events
      .filter(event => event.score >= SIGNIFICANCE_THRESHOLD)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Group retrograde days into windows
    const retroWindows = computeRetrogradeWindows(retroDays);
    
    // Group events into aspect windows
    const aspectWindows = computeAspectWindows(filteredEvents);
    
    // Get top N most significant events
    const topEvents = filteredEvents
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
    
    return {
      events: filteredEvents,
      retroWindows: retroWindows,
      aspectWindows: aspectWindows,
      topEvents: topEvents
    };
  }

  displayNatalChart() {
    if (!this.natalChart) {
      this.getNatalChart();
    }
    
    console.log(`\n=== Natal Chart for ${this.instrumentName} ===`);
    console.log(`Birth: ${this.birthDatetime.toLocaleString()}`);
    console.log(`Location: ${this.birthLocation} (${this.lat}°, ${this.lon}°)`);
    console.log(`Ruling Planet: ${this.rulingPlanet || 'Unknown'}\n`);
    
    Object.entries(this.natalChart).forEach(([planet, data]) => {
      console.log(`${planet.padEnd(12)} ${data.sign.padEnd(12)} ${data.degree.toString().padStart(6)}°`);
    });
  }
}

/**
 * Unified AstroCalculator class for event calculations with Vietnamese translations
 */
export class AstroCalculator {
  // Re-export all core functions
  static getPlanetLongitude = getPlanetLongitude;
  static getPlanetLatitude = getPlanetLatitude;
  static getPlanetDeclination = getPlanetDeclination;
  static getSunDeclination = getSunDeclination;
  static dateToJulianDay = dateToJulianDay;
  static julianDayToDate = julianDayToDate;

  // Vietnamese wrapper functions
  static getMoonPhases(startDate, endDate) {
    return getMoonPhases(startDate, endDate).map(translateEventToVietnamese);
  }

  static getEquinoxesSolstices(year) {
    return getEquinoxesSolstices(year).map(translateEventToVietnamese);
  }

  static getPlanetRetrogrades(year, planetName, title) {
    return getPlanetRetrogrades(year, planetName, title).map(translateEventToVietnamese);
  }

  static getVenusLatitudeExtremes(year) {
    return getVenusLatitudeExtremes(year).map(translateEventToVietnamese);
  }

  static getMercurySpeedThreshold(year) {
    return getMercurySpeedThreshold(year).map(translateEventToVietnamese);
  }

  static getVenusSunDeclinationParallel(year) {
    return getVenusSunDeclinationParallel(year).map(translateEventToVietnamese);
  }

  static getPlanetAtFixedDegree(year, planetName, target, tol = 0.5) {
    const events = getPlanetAtFixedDegree(year, planetName, target, tol);
    return events.map(event => translateFixedDegreeEventToVietnamese(event, planetName, target, getPlanetName));
  }

  static getPlanetSunConjunction(year, planetName, tol = 0.5) {
    const events = getPlanetSunConjunction(year, planetName, tol);
    return events.map(event => {
      const vn = getPlanetName(planetName, 'vi');
      const desc = planetName === 'mercury'
        ? 'ĐẢO CHIỀU (những con sóng nhỏ)'
        : 'TẠO ĐỈNH';
      return {
        ...event,
        title: `${vn} hội với Mặt Trời`,
        description: desc
      };
    });
  }

  static getPlanetAspect(year, planetA, planetB, angle, tol = 1) {
    const events = getPlanetAspect(year, planetA, planetB, angle, tol);
    return events.map(event => {
      const formattedEvent = formatAspectEvent({
        ...event,
        planetA,
        planetB,
        angle
      }, 'vi');
      
      // Add special description for Mars-Mercury 161° aspect
      if (planetA === 'mars' && planetB === 'mercury' && angle === 161) {
        formattedEvent.description = 'Giá tăng ngắn hạn và trước khi tăng có sự rũ bỏ';
      }
      
      return formattedEvent;
    });
  }

  static getRetrogradeMidpoints(retroEvents, planetName) {
    const events = getRetrogradeMidpoints(retroEvents, planetName);
    return events.map(event => {
      const vn = getPlanetName(planetName, 'vi');
      return {
        ...event,
        title: `${vn} điểm giữa`,
        description: 'TẠO ĐÁY'
      };
    });
  }

  static getMinorSeasons(year) {
    return getMinorSeasons(year).map(translateEventToVietnamese);
  }

  static getAllEventsForYear(year) {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));
    
    const moon = this.getMoonPhases(startDate, endDate);
    const seq = this.getEquinoxesSolstices(year);
    const minorSeq = this.getMinorSeasons(year);
    const mR = this.getPlanetRetrogrades(year, 'mercury', 'Sao Thủy Nghịch Hành');
    const hR = this.getPlanetRetrogrades(year, 'mars', 'Hỏa Tinh Nghịch Hành');
    const jR = this.getPlanetRetrogrades(year, 'jupiter', 'Mộc Tinh Nghịch Hành');
    const nR = this.getPlanetRetrogrades(year, 'neptune', 'Hải Vương Tinh Nghịch Hành');
    const vLa = this.getVenusLatitudeExtremes(year);
    const mSp = this.getMercurySpeedThreshold(year);
    const vPar = this.getVenusSunDeclinationParallel(year);

    const mCon = this.getPlanetSunConjunction(year, 'mercury');
    const mMid = this.getRetrogradeMidpoints(mR, 'mercury');
    const fxd = [
      ...this.getPlanetAtFixedDegree(year, 'mercury', 105),
      ...this.getPlanetAtFixedDegree(year, 'mercury', 229),
      ...this.getPlanetAtFixedDegree(year, 'mercury', 294),
      ...this.getPlanetAtFixedDegree(year, 'mercury', 299),
      ...this.getPlanetAtFixedDegree(year, 'mars', 195),
      ...this.getPlanetAtFixedDegree(year, 'mars', 106)
    ];
    const asp = this.getPlanetAspect(year, 'mars', 'mercury', 161);
    const vR = this.getPlanetRetrogrades(year, 'venus', 'Kim Tinh Nghịch Hành');
    const vMid = this.getRetrogradeMidpoints(vR, 'venus');

    const events = [
      ...moon, ...seq, ...minorSeq,
      ...mR, ...hR, ...jR, ...nR,
      ...vLa, ...mSp, ...vPar,
      ...mCon, ...mMid,
      ...fxd, ...asp,
      ...vR, ...vMid
    ];
    events.forEach(e => { if (!e.date) e.date = e.startDate; });
    events.sort((a, b) => a.startDate - b.startDate);
    return mergeConsecutive(events);
  }

  // Get all known event definitions for the EventFinder component
  static getAllKnownEventDefinitions() {
    return getVietnameseEventDefinitions();
  }

  static mergeConsecutive = mergeConsecutive;
}

// Export utility functions
export const getEventVisuals = type => ({
  'season': { icon: 'Sun', color: '#d97706' },
  'minor-season': { icon: 'Leaf', color: '#10b981' },
  'new-moon': { icon: 'Moon', color: '#1d4ed8' },
  'full-moon': { icon: 'Circle', color: '#ca8a04' },
  'retrograde': { icon: 'ArrowLeftRight', color: '#dc2626' },
  'cazimi': { icon: 'Sun', color: '#d97706' },
  'aspect': { icon: 'Star', color: '#0d9488' },
  'latitude': { icon: 'Globe2', color: '#1e40af' },
  'speed-threshold': { icon: 'GaugeCircle', color: '#ea580c' },
  'conjunction': { icon: 'Link2', color: '#8b5cf6' },
  'fixed-degree': { icon: 'MapPin', color: '#8b5cf6' },
  'pivot': { icon: 'Target', color: '#059669' }
})[type] || { icon: 'Sparkles', color: '#6b7280' };

export const formatEventDate = d => d.toLocaleString('vi-VN', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', timeZone:'Asia/Ho_Chi_Minh' }); 