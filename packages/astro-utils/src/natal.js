import planetposition from 'astronomia/planetposition';
import solar from 'astronomia/solar';
import coord from 'astronomia/coord';
import base from 'astronomia/base';
import vsop87Bearth from 'astronomia/data/vsop87Bearth';
import vsop87Bmercury from 'astronomia/data/vsop87Bmercury';
import vsop87Bvenus from 'astronomia/data/vsop87Bvenus';
import vsop87Bmars from 'astronomia/data/vsop87Bmars';
import vsop87Bjupiter from 'astronomia/data/vsop87Bjupiter';
import vsop87Bsaturn from 'astronomia/data/vsop87Bsaturn';
import vsop87Buranus from 'astronomia/data/vsop87Buranus';
import vsop87Bneptune from 'astronomia/data/vsop87Bneptune';
import pluto from 'astronomia/pluto';
import moonposition from 'astronomia/moonposition';
import { apparent as siderealApparent } from 'astronomia/sidereal';
import { nutation, meanObliquity } from 'astronomia/nutation';
import { ZODIAC_SIGNS, SIGN_RULERS_TRADITIONAL } from './constants.js';
import { dateToJulianDay } from './helper.js';

//–– VSOP-87 cache ––
const planetCache = {};
function getPlanetObj(name) {
  const key = name.toLowerCase();
  if (planetCache[key]) return planetCache[key];
  let data;
  switch (key) {
    case 'earth':   data = vsop87Bearth;  break;
    case 'mercury': data = vsop87Bmercury;break;
    case 'venus':   data = vsop87Bvenus;  break;
    case 'mars':    data = vsop87Bmars;   break;
    case 'jupiter': data = vsop87Bjupiter;break;
    case 'saturn':  data = vsop87Bsaturn; break;
    case 'uranus':  data = vsop87Buranus; break;
    case 'neptune': data = vsop87Bneptune;break;
    case 'pluto':   return pluto; // Pluto uses different calculation method
    default: throw new Error(`Unsupported planet: ${name}`);
  }
  return planetCache[key] = new planetposition.Planet(data);
}

//–– Helpers ––
const toDeg = rad => rad * 180 / Math.PI;
const normalizeDeg = angle => ((angle % 360) + 360) % 360;
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

// Compute JD and T once
function getJulianValues(date) {
  const jd = dateToJulianDay(date);
  const T = (jd - 2451545.0) / 36525;
  return { jd, T };
}

//–– Longitude, Latitude, Declination ––
export function getPlanetLongitude(dateOrVals, planetName) {
  const { jd, T } = dateOrVals.jd ? dateOrVals : getJulianValues(dateOrVals);
  const key = planetName.toLowerCase();

  if (key === 'earth') return 0;
  if (key === 'moon')  return normalizeDeg(toDeg(moonposition.position(jd).lon));
  if (key === 'sun')   return normalizeDeg(toDeg(solar.trueLongitude(T).lon));
  if (key === 'pluto') {
    // Pluto uses different calculation method - need geocentric coordinates
    const earthObj = getPlanetObj('earth');
    const p = pluto.astrometric(jd, earthObj);
    // Convert from equatorial to ecliptic coordinates
    const ecl = new coord.Equatorial(p.ra, p.dec)
      .toEcliptic(base.SOblJ2000, base.COblJ2000);
    return normalizeDeg(toDeg(ecl.lon));
  }

  // other planets
  const earthObj = getPlanetObj('earth');
  const p = getPlanetObj(key).position2000(jd);
  const e = earthObj.position2000(jd);

  // convert to XY
  const x1 = p.range * Math.cos(p.lat) * Math.cos(p.lon);
  const y1 = p.range * Math.cos(p.lat) * Math.sin(p.lon);
  const x2 = e.range * Math.cos(e.lat) * Math.cos(e.lon);
  const y2 = e.range * Math.cos(e.lat) * Math.sin(e.lon);

  const λ = Math.atan2(y1 - y2, x1 - x2);
  return normalizeDeg(toDeg(λ));
}

export function getPlanetLatitude(dateOrVals, planetName) {
  const { jd } = dateOrVals.jd ? dateOrVals : getJulianValues(dateOrVals);
  const key = planetName.toLowerCase();
  if (key === 'earth' || key === 'sun') return 0;
  if (key === 'moon')  return toDeg(moonposition.position(jd).lat);
  if (key === 'pluto') {
    const earthObj = getPlanetObj('earth');
    const p = pluto.astrometric(jd, earthObj);
    // Convert from equatorial to ecliptic coordinates
    const ecl = new coord.Equatorial(p.ra, p.dec)
      .toEcliptic(base.SOblJ2000, base.COblJ2000);
    return toDeg(ecl.lat);
  }
  return toDeg(getPlanetObj(key).position2000(jd).lat);
}

export function getPlanetDeclination(dateOrVals, planetName) {
  const { jd } = dateOrVals.jd ? dateOrVals : getJulianValues(dateOrVals);
  const pos = getPlanetObj(planetName).position2000(jd);
  const equ = new coord.Ecliptic(pos.lon, pos.lat)
    .toEquatorial(base.SOblJ2000, base.COblJ2000);
  return toDeg(equ.dec);
}

export function getSunDeclination(date) {
  const { jd, T } = getJulianValues(date);
  const { lon } = solar.trueLongitude(T);
  const equ = new coord.Ecliptic(lon, 0)
    .toEquatorial(base.SOblJ2000, base.COblJ2000);
  return toDeg(equ.dec);
}

//–– Retrograde detection ––
export function isRetrograde(date, planetName) {
  const key = planetName.toLowerCase();
  if (key === 'sun' || key === 'moon') return false;
  const vals1 = getJulianValues(date);
  const lon1 = getPlanetLongitude(vals1, planetName);
  const future = new Date(date.getTime() + 0.5 * 86400000);
  const vals2 = getJulianValues(future);
  const lon2 = getPlanetLongitude(vals2, planetName);
  // raw delta is negative when moving backwards
  return (lon2 - lon1) < 0;
}

//–– Zodiac ––
export function getZodiacSign(longitude) {
  return ZODIAC_SIGNS[Math.floor(longitude / 30) % 12];
}
export function getDegreeInSign(longitude) {
  return longitude % 30;
}

//–– Sidereal & Houses ––
function toLocalSidereal(jd, lonDeg) {
  // 1) Get GST in seconds of sidereal time
  const gstSec = siderealApparent(jd);
  
  // 2) Convert to hours (sidereal seconds → hours)
  const gstHours = gstSec / 3600;
  
  // 3) Convert hours to radians (24 hours = 2π radians)
  const gstRad = (gstHours / 24) * 2 * Math.PI;
  
  // 4) Add longitude correction (positive for east longitude)
  // Longitude in hours: lonDeg / 15
  const lonHours = lonDeg / 15;
  const lonRad = (lonHours / 24) * 2 * Math.PI;
  
  // 5) Calculate LST
  const lst = gstRad + lonRad;
  
  // 6) Normalize to [0, 2π)
  const result = ((lst % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
  
  return result;
}

/**
 * Ecliptic longitude of the Ascendant, in degrees 0–360
 */
export function calculateAscendant(date, lat, lon) {
  if (!(date instanceof Date)) {
    throw new TypeError('date must be a JS Date');
  }
  const { jd } = getJulianValues(date);

  // nutation → [Δψ, Δε]
  const [, deltaEpsilon] = nutation(jd);
  const ε = meanObliquity(jd) + deltaEpsilon;

  const lst = toLocalSidereal(jd, lon);  // radians
  const φ   = lat * D2R;

  // CORRECT FORMULA (Meeus) - NO "+ 90°"!
  const x = Math.cos(lst);
  const y = Math.cos(ε) * Math.sin(lst) - Math.sin(ε) * Math.tan(φ);

  let ascRad = Math.atan2(y, x);
  if (ascRad < 0) ascRad += 2*Math.PI;
  
  // Add 90° to match Astrolog's convention
  ascRad += Math.PI / 2;
  
  // Normalize to [0, 2π)
  if (ascRad >= 2*Math.PI) ascRad -= 2*Math.PI;

  const ascDeg = ascRad * R2D;
  
  return ascDeg;
}

/**
 * Ecliptic longitude of the Midheaven (MC), in degrees 0–360
 */
export function calculateMidheaven(date, lat, lon) {
  if (!(date instanceof Date)) {
    throw new TypeError('date must be a JS Date');
  }
  const { jd } = getJulianValues(date);
  const [, deltaEpsilon] = nutation(jd);
  const ε = meanObliquity(jd) + deltaEpsilon;

  const lst = toLocalSidereal(jd, lon);
  
  // MC = atan2(tan(LST), cos ε)
  const tanLST = Math.tan(lst);
  const cosEpsilon = Math.cos(ε);
  const mc = Math.atan2(tanLST, cosEpsilon);

  const mcDeg = normalizeDeg(mc * R2D);
  
  return mcDeg;
}

/**
 * Descendant is simply Asc + 180° (mod 360)
 */
export function calculateDescendant(date, lat, lon) {
  return normalizeDeg(calculateAscendant(date, lat, lon) + 180);
}

//–– Rulership ––
export function getRulingPlanet(sign) {
  return SIGN_RULERS_TRADITIONAL[sign] || null;
}

//–– Build a natal chart ––
export function calculateNatalChart(birthDate, lat, lon, planets = [
  'Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'
]) {
  const chart = {};
  const vals = getJulianValues(birthDate);

  for (const pl of planets) {
    try {
      const lonDeg = getPlanetLongitude(vals, pl);
      const latDeg = getPlanetLatitude(vals, pl);
      chart[pl] = {
        longitude:  lonDeg,
        latitude:   latDeg,
        sign:       getZodiacSign(lonDeg),
        degree:     Math.round(getDegreeInSign(lonDeg) * 10) / 10,
        retrograde: isRetrograde(birthDate, pl)
      };
    } catch (e) {
      console.warn(`Skipping ${pl}: ${e.message}`);
    }
  }

  const asc = calculateAscendant(birthDate, lat, lon);
  chart.Ascendant = {
    longitude:  asc,
    latitude:   0,
    sign:       getZodiacSign(asc),
    degree:     Math.round(getDegreeInSign(asc) * 10) / 10,
    retrograde: false
  };

  const mc = calculateMidheaven(birthDate, lat, lon);
  chart.Midheaven = {
    longitude:  mc,
    latitude:   0,
    sign:       getZodiacSign(mc),
    degree:     Math.round(getDegreeInSign(mc) * 10) / 10,
    retrograde: false
  };

  return chart;
}
