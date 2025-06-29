// Astrological constants and definitions

// Aspect definitions with orbs and polarities based on astrological methodology
export const ASPECTS = [
  { angle: 0, name: "Conjunction (0°)", orb: 10, interpretation: "New cycle, release of energy. Good.", polarity: 0.8 },
  { angle: 90, name: "Square (90°)", orb: 6, interpretation: "Tension, challenge, friction. Bad.", polarity: -1.0 },
  { angle: 120, name: "Trine (120°)", orb: 6, interpretation: "Harmony, natural flow. Good. Great.", polarity: 1.0 },
  { angle: 180, name: "Opposition (180°)", orb: 10, interpretation: "Culmination, confrontation. Bad.", polarity: -1.0 },
];

// Planet identifiers and weights
export const PLANETS = {
  "Sun": { id: 0, weight: 2.0, orbAdjustment: 2.2 },
  "Moon": { id: 1, weight: 0.4, orbAdjustment: 0.8 },
  "Mercury": { id: 2, weight: 0.5, orbAdjustment: 1.5 },
  "Venus": { id: 3, weight: 0.5, orbAdjustment: 2.2 },
  "Mars": { id: 4, weight: 1.2, orbAdjustment: 1.5 },
  "Jupiter": { id: 5, weight: 1.0, orbAdjustment: 1.7 },
  "Saturn": { id: 6, weight: 1.0, orbAdjustment: 1.5 },
  "Uranus": { id: 7, weight: 0.8, orbAdjustment: 1.5 },
  "Neptune": { id: 8, weight: 0.8, orbAdjustment: 1.7 },
  "Pluto": { id: 9, weight: 0.8, orbAdjustment: 1.5 },
};

// Traditional sign rulers
export const SIGN_RULERS_TRADITIONAL = {
  "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
  "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Pluto",
  "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Uranus", "Pisces": "Neptune",
};

// Zodiac signs
export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Scoring constants
export const SIGNIFICANCE_THRESHOLD = 3;
export const RULING_PLANET_BONUS = 2.5;
export const RETROGRADE_BONUS = 1.0;

// Preset instruments with their natal data
export const PRESET_INSTRUMENTS = {
  "VNIndex": {
    name: "VNIndex",
    birthDate: "2000-07-28",
    birthTime: "09:00",
    birthLocation: "Ho Chi Minh City",
    lat: "10.7769N",
    lon: "106.7009E",
    utcOffset: "+07:00",
    description: "Vietnam Stock Market Index"
  },
  "BTC": {
    name: "BTC",
    birthDate: "2009-01-03",
    birthTime: "18:15",
    birthLocation: "Unknown",
    lat: "0.0000N",
    lon: "0.0000E",
    utcOffset: "+00:00",
    description: "Bitcoin - First block mined"
  },
  "AAPL": {
    name: "AAPL",
    birthDate: "1976-04-01",
    birthTime: "09:00",
    birthLocation: "Cupertino, CA",
    lat: "37.3230N",
    lon: "122.0322W",
    utcOffset: "-08:00",
    description: "Apple Inc. - Founded"
  },
  "TSLA": {
    name: "TSLA",
    birthDate: "2003-07-01",
    birthTime: "09:00",
    birthLocation: "Palo Alto, CA",
    lat: "37.4419N",
    lon: "122.1430W",
    utcOffset: "-08:00",
    description: "Tesla Inc. - Founded"
  },
  "GOOGL": {
    name: "GOOGL",
    birthDate: "2004-08-19",
    birthTime: "09:00",
    birthLocation: "Mountain View, CA",
    lat: "37.4219N",
    lon: "122.0841W",
    utcOffset: "-08:00",
    description: "Google Inc. - IPO"
  },
  "MSFT": {
    name: "MSFT",
    birthDate: "1986-03-13",
    birthTime: "09:00",
    birthLocation: "Redmond, WA",
    lat: "47.6740N",
    lon: "122.1215W",
    utcOffset: "-08:00",
    description: "Microsoft Corp. - IPO"
  },
  "AMZN": {
    name: "AMZN",
    birthDate: "1997-05-15",
    birthTime: "09:00",
    birthLocation: "Seattle, WA",
    lat: "47.6062N",
    lon: "122.3321W",
    utcOffset: "-08:00",
    description: "Amazon.com Inc. - IPO"
  },
  "NVDA": {
    name: "NVDA",
    birthDate: "1999-01-22",
    birthTime: "09:00",
    birthLocation: "Santa Clara, CA",
    lat: "37.3541N",
    lon: "121.9552W",
    utcOffset: "-08:00",
    description: "NVIDIA Corp. - IPO"
  }
};

// Vietnam locations for quick lookup
export const VIETNAM_LOCATIONS = {
  "Ho Chi Minh City": { lat: "10.7769N", lon: "106.7009E" },
  "Hanoi": { lat: "21.0285N", lon: "105.8542E" },
  "Da Nang": { lat: "16.0544N", lon: "108.2022E" },
  "Hai Phong": { lat: "20.8449N", lon: "106.6881E" },
  "Can Tho": { lat: "10.0452N", lon: "105.7469E" },
  "Nha Trang": { lat: "12.2388N", lon: "109.1967E" },
  "Hue": { lat: "16.4637N", lon: "107.5909E" },
  "Vung Tau": { lat: "10.3459N", lon: "107.0843E" }
}; 