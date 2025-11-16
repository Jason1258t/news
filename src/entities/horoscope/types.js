/**
 * @typedef {Object} ZodiacPrediction
 * @property {string} imageUrl
 * @property {string} zodiacName
 * @property {string} prediction
 */

/**
 * @typedef {Object} Horoscope
 * @property {string} imageUrl
 * @property {string} title
 * @property {string} description
 * @property {Array<ZodiacPrediction>} predictions
 * @property {Date} createdAt
 * @property {Date} startsAt
 * @property {Date} endsAt
 */

export {}; // JSDoc-only typedefs module