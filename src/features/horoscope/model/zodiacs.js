export const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
];

export const validatePredictions = (jsonData) => {
    if (!jsonData || !jsonData.predictions || !Array.isArray(jsonData.predictions)) {
        return { isValid: false, error: "Invalid JSON structure: missing predictions array" };
    }

    const foundSigns = new Set();
    const missingSigns = new Set(zodiacSigns);
    const duplicates = new Set();
    const invalidSigns = new Set();

    jsonData.predictions.forEach((prediction, index) => {
        if (!prediction.zodiacName) {
            invalidSigns.add(`Prediction at index ${index}: missing zodiacName`);
            return;
        }

        const zodiacName = prediction.zodiacName;

        if (!zodiacSigns.includes(zodiacName)) {
            invalidSigns.add(`"${zodiacName}" at index ${index}`);
        }

        if (foundSigns.has(zodiacName)) {
            duplicates.add(zodiacName);
        } else {
            foundSigns.add(zodiacName);
            missingSigns.delete(zodiacName);
        }
    });

    const errors = [];

    if (missingSigns.size > 0) {
        errors.push(`Missing zodiac signs: ${Array.from(missingSigns).join(', ')}`);
    }

    if (duplicates.size > 0) {
        errors.push(`Duplicate zodiac signs: ${Array.from(duplicates).join(', ')}`);
    }

    if (invalidSigns.size > 0) {
        errors.push(`Invalid zodiac signs: ${Array.from(invalidSigns).join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        stats: {
            totalPredictions: jsonData.predictions.length,
            uniqueSignsFound: foundSigns.size,
            missingSigns: Array.from(missingSigns),
            duplicateSigns: Array.from(duplicates),
            invalidSigns: Array.from(invalidSigns)
        }
    };
}