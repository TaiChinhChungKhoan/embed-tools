// Event formatting and visualization utilities with locale support

// Planet name translations
const PLANET_NAMES = {
  en: {
    earth: 'Earth',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    neptune: 'Neptune'
  },
  vi: {
    earth: 'Trái Đất',
    mercury: 'Sao Thủy',
    venus: 'Kim Tinh',
    mars: 'Hỏa Tinh',
    jupiter: 'Mộc Tinh',
    saturn: 'Thổ Tinh',
    neptune: 'Hải Vương Tinh'
  }
};

// Aspect color coding
export const ASPECT_COLORS = {
  'Conjunction (0°)': '#d97706',    // Orange - neutral/powerful
  'Square (90°)': '#ef4444',        // Red - challenging
  'Trine (120°)': '#10b981',        // Green - harmonious
  'Opposition (180°)': '#ec4899',   // Pink - challenging
  'Sextile (60°)': '#8b5cf6'        // Purple - harmonious
};

// Event type visuals
export const EVENT_VISUALS = {
  'season': { icon: 'Sun', color: '#d97706', meaning: 'neutral' },
  'minor-season': { icon: 'Leaf', color: '#10b981', meaning: 'neutral' },
  'new-moon': { icon: 'Moon', color: '#1d4ed8', meaning: 'new_beginning' },
  'full-moon': { icon: 'Circle', color: '#ca8a04', meaning: 'culmination' },
  'retrograde': { icon: 'ArrowLeftRight', color: '#dc2626', meaning: 'challenging' },
  'cazimi': { icon: 'Sun', color: '#d97706', meaning: 'powerful' },
  'aspect': { icon: 'Star', color: '#0d9488', meaning: 'neutral' },
  'latitude': { icon: 'Globe2', color: '#1e40af', meaning: 'significant' },
  'speed-threshold': { icon: 'GaugeCircle', color: '#ea580c', meaning: 'significant' },
  'conjunction': { icon: 'Link2', color: '#8b5cf6', meaning: 'neutral' },
  'fixed-degree': { icon: 'MapPin', color: '#8b5cf6', meaning: 'significant' },
  'pivot': { icon: 'Target', color: '#059669', meaning: 'significant' },
  'transit': { icon: 'Zap', color: '#3b82f6', meaning: 'neutral' }
};

/**
 * Get planet name in specified locale
 * @param {string} planetName - Planet name in English
 * @param {string} locale - Locale code (en, vi)
 * @returns {string} Translated planet name
 */
export function getPlanetName(planetName, locale = 'en') {
  const translations = PLANET_NAMES[locale] || PLANET_NAMES.en;
  return translations[planetName.toLowerCase()] || planetName;
}

/**
 * Get event color based on type and aspect
 * @param {string} eventType - Type of event
 * @param {string} aspectName - Name of aspect (for transit events)
 * @returns {string} Color hex code
 */
export function getEventColor(eventType, aspectName = null) {
  // For transit events, use the aspect name to determine color
  if (eventType === 'transit' && aspectName) {
    return ASPECT_COLORS[aspectName] || '#3b82f6'; // Default blue if aspect not found
  }
  
  // For other event types, use the existing logic
  const visuals = EVENT_VISUALS[eventType];
  return visuals ? visuals.color : '#6b7280';
}

/**
 * Get event visuals (icon and color)
 * @param {string} eventType - Type of event
 * @returns {Object} Object with icon, color, and meaning
 */
export function getEventVisuals(eventType) {
  return EVENT_VISUALS[eventType] || { icon: 'Sparkles', color: '#6b7280', meaning: 'neutral' };
}

/**
 * Get event meaning based on type
 * @param {string} eventType - Type of event
 * @returns {string} Meaning of the event
 */
export function getEventMeaning(eventType) {
  const visuals = getEventVisuals(eventType);
  return visuals.meaning;
}

/**
 * Format event date for display
 * @param {Date} date - Date to format
 * @param {string} locale - Locale code (en, vi)
 * @param {string} timezone - Timezone string
 * @returns {string} Formatted date string
 */
export function formatEventDate(date, locale = 'en', timezone = 'UTC') {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  };
  
  return date.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', options);
}

/**
 * Format aspect window for display
 * @param {Object} window - Aspect window object
 * @param {string} locale - Locale code (en, vi)
 * @returns {string} Formatted aspect window string
 */
export function formatAspectWindow(window, locale = 'en') {
  const start = window.startDate.toISOString().split('T')[0];
  const end = window.endDate.toISOString().split('T')[0];
  const peak = window.peakDate.toISOString().split('T')[0];
  
  const transitPlanet = getPlanetName(window.transitPlanet, locale);
  const natalPoint = getPlanetName(window.natalPoint, locale);
  
  if (locale === 'vi') {
    return `${start} – ${end}: ${transitPlanet} → ${natalPoint} ${window.aspect.name} (đỉnh: ${peak}, orb: ${window.peakOrb.toFixed(2)}°, điểm: ${window.maxScore.toFixed(2)}; ${window.aspect.interpretation})`;
  } else {
    return `${start} – ${end}: ${transitPlanet} → ${natalPoint} ${window.aspect.name} (peak: ${peak}, orb: ${window.peakOrb.toFixed(2)}°, score: ${window.maxScore.toFixed(2)}; ${window.aspect.interpretation})`;
  }
}

/**
 * Create aspect event with localized formatting
 * @param {Object} event - Raw aspect event
 * @param {string} locale - Locale code (en, vi)
 * @returns {Object} Formatted aspect event
 */
export function formatAspectEvent(event, locale = 'en') {
  const planetA = getPlanetName(event.planetA || event.transitPlanet, locale);
  const planetB = getPlanetName(event.planetB || event.natalPoint, locale);
  
  if (locale === 'vi') {
    return {
      ...event,
      title: `Góc ${event.angle}° giữa ${planetA} và ${planetB}`,
      description: event.description || 'Aspect'
    };
  } else {
    return {
      ...event,
      title: `${event.angle}° Aspect between ${planetA} and ${planetB}`,
      description: event.description || 'Aspect'
    };
  }
} 