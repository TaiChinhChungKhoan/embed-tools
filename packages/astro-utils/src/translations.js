// Vietnamese translations for astronomical events
export const VIETNAMESE_TRANSLATIONS = {
  // Moon phases
  'New Moon': 'Trăng Non',
  'Full Moon': 'Trăng Tròn',
  'First Quarter Moon': 'Trăng Thượng Huyền',
  'Last Quarter Moon': 'Trăng Hạ Huyền',
  
  // Seasons
  'Spring Equinox': 'Xuân Phân',
  'Summer Solstice': 'Hạ Chí',
  'Autumn Equinox': 'Thu Phân',
  'Winter Solstice': 'Đông Chí',
  'Cross-Quarter Day': 'Ngày Giao Mùa Phụ',
  
  // Retrogrades
  'Mercury Retrograde': 'Sao Thủy Nghịch Hành',
  'Mars Retrograde': 'Hỏa Tinh Nghịch Hành',
  'Jupiter Retrograde': 'Mộc Tinh Nghịch Hành',
  'Neptune Retrograde': 'Hải Vương Tinh Nghịch Hành',
  'Venus Retrograde': 'Kim Tinh Nghịch Hành',
  
  // Other events
  'Venus Latitude Extreme (North)': 'Kim Tinh vĩ độ cực hạn (Bắc)',
  'Venus Latitude Extreme (South)': 'Kim Tinh vĩ độ cực hạn (Nam)',
  'Mercury Speed ≥0.59°': 'Tốc độ Thủy Tinh ≥0.59°',
  'Mercury Speed ≥1.58°': 'Tốc độ Thủy Tinh ≥1.58°',
  'Venus Parallel Sun': 'Kim Tinh song song Mặt Trời',
  'mercury Conjunct Sun': 'Thủy Tinh hội với Mặt Trời',
  'mercury Midpoint': 'Thủy Tinh điểm giữa',
  'venus Midpoint': 'Kim Tinh điểm giữa',
  'mercury at 105°': 'Thủy Tinh tại 105°',
  'mercury at 229°': 'Thủy Tinh tại 229°',
  'mercury at 294°': 'Thủy Tinh tại 294°',
  'mercury at 299°': 'Thủy Tinh tại 299°',
  'mars at 15°': 'Hỏa Tinh tại 15°',
  'mars at 165°': 'Hỏa Tinh tại 165°',
  'mars at 195°': 'Hỏa Tinh tại 195°',
  'mars at 225°': 'Hỏa Tinh tại 225°',
  'mars at 106°': 'Hỏa Tinh tại 106°',
  'venus at 130°': 'Kim Tinh tại 130°',
  '161° Aspect between mars and mercury': 'Hỏa Tinh - Thủy Tinh 161°',
  'venus retrograde conjunct mercury direct': 'Kim Tinh nghịch hành giao hội Thủy Tinh thuận hành'
};

export const VIETNAMESE_DESCRIPTIONS = {
  // Moon phases
  'Time for new beginnings.': 'Thời điểm cho sự khởi đầu mới.',
  'Building momentum.': 'Xây dựng động lực.',
  'Emotions reach peak.': 'Cảm xúc đạt đỉnh.',
  'Release and let go.': 'Buông bỏ và thả lỏng.',
  
  // Seasons
  'Sun enters Aries.': 'Mặt Trời vào Bạch Dương.',
  'Longest day.': 'Ngày dài nhất.',
  'Balance point.': 'Điểm cân bằng.',
  'Shortest day.': 'Ngày ngắn nhất.',
  'Midpoint between Winter Solstice and Spring Equinox.': 'Điểm giữa các mùa.',
  'Midpoint between Spring Equinox and Summer Solstice.': 'Điểm giữa các mùa.',
  'Midpoint between Summer Solstice and Autumn Equinox.': 'Điểm giữa các mùa.',
  'Midpoint between Autumn Equinox and Winter Solstice.': 'Điểm giữa các mùa.',
  
  // Retrogrades and other events
  'RETROGRADE; usually at short-term peaks/bottoms (about 24 days; 3 times/year)': '80% ĐẢO CHIỀU, thường xuất hiện tại đỉnh hoặc đáy ngắn hạn (khoảng 24 ngày/lần, 3 lần mỗi năm)',
  'REVERSAL': 'ĐẢO CHIỀU',
  'PEAK or BOTTOM (Pivot) usually appears': '70% TẠO ĐÁY',
  'REVERSAL (small waves)': '90% ĐẢO CHIỀU, thường là đỉnh nhỏ',
  'CREATES PEAK': '85% TẠO ĐỈNH',
  'CREATES BOTTOM': 'TẠO ĐÁY',
  'Short-term price increase and before increase there is rejection': '75% Giá tăng ngắn hạn, thường trước khi tăng có shake out (rũ bỏ)',
  'Market increases strongly': 'Thị trường TĂNG',
  'Strong market increase for 5-8 days, then creates peak and drops sharply': 'Thị trường tăng mạnh trong 5–8 ngày, rồi TẠO ĐỈNH (sóng cuối) và giảm mạnh'
};

// Special descriptions for fixed degree events
export const FIXED_DEGREE_DESCRIPTIONS = {
  'mercury_105': '85% ĐẢO CHIỀU, phần lớn là ĐÁY (15° Cự Giải)',
  'mercury_229': 'ĐẢO CHIỀU (19° Bọ Cạp > Ma Kết > Nhân Mã)',
  'mercury_294': 'ĐẢO CHIỀU (24° Ma Kết > Bọ Cạp > Nhân Mã)',
  'mercury_299': 'ĐẢO CHIỀU (19° Nhân Mã > Bọ Cạp > Ma Kết)',
  'mars_15': '90% TẠO ĐÁY (15° Bạch Dương)',
  'mars_165': '90% TẠO ĐÁY (15° Xử Nữ)',
  'mars_195': '90% TẠO ĐÁY (15° Cự Giải)',
  'mars_225': '90% TẠO ĐÁY (15° Bọ Cạp)',
  'mars_106': 'Thị trường chuyển động không rõ xu hướng (TT đi ngang, nhập nhằng) → Cần dùng PTKT để xác nhận xu hướng (16° Cự Giải)',
  'venus_130': 'Thị trường TĂNG (10° Sư Tử - Heliocentric)'
};

/**
 * Translate an event to Vietnamese
 * @param {Object} event - Event object with title and description
 * @returns {Object} Translated event object
 */
export function translateEventToVietnamese(event) {
  return {
    ...event,
    title: VIETNAMESE_TRANSLATIONS[event.title] || event.title,
    description: VIETNAMESE_DESCRIPTIONS[event.description] || event.description
  };
}

/**
 * Translate a fixed degree event to Vietnamese
 * @param {Object} event - Event object
 * @param {string} planetName - Planet name
 * @param {number} target - Target degree
 * @param {Function} getPlanetName - Function to get planet name in Vietnamese
 * @returns {Object} Translated event object
 */
export function translateFixedDegreeEventToVietnamese(event, planetName, target, getPlanetName) {
  const key = `${planetName}_${target}`;
  const desc = FIXED_DEGREE_DESCRIPTIONS[key] || 'ĐẢO CHIỀU';
  const vn = getPlanetName(planetName, 'vi');
  
  return {
    ...event,
    title: `${vn} tại ${target}°`,
    description: desc
  };
}

/**
 * Get all known event definitions for Vietnamese
 * @returns {Array} Array of event definitions
 */
export function getVietnameseEventDefinitions() {
  return [
    // Moon events
    { title: 'Trăng Non', type: 'new-moon' },
    { title: 'Trăng Tròn', type: 'full-moon' },
    { title: 'Trăng Thượng Huyền', type: 'first-quarter' },
    { title: 'Trăng Hạ Huyền', type: 'last-quarter' },
    
    // Seasons
    { title: 'Xuân Phân', type: 'season' },
    { title: 'Hạ Chí', type: 'season' },
    { title: 'Thu Phân', type: 'season' },
    { title: 'Đông Chí', type: 'season' },
    { title: 'Ngày Giao Mùa Phụ', type: 'minor-season' },
    
    // ACTIVE EVENTS - from specific financial astrology list (14 distinct events)
    
    // 1. Thủy tinh nghịch hành (includes both retrograde and midpoint)
    { title: 'Sao Thủy Nghịch Hành', type: 'retrograde' },
    
    // 2. Thủy tinh nghịch hành giao hội với Mặt trời
    { title: 'Thủy Tinh hội với Mặt Trời', type: 'cazimi' },
    
    // 3. Thủy tinh chạy 1/2 đoạn đường nghịch hành (calculated with #1, not shown separately)
    // { title: 'Thủy Tinh điểm giữa', type: 'pivot' }, // COMMENTED OUT - shown as part of #1
    
    // 4. Thủy tinh di chuyển đến 15 độ Cự Giải
    { title: 'Thủy Tinh tại 105°', type: 'fixed-degree' },
    
    // 5. Thủy tinh di chuyển đến các vị trí đặc biệt (OR conditions - show individually)
    { title: 'Thủy Tinh tại 229°', type: 'fixed-degree' }, // 19° Bọ Cạp
    { title: 'Thủy Tinh tại 294°', type: 'fixed-degree' }, // 24° Ma Kết
    { title: 'Thủy Tinh tại 299°', type: 'fixed-degree' }, // 19° Nhân Mã
    
    // 6. Speed Thủy tinh đạt 0.59° hoặc 1.58° (OR conditions - show individually)
    { title: 'Tốc độ Thủy Tinh ≥0.59°', type: 'speed-threshold' },
    { title: 'Tốc độ Thủy Tinh ≥1.58°', type: 'speed-threshold' },
    
    // 7. Hỏa tinh nghịch hành tạo góc 161 độ với Thủy tinh
    { title: 'Hỏa Tinh - Thủy Tinh 161°', type: 'aspect' },
    
    // 8. Hỏa tinh di chuyển đến 15 độ của một số cung (OR conditions - show individually)
    { title: 'Hỏa Tinh tại 15°', type: 'fixed-degree' }, // 15° Bạch Dương
    { title: 'Hỏa Tinh tại 165°', type: 'fixed-degree' }, // 15° Xử Nữ
    { title: 'Hỏa Tinh tại 195°', type: 'fixed-degree' }, // 15° Cự Giải
    { title: 'Hỏa Tinh tại 225°', type: 'fixed-degree' }, // 15° Bọ Cạp
    
    // 9. Hỏa tinh di chuyển đến 16 độ Cự Giải
    { title: 'Hỏa Tinh tại 106°', type: 'fixed-degree' },
    
    // 10. Kim tinh giao hội với Mặt trời
    { title: 'Kim Tinh hội với Mặt Trời', type: 'cazimi' },
    
    // 11. Kim tinh di chuyển đến 10 độ Sư Tử (Heliocentric)
    { title: 'Kim Tinh tại 130°', type: 'fixed-degree' },
    
    // 12. Vĩ độ Kim tinh đạt cực (Heliocentric)
    { title: 'Kim Tinh vĩ độ cực hạn (Bắc/Nam)', type: 'latitude' },
    
    // 13. Xích vĩ độ Kim tinh cắt qua điểm cực xích vĩ độ Mặt trời (Geo)
    { title: 'Kim Tinh song song Mặt Trời', type: 'conjunction' },
    
    // 14. Kim tinh nghịch hành giao hội với Thủy tinh thuận hành
    { title: 'Kim Tinh nghịch hành giao hội Thủy Tinh thuận hành', type: 'aspect' }
    
    // COMMENTED OUT - not in specific list
    // { title: 'Mộc Tinh Nghịch Hành', type: 'retrograde' },
    // { title: 'Hải Vương Tinh Nghịch Hành', type: 'retrograde' },
    // { title: 'Hỏa Tinh Nghịch Hành', type: 'retrograde' },
    // { title: 'Kim Tinh điểm giữa', type: 'pivot' },
  ];
} 