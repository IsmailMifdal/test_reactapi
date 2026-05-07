/**
 * Calculate a person's age in years
 *
 * @param {object} p An object representing a person, implementing a birth Date parameter.
 * @returns {number} The age of the person in years.
 */
function calculateAge(p) {
    if (!p) throw new Error("missing param p");
    if (!p.birth) throw new Error("missing birth date");
    let dateDiff = new Date(Date.now() - p.birth.getTime());
    let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
    return age;
}

/**
 * Check if a person is an adult (18 years old or more).
 *
 * @param {object} p An object implementing a birth Date parameter.
 * @returns {boolean} True if age >= 18.
 */
function isAdult(p) {
    if (!p) throw new Error("missing param p");
    if (!p.birth || (p.birth instanceof Date && isNaN(p.birth.getTime())))
        throw new Error("missing birth date");
    return calculateAge(p) >= 18;
}

/**
 * Validate a French postal code (exactly 5 digits).
 *
 * @param {string} code The postal code to validate.
 * @returns {boolean} True if valid.
 */
function isValidPostalCode(code) {
    if (typeof code !== 'string') return false;
    return /^\d{5}$/.test(code);
}

/**
 * Validate a name field (nom, prénom, ville).
 * Accepts letters including accented characters, hyphens, apostrophes and spaces.
 * Rejects digits and special characters.
 *
 * @param {string} name The value to validate.
 * @returns {boolean} True if valid.
 */
function isValidName(name) {
    if (typeof name !== 'string' || name.trim().length === 0) return false;
    return /^[a-zA-ZÀ-ÿœŒæÆ\s\-']+$/.test(name.trim());
}

/**
 * Validate an email address.
 *
 * @param {string} email The email to validate.
 * @returns {boolean} True if valid.
 */
function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export { calculateAge, isAdult, isValidPostalCode, isValidName, isValidEmail };