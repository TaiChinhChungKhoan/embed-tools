export class AstroCalculator {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    console.log("Mock Wasm: Initializing...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.isInitialized = true;
    console.log("Mock Wasm: Ready.");
    return true;
  }
  
  getEventsForDateRange(startDate, endDate) {
    if (!this.isInitialized) throw new Error("AstroCalculator not initialized.");
    
    let events = [];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const pseudoRandom = (seed) => {
      let h = 1779033703 ^ seed;
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };

    for (let year = startYear; year <= endYear; year++) {
      // --- Yearly Events ---
      events.push({ startDate: `${year}-03-20T09:02:00Z`, endDate: `${year}-03-22T09:02:00Z`, type: 'season', title: "Xuân Phân", description: "Mặt Trời đi vào Bạch Dương." });
      events.push({ startDate: `${year}-06-21T02:42:00Z`, endDate: `${year}-06-23T02:42:00Z`, type: 'season', title: "Hạ Chí", description: "Ngày dài nhất trong năm." });
      events.push({ startDate: `${year}-09-22T18:19:00Z`, endDate: `${year}-09-24T18:19:00Z`, type: 'season', title: "Thu Phân", description: "Điểm cân bằng, thường liên quan đến biến động." });
      events.push({ startDate: `${year}-12-21T14:03:00Z`, endDate: `${year}-12-23T14:03:00Z`, type: 'season', title: "Đông Chí", description: "Ngày ngắn nhất trong năm." });
      events.push({ startDate: `${year}-02-03T00:00:00Z`, endDate: `${year}-02-05T00:00:00Z`, type: 'minor-season', title: "Ngày Giao Mùa Phụ", description: "Điểm giữa Đông Chí và Xuân Phân." });
      events.push({ startDate: `${year}-05-05T00:00:00Z`, endDate: `${year}-05-07T00:00:00Z`, type: 'minor-season', title: "Ngày Giao Mùa Phụ", description: "Điểm giữa Xuân Phân và Hạ Chí." });
      events.push({ startDate: `${year}-08-07T00:00:00Z`, endDate: `${year}-08-09T00:00:00Z`, type: 'minor-season', title: "Ngày Giao Mùa Phụ", description: "Điểm giữa Hạ Chí và Thu Phân." });
      events.push({ startDate: `${year}-11-07T00:00:00Z`, endDate: `${year}-11-09T00:00:00Z`, type: 'minor-season', title: "Ngày Giao Mùa Phụ", description: "Điểm giữa Thu Phân và Đông Chí." });
      events.push({ startDate: `${year}-03-15T00:00:00Z`, endDate: `${year}-04-07T00:00:00Z`, type: 'retrograde', title: "Sao Thủy Nghịch Hành", description: `Sao Thủy nghịch hành.` });
      events.push({ startDate: `${year}-07-18T00:00:00Z`, endDate: `${year}-08-11T00:00:00Z`, type: 'retrograde', title: "Sao Thủy Nghịch Hành", description: `Sao Thủy nghịch hành.` });
      events.push({ startDate: `${year}-11-09T00:00:00Z`, endDate: `${year}-11-29T00:00:00Z`, type: 'retrograde', title: "Sao Thủy Nghịch Hành", description: `Sao Thủy nghịch hành.` });
      if(year % 2 === 0) events.push({ startDate: `${year}-12-06T00:00:00Z`, endDate: `${year+1}-02-24T00:00:00Z`, type: 'retrograde', title: "Hỏa Tinh Nghịch Hành", description: "Giai đoạn Sao Hỏa đi lùi." });
      events.push({ startDate: `${year}-10-09T00:00:00Z`, endDate: `${year+1}-02-04T00:00:00Z`, type: 'retrograde', title: "Mộc Tinh Nghịch Hành", description: "Giai đoạn Sao Mộc đi lùi." });
      events.push({ startDate: `${year}-05-02T00:00:00Z`, endDate: `${year}-10-11T00:00:00Z`, type: 'retrograde', title: "Hải Vương Tinh Nghịch Hành", description: "Giai đoạn Sao Hải Vương đi lùi." });
      if (year % 4 === 1) events.push({ startDate: `${year}-06-09T00:00:00Z`, endDate: `${year}-06-11T00:00:00Z`, type: 'ingress', title: "Mộc Tinh nhập cung Khí", description: "Sao Mộc vào cung Khí." });
      if (year % 7 === 4 ) events.push({ startDate: `${year}-05-25T00:00:00Z`, endDate: `${year}-05-27T00:00:00Z`, type: 'ingress', title: "Thổ Tinh nhập cung Đất", description: "Sao Thổ vào cung Đất." });
      if (year % 3 === 2 ) events.push({ startDate: `${year}-11-05T00:00:00Z`, endDate: `${year}-11-07T00:00:00Z`, type: 'ingress', title: "Kim Tinh nhập cung Đất", description: "Sao Kim vào cung Đất." });
      events.push({ startDate: `${year}-08-20T00:00:00Z`, endDate: `${year}-08-22T00:00:00Z`, type: 'latitude', title: "Kim Tinh vĩ độ cực hạn", description: "Kim tinh đạt vĩ độ xa nhất." });
      events.push({ startDate: `${year}-09-05T00:00:00Z`, endDate: `${year}-09-07T00:00:00Z`, type: 'speed-threshold', title: "Tốc độ Thủy Tinh 0.59", description: "Tốc độ của Sao Thủy đạt ngưỡng quan trọng." });
      events.push({ startDate: `${year}-07-06T00:00:00Z`, endDate: `${year}-07-08T00:00:00Z`, type: 'fixed-degree', title: "Hỏa Tinh ở 15° Cự Giải", description: "Sao Hỏa đi qua điểm nhạy cảm." });

      for (let month = 0; month < 12; month++) {
        const monthSeed = year * 100 + month;
        const newMoonDay = 1 + (pseudoRandom(monthSeed + 1) % 10); 
        let date = new Date(year, month, newMoonDay);
        events.push({ startDate: date.toISOString(), endDate: new Date(date.getTime() + 48 * 3600 * 1000).toISOString(), type: 'new-moon', title: "Trăng Non", description: "Thời điểm cho sự khởi đầu mới." });
        
        const fullMoonDay = 15 + (pseudoRandom(monthSeed + 2) % 10);
        date = new Date(year, month, fullMoonDay);
        events.push({ startDate: date.toISOString(), endDate: new Date(date.getTime() + 48 * 3600 * 1000).toISOString(), type: 'full-moon', title: "Trăng Tròn", description: "Gắn liền với cảm xúc đỉnh cao." });
        
         if(month % 4 === 0) { 
            const cazimiDay = 10 + (pseudoRandom(monthSeed + 7) % 15);
            date = new Date(year, month, cazimiDay);
            events.push({ startDate: date.toISOString(), endDate: new Date(date.getTime() + 24 * 3600 * 1000).toISOString(), type: 'cazimi', title: "Kim Tinh Giao Hội Mặt Trời", description: "Điểm giao hội chính xác." });
         }
      }
    }
    
    const filteredEvents = events.filter(event => new Date(event.startDate) <= endDate && new Date(event.endDate) >= startDate);
    
    const uniqueEvents = filteredEvents.filter((event, index, self) =>
      index === self.findIndex((t) => (t.title === event.title && new Date(t.startDate).getFullYear() === new Date(event.startDate).getFullYear() ))
    );

    return uniqueEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  getAllKnownEventDefinitions() {
    return [
      { title: "Sao Thủy Nghịch Hành", type: "retrograde" },
      { title: "Hỏa Tinh Nghịch Hành", type: "retrograde" },
      { title: "Mộc Tinh Nghịch Hành", type: "retrograde" },
      { title: "Hải Vương Tinh Nghịch Hành", type: "retrograde" },
      { title: "Xuân Phân", type: "season" },
      { title: "Hạ Chí", type: "season" },
      { title: "Thu Phân", type: "season" },
      { title: "Đông Chí", type: "season" },
      { title: "Ngày Giao Mùa Phụ", type: "minor-season" },
      { title: "Mộc Tinh nhập cung Khí", type: "ingress" },
      { title: "Thổ Tinh nhập cung Đất", type: "ingress" },
      { title: "Kim Tinh nhập cung Đất", type: "ingress" },
      { title: "Trăng Non", type: "new-moon" },
      { title: "Trăng Tròn", type: "full-moon" },
      { title: "Thổ Tinh trùng tụ với Mộc Tinh", type: "conjunction"},
      { title: "Kim Tinh Giao Hội Mặt Trời", type: "cazimi"},
      { title: "Hỏa Tinh ở 15° Cự Giải", type: "fixed-degree"},
      { title: "Kim Tinh vĩ độ cực hạn", type: "latitude"},
      { title: "Tốc độ Thủy Tinh 0.59", type: "speed-threshold"}
    ];
  }
}

export const getEventVisuals = (type) => {
  const visuals = {
    'season': { icon: 'Sun', color: '#facc15' }, 
    'minor-season': { icon: 'Leaf', color: '#86efac' }, 
    'new-moon': { icon: 'Moon', color: '#93c5fd' }, 
    'full-moon': { icon: 'Circle', color: '#fef08a' },
    'retrograde': { icon: 'ArrowLeftRight', color: '#fca5a5' },
    'conjunction': { icon: 'Link2', color: '#c4b5fd' },
    'ingress': { icon: 'LogIn', color: '#f59e0b' },
    'aspect': { icon: 'Star', color: '#2dd4bf' }, 
    'cazimi': { icon: 'Sun', color: '#f59e0b' },
    'fixed-degree': { icon: 'MapPin', color: '#a78bfa' },
    'latitude': { icon: 'Globe2', color: '#67e8f9' },
    'speed-threshold': { icon: 'GaugeCircle', color: '#fdba74' },
    'default': { icon: 'Sparkles', color: '#e5e7eb' }
  };
  return visuals[type] || visuals['default'];
};

export const formatEventDate = (date) => {
  return date.toLocaleString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh'
  });
}; 