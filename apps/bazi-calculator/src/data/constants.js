// Style classes for different elements
export const STYLE_CLASSES = {
  'Mộc': { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-400', tag: 'bg-green-100 text-green-800', chart: 'bg-green-500' },
  'Hỏa': { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-400', tag: 'bg-red-100 text-red-800', chart: 'bg-red-500' },
  'Thổ': { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-400', tag: 'bg-yellow-100 text-yellow-800', chart: 'bg-yellow-500' },
  'Kim': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-400', tag: 'bg-blue-100 text-blue-800', chart: 'bg-blue-500' },
  'Thủy': { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-400', tag: 'bg-gray-100 text-gray-800', chart: 'bg-gray-500' },
  'good': { tag: 'bg-green-100 text-green-800' },
  'bad': { tag: 'bg-red-100 text-red-800' }
};

// Vietnamese translations
export const TRANSLATIONS = {
  stems: { 'Jia': 'Giáp', 'Yi': 'Ất', 'Bing': 'Bính', 'Ding': 'Đinh', 'Wu': 'Mậu', 'Ji': 'Kỷ', 'Geng': 'Canh', 'Xin': 'Tân', 'Ren': 'Nhâm', 'Gui': 'Quý' },
  branches: { 'Zi': 'Tý', 'Chou': 'Sửu', 'Yin': 'Dần', 'Mao': 'Mão', 'Chen': 'Thìn', 'Si': 'Tỵ', 'Wu': 'Ngọ', 'Wei': 'Mùi', 'Shen': 'Thân', 'You': 'Dậu', 'Xu': 'Tuất', 'Hai': 'Hợi' },
  animals: { 'Rat': 'Chuột', 'Ox': 'Trâu', 'Tiger': 'Hổ', 'Rabbit': 'Thỏ', 'Dragon': 'Rồng', 'Snake': 'Rắn', 'Horse': 'Ngựa', 'Goat': 'Dê', 'Monkey': 'Khỉ', 'Rooster': 'Gà', 'Dog': 'Chó', 'Pig': 'Lợn' },
  elements: { 'WOOD': 'Mộc', 'FIRE': 'Hỏa', 'EARTH': 'Thổ', 'METAL': 'Kim', 'WATER': 'Thủy' },
  interactions: { 'combination': 'Hợp', 'clash': 'Xung', 'harm': 'Hại', 'punishment': 'Hình', 'destruction': 'Phá' },
  tenGods: {
    'Friend': 'Tỷ Kiên', 
    'Rob Wealth': 'Kiếp Tài', 
    'Eating God': 'Thực Thần', 
    'Hurting Officer': 'Thương Quan', 
    'Indirect Wealth': 'Thiên Tài', 
    'Direct Wealth': 'Chính Tài', 
    'Seven Killings': 'Thất Sát', 
    'Direct Officer': 'Chính Quan', 
    'Indirect Resource': 'Thiên Ấn', 
    'Direct Resource': 'Chính Ấn'
  },
  eightMansions: { 'wealth': 'Tài Lộc', 'health': 'Thiên Y', 'romance': 'Diên Niên', 'career': 'Phục Vị', 'obstacles': 'Họa Hại', 'quarrels': 'Ngũ Quỷ', 'lawsuits': 'Lục Sát', 'totalLoss': 'Tuyệt Mệnh', 'setbacks': 'Họa Hại' },
  directions: {'N': 'Bắc', 'S': 'Nam', 'E': 'Đông', 'W': 'Tây', 'NE': 'Đông Bắc', 'SE': 'Đông Nam', 'SW': 'Tây Nam', 'NW': 'Tây Bắc'}
};

// Industry recommendations by element
export const INDUSTRY_MAP = { 
  'Mộc': [{ name: 'Nông & Lâm nghiệp', desc: 'Trồng trọt, chế biến gỗ, giấy.' }, { name: 'Dệt may & Da giày', desc: 'Sản xuất quần áo, vải, giày dép.' }, { name: 'Giáo dục & Xuất bản', desc: 'Trường học, sách, báo chí, truyền thông.' }, { name: 'Y tế & Chăm sóc sức khỏe (Thảo dược)', desc: 'Đông y, dược liệu, sản phẩm tự nhiên.' }], 
  'Hỏa': [{ name: 'Năng lượng', desc: 'Dầu khí, điện, năng lượng tái tạo.' }, { name: 'Công nghệ cao & Điện tử', desc: 'Phần mềm, internet, bán dẫn, viễn thông.' }, { name: 'Giải trí & Mỹ phẩm', desc: 'Phim ảnh, nhà hàng, khách sạn, mỹ phẩm.' }, { name: 'Hóa chất & Nhựa', desc: 'Sản xuất hóa chất cơ bản, nhựa.' }], 
  'Thổ': [{ name: 'Bất động sản', desc: 'Phát triển, kinh doanh, cho thuê BĐS.' }, { name: 'Xây dựng & Vật liệu', desc: 'Xây dựng công trình, sản xuất xi măng, gạch.' }, { name: 'Bảo hiểm', desc: 'Bảo hiểm nhân thọ và phi nhân thọ.' }, { name: 'Khai khoáng', desc: 'Khai thác tài nguyên khoáng sản.' }], 
  'Kim': [{ name: 'Tài chính & Ngân hàng', desc: 'Ngân hàng, công ty chứng khoán, quản lý quỹ.' }, { name: 'Cơ khí & Sản xuất máy móc', desc: 'Sản xuất ô tô, thiết bị công nghiệp.' }, { name: 'Kim loại & Thép', desc: 'Sản xuất, kinh doanh thép, kim loại quý.' }, { name: 'Công nghệ (Phần cứng)', desc: 'Sản xuất máy tính, thiết bị điện tử.' }], 
  'Thủy': [{ name: 'Vận tải & Logistics', desc: 'Hàng không, cảng biển, vận chuyển hàng hóa.' }, { name: 'Thương mại & Bán lẻ', desc: 'Siêu thị, xuất nhập khẩu, bán lẻ.' }, { name: 'Du lịch & Dịch vụ', desc: 'Lữ hành, khách sạn, dịch vụ ăn uống.' }, { name: 'Thủy sản', desc: 'Nuôi trồng và chế biến thủy hải sản.' }] 
};

// Wu Xing relationships
export const WUXING_RELATIONS = { 
  produces: { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' }, 
  controls: { 'Mộc': 'Thổ', 'Hỏa': 'Kim', 'Thổ': 'Thủy', 'Kim': 'Mộc', 'Thủy': 'Hỏa' }, 
};

// SVG paths for element icons
export const SVG_PATHS = { 
  'Mộc': 'M17.5 1a4.5 4.5 0 00-4.47 4.96l-2.6 1.73A4.5 4.5 0 106.5 13H10v2a3 3 0 003 3h1a3 3 0 003-3v-2h3.5a4.5 4.5 0 100-9H13.04A4.5 4.5 0 0017.5 1zM6.5 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0-11a1.5 1.5 0 110-3 1.5 1.5 0 010 3z', 
  'Hỏa': 'M11.33 2.03c.59-.59 1.71-.23 1.95.62.18.66.71 1.13 1.39 1.13.93 0 1.63-1.07 1.22-1.93a3.5 3.5 0 00-4.95-4.95C10.07-.5 9 1.1 9 2c0 .69.47 1.21 1.13 1.39.78.2 1.41-.34 1.2-1.36zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm4.27 7.27c-3.17 3.17-8.36 3.17-11.54 0-2.31-2.31-2.9-6.09-1.38-9.15.59-1.18 2.2-1.18 2.79 0C8.73 8.31 9.8 11.23 12 12c.98 0 1.88-.35 2.62-.94.7-.56.89-1.6.33-2.3a1.5 1.5 0 012.3-.33c.96.96 1.2 2.48.56 3.72l-1.54 2.82z', 
  'Thổ': 'M21 3H3v2h18V3zM3 21h18v-2H3v2zM12.41 6.59l-2-2-2 2L10 8l-2.09-.59-2 2L6.59 10 5 11.59l2 2 .59-1.41L8 10l1.41.59 2-2L10.82 8l1.59-1.41zm-.82 8.82l-2 2-2-2L10 16l-2.09.59-2-2L6.59 14 5 12.41l2-2 .59 1.41L8 14l1.41-.59 2 2L10.82 16l1.59 1.41zM20.5 11.5L19 10l-1.41 1.41L16 10l-1.41 1.41L16 14l1.59-1.41L19 14l1.5-1.5L19 11l1.5-1.5z', 
  'Kim': 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z', 
  'Thủy': 'M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1 12H9v-2h2v2zm2-2h-2V7h2v7zm1 2h2v-2h-2v2z'
};

// Helper functions
export const getElementIcon = (element) => `<svg class="element-icon" viewBox="0 0 24 24" fill="currentColor"><path d="${SVG_PATHS[element] || ''}"/></svg>`;

// Lifestyle and environment suggestions based on Bazi elements
export function getBaziSuggestions(dungThan = [], kyThan = []) {
  const data = {
    METAL: {
      colors: ["trắng", "xám bạc", "vàng kim", "ánh kim"],
      materials: ["kim loại", "inox", "vàng", "bạc", "thép không gỉ"],
      environment: ["nơi thoáng sáng", "hướng Tây – Tây Bắc", "nội thất ánh kim"],
    },
    EARTH: {
      colors: ["vàng đất", "nâu", "be", "xám nhạt"],
      materials: ["đá tự nhiên", "gốm sứ", "gạch", "xi măng", "vật liệu bê tông"],
      environment: ["nơi cao ráo", "vùng đồi núi", "nội thất ấm màu đất"],
    },
    WOOD: {
      colors: ["xanh lá cây", "xanh cốm", "xanh lá mạ"],
      materials: ["gỗ tự nhiên", "tre", "nứa", "vải sợi tự nhiên"],
      environment: ["nơi có cây xanh", "hướng Đông – Đông Nam", "không gian thoáng đãng"],
      avoidColors: ["xanh lá cây", "xanh cốm"],
      avoidMaterials: ["gỗ tươi", "vải sợi tự nhiên quá mềm"],
    },
    FIRE: {
      colors: ["đỏ", "hồng", "cam", "tím"],
      materials: ["đèn LED", "thủy tinh màu", "vải sợi tổng hợp"],
      environment: ["nơi ấm áp", "hướng Nam", "ánh sáng tự nhiên"],
      avoidColors: ["đỏ", "hồng", "cam"],
      avoidMaterials: ["đèn LED đỏ", "đèn tia hồng ngoại", "nội thất tone nóng gắt"],
    },
    WATER: {
      colors: ["đen", "xanh dương", "xanh tím than", "xanh biển"],
      materials: ["thủy tinh", "gương", "đá quý", "vật liệu phản quang"],
      environment: ["gần nước", "hướng Bắc", "không gian mát mẻ"],
      avoidColors: ["đen", "xanh dương", "xanh tím than"],
      avoidMaterials: ["bể cá", "gương lớn", "thủy tinh màu lạnh"],
    },
  };

  // Gợi ý nên dùng
  const shouldUse = dungThan.flatMap((element) => ({
    element,
    colors: data[element]?.colors || [],
    materials: data[element]?.materials || [],
    environment: data[element]?.environment || [],
  }));

  // Gợi ý nên tránh
  const shouldAvoid = kyThan.flatMap((element) => ({
    element,
    colors: data[element]?.avoidColors || [],
    materials: data[element]?.avoidMaterials || [],
  }));

  return {
    goiYNenDung: shouldUse,
    goiYNenTranh: shouldAvoid,
  };
} 