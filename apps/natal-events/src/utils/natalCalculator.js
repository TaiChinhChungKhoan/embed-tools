// NatalCalculator - Now using @embed-tools/astro-utils for accurate astronomical calculations
import { NatalCalculator as AstroNatalCalculator, PRESET_INSTRUMENTS, VIETNAM_LOCATIONS } from '@embed-tools/astro-utils';

// Re-export the main class for backward compatibility
export default AstroNatalCalculator;

// Export preset instruments for use in components
export { PRESET_INSTRUMENTS, VIETNAM_LOCATIONS };

/**
 * Location API utility for getting coordinates
 * @param {string} location - Location name to search
 * @returns {Promise<Object>} Promise resolving to {lat, lon} coordinates
 */
export async function getLocationCoordinates(location) {
  try {
    // First check Vietnam locations
    if (VIETNAM_LOCATIONS[location]) {
      return VIETNAM_LOCATIONS[location];
    }
    
    // Then try geocoding API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      
      // Format coordinates in the expected format
      const latStr = `${Math.abs(lat).toFixed(4)}${lat >= 0 ? 'N' : 'S'}`;
      const lonStr = `${Math.abs(lon).toFixed(4)}${lon >= 0 ? 'E' : 'W'}`;
      
      return { lat: latStr, lon: lonStr };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting location coordinates:', error);
    return null;
  }
}
