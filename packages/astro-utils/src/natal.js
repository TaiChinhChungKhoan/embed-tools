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
import vsop87Bneptune from 'astronomia/data/vsop87Bneptune';
import moonposition from 'astronomia/moonposition';
import sidereal from 'astronomia/sidereal';
import nutation from 'astronomia/nutation';
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
    case 'neptune': data = vsop87Bneptune;break;
    default: throw new Error(`Unsupported planet: ${name}`);
  }
  return planetCache[key] = new planetposition.Planet(data);
}

//–– Helpers ––
const toDeg = rad => rad * 180 / Math.PI;
const normalizeDeg = angle => ((angle % 360) + 360) % 360;

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
  const gst = sidereal.apparent(jd);
  let hours = gst * 12/Math.PI + lonDeg/15;
  hours = ((hours % 24) + 24) % 24;
  return hours * Math.PI/12;
}

export function calculateAscendant(date, lat, lon) {
  const { jd } = getJulianValues(date);
  const lst = toLocalSidereal(jd, lon);
  const φ   = lat * Math.PI/180;
  const ε   = nutation.meanObliquity(jd) + nutation.nutation(jd).deltaEpsilon;
  const sinL = Math.sin(lst), cosL = Math.cos(lst);
  const tanφ = Math.tan(φ);
  const sinε = Math.sin(ε), cosε = Math.cos(ε);
  const y = -cosL;
  const x = sinL*cosε + tanφ*sinε;
  const asc = normalizeDeg(toDeg(Math.atan2(y, x)) + 180);
  return asc;
}

export function calculateMidheaven(date, lat, lon) {
  const { jd } = getJulianValues(date);
  const lst = toLocalSidereal(jd, lon);
  const ε   = nutation.meanObliquity(jd) + nutation.nutation(jd).deltaEpsilon;
  const mc  = toDeg(Math.atan2(Math.tan(lst), Math.cos(ε)));
  return normalizeDeg(mc);
}

//–– Rulership ––
export function getRulingPlanet(sign) {
  return SIGN_RULERS_TRADITIONAL[sign] || null;
}

//–– Build a natal chart ––
export function calculateNatalChart(birthDate, lat, lon, planets = [
  'Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Neptune'
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
