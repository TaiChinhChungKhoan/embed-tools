/**
 * Get browser locale with fallback to Vietnamese
 * @returns {string} The browser locale or 'vi-VN' as fallback
 */
export const getBrowserLocale = () => {
  const browserLocale = navigator.language || navigator.userLanguage || 'vi-VN';
  return browserLocale.startsWith('vi') ? 'vi-VN' : browserLocale;
};

/**
 * Get browser language code (e.g., 'vi', 'en', 'fr')
 * @returns {string} The browser language code
 */
export const getBrowserLanguage = () => {
  const browserLocale = navigator.language || navigator.userLanguage || 'vi-VN';
  return browserLocale.split('-')[0];
};

/**
 * Check if browser locale is Vietnamese
 * @returns {boolean} True if browser locale is Vietnamese
 */
export const isVietnameseLocale = () => {
  const browserLocale = navigator.language || navigator.userLanguage || 'vi-VN';
  return browserLocale.startsWith('vi');
};

/**
 * Create a timezone-aware Date object for BaziCalculator
 * IMPORTANT: BaziCalculator requires timezone-aware Date objects created with toDate from date-fns-tz
 * Regular Date objects will not work correctly for timezone-sensitive calculations
 * 
 * @param {Date} birthDate - The birth date
 * @param {string} birthTime - The birth time in HH:mm format
 * @param {string} timeZone - The IANA timezone string
 * @param {boolean} isTimeKnown - Whether birth time is known
 * @param {Function} toDate - The toDate function from date-fns-tz
 * @returns {Date} A timezone-aware Date object
 */
export const createBaziDate = (birthDate, birthTime, timeZone, isTimeKnown, toDate) => {
  const yyyy = birthDate.getFullYear();
  const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
  const dd = String(birthDate.getDate()).padStart(2, '0');
  const birthDateStr = `${yyyy}-${mm}-${dd}`;
  
  return isTimeKnown ?
    toDate(`${birthDateStr}T${birthTime}:00`, { timeZone }) :
    toDate(birthDateStr, { timeZone });
}; 