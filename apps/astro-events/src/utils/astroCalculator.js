import { 
  getPlanetLongitude, 
  getPlanetLatitude, 
  getPlanetDeclination, 
  getSunDeclination,
  dateToJulianDay,
  julianDayToDate,
  formatAspectEvent,
  getPlanetName
} from '@embed-tools/astro-utils';
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
  mergeConsecutive
} from '@embed-tools/astro-utils';
import {
  getPlanetAspect,
  getVenusRetrogradeConjunctMercuryDirect
} from '@embed-tools/astro-utils';
import {
  translateEventToVietnamese,
  translateFixedDegreeEventToVietnamese,
  getVietnameseEventDefinitions
} from '@embed-tools/astro-utils';

const AstroCalculator = {
  // Re-export all functions from astro-utils
  getPlanetLongitude,
  getPlanetLatitude,
  getPlanetDeclination,
  getSunDeclination,
  dateToJulianDay,
  julianDayToDate,

  // Vietnamese wrapper functions
  getMoonPhases(startDate, endDate) {
    return getMoonPhases(startDate, endDate).map(translateEventToVietnamese);
  },

  getEquinoxesSolstices(year) {
    return getEquinoxesSolstices(year).map(translateEventToVietnamese);
  },

  getPlanetRetrogrades(year, planetName, title) {
    return getPlanetRetrogrades(year, planetName, title).map(translateEventToVietnamese);
  },

  getVenusLatitudeExtremes(year) {
    return getVenusLatitudeExtremes(year).map(translateEventToVietnamese);
  },

  getMercurySpeedThreshold(year) {
    return getMercurySpeedThreshold(year).map(translateEventToVietnamese);
  },

  getVenusSunDeclinationParallel(year) {
    return getVenusSunDeclinationParallel(year).map(translateEventToVietnamese);
  },

  getPlanetAtFixedDegree(year, planetName, target, tol = 0.5) {
    const events = getPlanetAtFixedDegree(year, planetName, target, tol);
    return events.map(event => translateFixedDegreeEventToVietnamese(event, planetName, target, getPlanetName));
  },

  getPlanetSunConjunction(year, planetName, tol = 0.5) {
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
  },

  getPlanetAspect(year, planetA, planetB, angle, tol = 1) {
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
        formattedEvent.description = '75% Giá tăng ngắn hạn, thường trước khi tăng có shake out (rũ bỏ)';
      }
      
      return formattedEvent;
    });
  },

  getVenusRetrogradeConjunctMercuryDirect(year) {
    const events = getVenusRetrogradeConjunctMercuryDirect(year);
    return events.map(event => ({
      ...event,
      title: 'Kim Tinh nghịch hành giao hội Thủy Tinh thuận hành',
      description: 'Thị trường tăng mạnh trong 5–8 ngày, rồi TẠO ĐỈNH (sóng cuối) và giảm mạnh'
    }));
  },

  getRetrogradeMidpoints(retroEvents, planetName) {
    const events = getRetrogradeMidpoints(retroEvents, planetName);
    return events.map(event => {
      const vn = getPlanetName(planetName, 'vi');
      return {
        ...event,
        title: `${vn} điểm giữa`,
        description: 'TẠO ĐÁY'
      };
    });
  },

  getMinorSeasons(year) {
    return getMinorSeasons(year).map(translateEventToVietnamese);
  },

  getAllEventsForYear(year) {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));
    
    const moon = this.getMoonPhases(startDate, endDate);
    const seasons = this.getEquinoxesSolstices(year);
    const minorSeasons = this.getMinorSeasons(year);
    const mR = this.getPlanetRetrogrades(year, 'mercury', 'Sao Thủy Nghịch Hành');
    // const hR = this.getPlanetRetrogrades(year, 'mars', 'Hỏa Tinh Nghịch Hành'); // COMMENTED OUT - not in specific list
    const vLa = this.getVenusLatitudeExtremes(year);
    const mSp = this.getMercurySpeedThreshold(year);
    const vPar = this.getVenusSunDeclinationParallel(year);

    const mCon = this.getPlanetSunConjunction(year, 'mercury');
    const vCon = this.getPlanetSunConjunction(year, 'venus');
    const mMid = this.getRetrogradeMidpoints(mR, 'mercury');
    
    const fxd = [
      ...this.getPlanetAtFixedDegree(year, 'mercury', 105),
      ...this.getPlanetAtFixedDegree(year, 'mercury', 229),
      ...this.getPlanetAtFixedDegree(year, 'mercury', 294),
      ...this.getPlanetAtFixedDegree(year, 'mercury', 299),
      ...this.getPlanetAtFixedDegree(year, 'mars', 15),
      ...this.getPlanetAtFixedDegree(year, 'mars', 165),
      ...this.getPlanetAtFixedDegree(year, 'mars', 195),
      ...this.getPlanetAtFixedDegree(year, 'mars', 225),
      ...this.getPlanetAtFixedDegree(year, 'mars', 106),
      ...this.getPlanetAtFixedDegree(year, 'venus', 130)
    ];
    const asp = [
      ...this.getPlanetAspect(year, 'mars', 'mercury', 161),
      ...this.getVenusRetrogradeConjunctMercuryDirect(year)
    ];

    const events = [
      ...moon, // Moon phases - Trăng Non, Trăng Tròn, etc.
      ...seasons, // Seasons - Xuân Phân, Hạ Chí, Thu Phân, Đông Chí
      ...minorSeasons, // Minor seasons - Cross-quarter days
      ...mR, // Mercury Retrograde - ĐẢO CHIỀU
      // ...hR, // Mars Retrograde - COMMENTED OUT (not in specific list)
      ...vLa, // Venus Latitude Extremes - ĐẢO CHIỀU
      ...mSp, // Mercury Speed Threshold - ĐỈNH hoặc ĐÁY (Pivot)
      ...vPar, // Venus Parallel Sun - ĐẢO CHIỀU
      ...mCon, // Mercury Conjunct Sun - ĐẢO CHIỀU (những con sóng nhỏ)
      ...vCon, // Venus Conjunct Sun - TẠO ĐỈNH
      ...mMid, // Mercury Midpoint - TẠO ĐÁY
      ...fxd, // Fixed degree events
      ...asp  // Aspect events
    ];
    events.forEach(e => { if (!e.date) e.date = e.startDate; });
    events.sort((a, b) => a.startDate - b.startDate);
    return mergeConsecutive(events);
  },

  // Get all known event definitions for the EventFinder component
  getAllKnownEventDefinitions() {
    return getVietnameseEventDefinitions();
  },

  mergeConsecutive
};

export const getEventVisuals = type => ({
  'season': { icon: 'Sun', color: '#d97706' },
  'minor-season': { icon: 'Leaf', color: '#10b981' },
  'new-moon': { icon: 'Moon', color: '#1d4ed8' },
  'first-quarter': { icon: 'Moon', color: '#7c3aed' },
  'full-moon': { icon: 'Circle', color: '#ca8a04' },
  'last-quarter': { icon: 'Moon', color: '#059669' },
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

export default AstroCalculator;
