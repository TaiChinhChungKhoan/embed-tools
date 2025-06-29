/**
 * Calculate days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Number of days between dates
 */
export function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date2.getTime() - date1.getTime())) / oneDay);
}

/**
 * Returns the difference date2 − date1, in whole days.
 * Positive if date2 is after date1, negative if before.
 */
export function daysDiff(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * Get Julian Day Number and Julian Day for a JS Date (UTC)
 * @param {Date} date - JS Date
 * @returns {{ jdn: number, jd: number }} Julian Day Number and Julian Day
 */
export function getJulianValues(date) {
    // milliseconds since Unix epoch
    const ms = date.getTime();
    // convert to Julian Day: epoch JD 2440587.5 at 1970-01-01T00:00:00Z
    const jd = ms / 86400000 + 2440587.5;
    // Julian Day Number is the integer day count
    const jdn = Math.floor(jd + 0.5);
    return { jdn, jd };
}

/**
 * Convert Julian Day to JS Date (UTC)
 * @param {number} jd - Julian Day
 * @returns {Date}
 */
export function julianDayToDate(jd) {
    // JD 2440587.5 corresponds to Unix epoch 1970-01-01T00:00:00Z
    const ms = (jd - 2440587.5) * 86400000;
    return new Date(ms);
}

/**
 * Convert JS Date to Julian Day (UTC)
 * @param {Date} date - JS Date
 * @returns {number} Julian Day
 */
export function dateToJulianDay(date) {
    return getJulianValues(date).jd;
}

/**
 * Add days to a date
 * @param {Date} date - Date
 * @param {number} days - Number of days to add
 * @returns {Date} Date with days added
 */
export function addDays(date, days) {
    return new Date(date.getTime() + days * 86400e3);
}
