import julian from 'astronomia/julian';
import moonphase from 'astronomia/moonphase';
import solstice from 'astronomia/solstice';
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

const PLANET_NAMES = {
  earth: 'Trái Đất',
  mercury: 'Sao Thủy',
  venus: 'Kim Tinh',
  mars: 'Hỏa Tinh',
  jupiter: 'Mộc Tinh',
  saturn: 'Thổ Tinh',
  neptune: 'Hải Vương Tinh'
};

// Mô tả đặc biệt cho các sự kiện
const FIXED_DESCRIPTIONS = {
  'mercury_105': 'ĐẢO CHIỀU. Đa số là ĐÁY',
  'mercury_229': 'ĐẢO CHIỀU (Bọ Cạp > Ma Kết > Nhân Mã)',
  'mercury_294': 'ĐẢO CHIỀU (Bọ Cạp > Ma Kết > Nhân Mã)',
  'mercury_299': 'ĐẢO CHIỀU (Bọ Cạp > Ma Kết > Nhân Mã)',
  'mars_195': 'TẠO ĐÁY',
  'mars_106': 'TT di chuyển: nhập nhằng/đi ngang → chuyển động theo xu hướng; dùng PTKT để xác nhận'
};

const AstroCalculator = {
  _planetCache: {},

  _dateToJD(date) {
    return julian.CalendarToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  },

  _jdToDate(jd) {
    return julian.JDToDate(jd);
  },

  _getPlanet(name) {
    if (this._planetCache[name]) return this._planetCache[name];
    let data;
    switch (name) {
      case 'earth': data = vsop87Bearth; break;
      case 'mercury': data = vsop87Bmercury; break;
      case 'venus': data = vsop87Bvenus; break;
      case 'mars': data = vsop87Bmars; break;
      case 'jupiter': data = vsop87Bjupiter; break;
      case 'saturn': data = vsop87Bsaturn; break;
      case 'neptune': data = vsop87Bneptune; break;
      default: throw new Error('Hành tinh không hỗ trợ: ' + name);
    }
    const p = new planetposition.Planet(data);
    this._planetCache[name] = p;
    return p;
  },

  getPlanetLongitude(date, name) {
    const jd = this._dateToJD(date);
    return (this._getPlanet(name).position2000(jd).lon * 180/Math.PI + 360) % 360;
  },

  getPlanetLatitude(date, name) {
    const jd = this._dateToJD(date);
    return this._getPlanet(name).position2000(jd).lat * 180/Math.PI;
  },

  getPlanetDeclination(date, name) {
    const jd = this._dateToJD(date);
    const pos = this._getPlanet(name).position2000(jd);
    const equ = new coord.Ecliptic(pos.lon, pos.lat)
      .toEquatorial(base.SOblJ2000, base.COblJ2000);
    return equ.dec * 180/Math.PI;
  },

  getSunDeclination(date) {
    const jd = this._dateToJD(date);
    const lon = solar.apparentLongitude(jd);
    const equ = new coord.Ecliptic(lon, 0)
      .toEquatorial(base.SOblJ2000, base.COblJ2000);
    return equ.dec * 180/Math.PI;
  },

  getMoonPhases(year) {
    const res = [];
    let k = Math.floor((year - 2000) * 12.3685);
    const endYear = year + 1;
    // New moons
    while (true) {
      const jd = moonphase.new(k);
      const d = this._jdToDate(jd);
      if (d.getFullYear() >= endYear) break;
      if (d.getFullYear() === year) {
        res.push({
          type: 'new-moon',
          title: 'Trăng Non',
          description: 'Thời điểm cho sự khởi đầu mới.',
          date: d, startDate: d, endDate: new Date(d.getTime() + 48*3600e3)
        });
      }
      k++;
    }
    // Full moons
    k = Math.floor((year - 2000) * 12.3685);
    while (true) {
      const jd = moonphase.full(k);
      const d = this._jdToDate(jd);
      if (d.getFullYear() >= endYear) break;
      if (d.getFullYear() === year) {
        res.push({
          type: 'full-moon',
          title: 'Trăng Tròn',
          description: 'Cảm xúc đạt đỉnh.',
          date: d, startDate: d, endDate: new Date(d.getTime() + 48*3600e3)
        });
      }
      k++;
    }
    return res;
  },

  getEquinoxesSolstices(year) {
    const res = [];
    try {
      const evs = [
        { jd: solstice.march(year), title: 'Xuân Phân', description: 'Mặt Trời vào Bạch Dương.' },
        { jd: solstice.june(year), title: 'Hạ Chí', description: 'Ngày dài nhất.' },
        { jd: solstice.september(year), title: 'Thu Phân', description: 'Điểm cân bằng.' },
        { jd: solstice.december(year), title: 'Đông Chí', description: 'Ngày ngắn nhất.' }
      ];
      evs.forEach(e => {
        const d = this._jdToDate(e.jd);
        res.push({
          type: 'season',
          title: e.title,
          description: e.description,
          date: d,
          startDate: d,
          endDate: new Date(d.getTime() + 2*24*3600e3)
        });
      });
    } catch {};
    return res;
  },

  getPlanetRetrogrades(year, name, title) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    let prev = this.getPlanetLongitude(dt,name);
    let inR = false;
    let startDate = null;
    while (dt < end) {
      const lon = this.getPlanetLongitude(dt,name);
      const retro = (lon - prev) < 0 && (lon - prev) > -180;
      if (retro && !inR) {
        inR = true;
        startDate = new Date(dt);
      } else if (!retro && inR) {
        const desc = name === 'mercury'
          ? 'ĐẢO CHIỀU; thường tại đỉnh/đáy ngắn hạn (khoảng 24 ngày; 3 lần/năm)'
          : title;
        res.push({
          type: 'retrograde',
          title,
          description: desc,
          date: startDate,
          startDate,
          endDate: new Date(dt)
        });
        inR = false;
      }
      prev = lon;
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  getVenusLatitudeExtremes(year) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,2));
    const end = new Date(Date.UTC(year+1,0,1));
    let prevLat = this.getPlanetLatitude(new Date(Date.UTC(year,0,1)),'venus');
    let prevDir = null;
    while (dt < end) {
      const lat = this.getPlanetLatitude(dt,'venus');
      const dir = lat > prevLat ? 1 : -1;
      if (prevDir !== null && dir !== prevDir) {
        const p = new Date(dt.getTime() - 86400000);
        res.push({
          type: 'latitude',
          title: `Kim Tinh vĩ độ cực hạn (${prevDir>0?'Bắc':'Nam'})`,
          description: 'ĐẢO CHIỀU',
          date: p,
          startDate: p,
          endDate: new Date(p.getTime()+24*3600e3)
        });
      }
      prevLat = lat;
      prevDir = dir;
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  getMercurySpeedThreshold(year) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    let prev = this.getPlanetLongitude(dt,'mercury');
    let inT = false;
    let startDate = null;
    while (dt < end) {
      const lon = this.getPlanetLongitude(dt,'mercury');
      const sp = Math.abs(lon - prev);
      const hit = sp >= 0.59; // optionally handle 1.58 separately
      if (hit && !inT) {
        inT = true;
        startDate = new Date(dt);
      } else if (!hit && inT) {
        res.push({
          type: 'speed-threshold',
          title: 'Tốc độ Thủy Tinh ≥0.59°',
          description: 'ĐỈNH hoặc ĐÁY (Pivot) thường xuất hiện',
          date: startDate,
          startDate,
          endDate: new Date(dt)
        });
        inT = false;
      }
      prev = lon;
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  /**
   * Kim Tinh nghịch hành giao song phương chi tiết declination song song Mặt Trời
   * Phát hiện khi Kim Tinh ngang với Sun (parallel) → ĐẢO CHIỀU
   */
  getVenusSunDeclinationParallel(year) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    let inPar = false;
    let startDate = null;
    while (dt < end) {
      const vDec = this.getPlanetDeclination(dt,'venus');
      const sDec = this.getSunDeclination(dt);
      const diff = Math.abs(vDec - sDec);
      if (diff < 0.5 && !inPar) {
        inPar = true;
        startDate = new Date(dt);
      } else if (diff >= 0.5 && inPar) {
        res.push({
          type: 'conjunction',
          title: 'Kim Tinh song song Mặt Trời',
          description: 'ĐẢO CHIỀU',
          date: startDate,
          startDate,
          endDate: new Date(dt)
        });
        inPar = false;
      }
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  getPlanetAtFixedDegree(year, name, target, tol=0.5) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    let prev = this.getPlanetLongitude(dt,name);
    dt.setUTCDate(dt.getUTCDate()+1);
    while (dt < end) {
      const lon = this.getPlanetLongitude(dt,name);
      const crossed = (prev<target-tol && lon>=target-tol && lon<=target+tol)
        || (prev>target+tol && lon<=target+tol && lon>=target-tol);
      if (crossed) {
        const key = `${name}_${target}`;
        const desc = FIXED_DESCRIPTIONS[key] || 'ĐẢO CHIỀU';
        const vn = PLANET_NAMES[name] || name;
        res.push({
          type: 'fixed-degree',
          title: `${vn} tại ${target}°`,
          description: desc,
          date: new Date(dt),
          startDate: new Date(dt),
          endDate: new Date(dt.getTime()+24*3600e3)
        });
      }
      prev = lon;
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  getPlanetSunConjunction(year, name, tol=0.5) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    while (dt < end) {
      const p = this.getPlanetLongitude(dt,name);
      const s = (solar.apparentLongitude(this._dateToJD(dt))*180/Math.PI + 360) % 360;
      const diff = Math.abs((p - s + 360) % 360);
      if (diff < tol || diff > 360 - tol) {
        const vn = PLANET_NAMES[name] || name;
        const desc = name === 'mercury'
          ? 'ĐẢO CHIỀU (những con sóng nhỏ)'
          : 'TẠO ĐỈNH';
        res.push({
          type: 'cazimi',
          title: `${vn} hội với Mặt Trời`,
          description: desc,
          date: new Date(dt),
          startDate: new Date(dt),
          endDate: new Date(dt.getTime()+24*3600e3)
        });
      }
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  getPlanetAspect(year, a, b, ang, tol=1) {
    const res = [];
    let dt = new Date(Date.UTC(year,0,1));
    const end = new Date(Date.UTC(year+1,0,1));
    while (dt < end) {
      const lonA = this.getPlanetLongitude(dt,a);
      const lonB = this.getPlanetLongitude(dt,b);
      const diff = Math.abs(((lonA - lonB + 360) % 360) - ang);
      if (diff < tol) {
        const vnA = PLANET_NAMES[a] || a;
        const vnB = PLANET_NAMES[b] || b;
        const desc = a==='mars' && b==='mercury' && ang===161
          ? 'Giá tăng ngắn hạn và trước khi tăng có sự rũ bỏ'
          : 'Aspect';
        res.push({
          type: 'aspect',
          title: `Góc ${ang}° giữa ${vnA} và ${vnB}`,
          description: desc,
          date: new Date(dt),
          startDate: new Date(dt),
          endDate: new Date(dt.getTime()+24*3600e3)
        });
      }
      dt.setUTCDate(dt.getUTCDate()+1);
    }
    return res;
  },

  getRetrogradeMidpoints(retro, name) {
    return retro.map(ev => {
      const s = this.getPlanetLongitude(ev.startDate,name);
      const e = this.getPlanetLongitude(ev.endDate,name);
      const mid = (s + ((e-s+360)%360)/2) % 360;
      let dt = new Date(ev.startDate);
      while (dt <= ev.endDate) {
        const lon = this.getPlanetLongitude(dt,name);
        if (Math.abs(((lon-mid+360)%360)) < 0.5) {
          const vn = PLANET_NAMES[name] || name;
          return {
            type: 'pivot',
            title: `${vn} điểm giữa`,
            description: 'TẠO ĐÁY',
            date: new Date(dt),
            startDate: new Date(dt),
            endDate: new Date(dt.getTime()+24*3600e3)
          };
        }
        dt.setUTCDate(dt.getUTCDate()+1);
      }
      return null;
    }).filter(x=>x);
  },

  getMinorSeasons(year) {
    const res = [];
    try {
      // Cross-quarter days (midpoints between solstices and equinoxes)
      const events = [
        { jd: solstice.march(year) - 45, title: 'Ngày Giao Mùa Phụ', description: 'Điểm giữa Đông Chí và Xuân Phân.' },
        { jd: solstice.march(year) + 45, title: 'Ngày Giao Mùa Phụ', description: 'Điểm giữa Xuân Phân và Hạ Chí.' },
        { jd: solstice.june(year) + 45, title: 'Ngày Giao Mùa Phụ', description: 'Điểm giữa Hạ Chí và Thu Phân.' },
        { jd: solstice.september(year) + 45, title: 'Ngày Giao Mùa Phụ', description: 'Điểm giữa Thu Phân và Đông Chí.' }
      ];
      events.forEach(e => {
        const d = this._jdToDate(e.jd);
        res.push({
          type: 'minor-season',
          title: e.title,
          description: e.description,
          date: d,
          startDate: d,
          endDate: new Date(d.getTime() + 2*24*3600e3)
        });
      });
    } catch {};
    return res;
  },

  getAllEventsForYear(year) {
    const moon = this.getMoonPhases(year);
    const seq = this.getEquinoxesSolstices(year);
    const minorSeq = this.getMinorSeasons(year);
    const mR = this.getPlanetRetrogrades(year,'mercury','Sao Thủy Nghịch Hành');
    const hR = this.getPlanetRetrogrades(year,'mars','Hỏa Tinh Nghịch Hành');
    const jR = this.getPlanetRetrogrades(year,'jupiter','Mộc Tinh Nghịch Hành');
    const nR = this.getPlanetRetrogrades(year,'neptune','Hải Vương Tinh Nghịch Hành');
    const vLa = this.getVenusLatitudeExtremes(year);
    const mSp = this.getMercurySpeedThreshold(year);
    const vPar = this.getVenusSunDeclinationParallel(year);

    const mCon = this.getPlanetSunConjunction(year,'mercury');
    const mMid = this.getRetrogradeMidpoints(mR,'mercury');
    const fxd = [
      ...this.getPlanetAtFixedDegree(year,'mercury',105),
      ...this.getPlanetAtFixedDegree(year,'mercury',229),
      ...this.getPlanetAtFixedDegree(year,'mercury',294),
      ...this.getPlanetAtFixedDegree(year,'mercury',299),
      ...this.getPlanetAtFixedDegree(year,'mars',195),
      ...this.getPlanetAtFixedDegree(year,'mars',106)
    ];
    const asp = this.getPlanetAspect(year,'mars','mercury',161);
    const vR = this.getPlanetRetrogrades(year,'venus','Kim Tinh Nghịch Hành');
    const vMid = this.getRetrogradeMidpoints(vR,'venus');

    const events = [
      ...moon, ...seq, ...minorSeq,
      ...mR, ...hR, ...jR, ...nR,
      ...vLa, ...mSp, ...vPar,
      ...mCon, ...mMid,
      ...fxd, ...asp,
      ...vR, ...vMid
    ];
    events.forEach(e => { if(!e.date) e.date = e.startDate; });
    events.sort((a,b) => a.startDate - b.startDate);
    return this.mergeConsecutive(events);
  },

  mergeConsecutive(arr) {
    const ms = 24*3600e3;
    const out = [];
    arr.forEach(e => {
      if (!out.length) { out.push({...e}); return; }
      const last = out[out.length-1];
      if (e.type === last.type && e.startDate.getTime() <= last.endDate.getTime()+ms) {
        last.endDate = new Date(Math.max(last.endDate.getTime(), e.endDate.getTime()));
      } else out.push({...e});
    });
    return out;
  },

  getAllKnownEventDefinitions() {
    return [
      { title: "Sao Thủy Nghịch Hành", type: "retrograde" },
      { title: "Hỏa Tinh Nghịch Hành", type: "retrograde" },
      { title: "Mộc Tinh Nghịch Hành", type: "retrograde" },
      { title: "Hải Vương Tinh Nghịch Hành", type: "retrograde" },
      { title: "Kim Tinh Nghịch Hành", type: "retrograde" },
      { title: "Xuân Phân", type: "season" },
      { title: "Hạ Chí", type: "season" },
      { title: "Thu Phân", type: "season" },
      { title: "Đông Chí", type: "season" },
      { title: "Ngày Giao Mùa Phụ", type: "minor-season" },
      { title: "Trăng Non", type: "new-moon" },
      { title: "Trăng Tròn", type: "full-moon" },
      { title: "Kim Tinh hội với Mặt Trời", type: "cazimi" },
      { title: "Sao Thủy hội với Mặt Trời", type: "cazimi" },
      { title: "Kim Tinh song song Mặt Trời", type: "conjunction" },
      { title: "Góc 161° giữa Hỏa Tinh và Sao Thủy", type: "aspect" },
      { title: "Sao Thủy tại 105°", type: "fixed-degree" },
      { title: "Sao Thủy tại 229°", type: "fixed-degree" },
      { title: "Sao Thủy tại 294°", type: "fixed-degree" },
      { title: "Sao Thủy tại 299°", type: "fixed-degree" },
      { title: "Hỏa Tinh tại 195°", type: "fixed-degree" },
      { title: "Hỏa Tinh tại 106°", type: "fixed-degree" },
      { title: "Kim Tinh vĩ độ cực hạn", type: "latitude" },
      { title: "Tốc độ Sao Thủy 0.59", type: "speed-threshold" },
      { title: "Sao Thủy điểm giữa", type: "pivot" },
      { title: "Kim Tinh điểm giữa", type: "pivot" }
    ];
  }
};

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

export default AstroCalculator;
