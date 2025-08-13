/**
 * Calculates the estimated calories burned from a number of steps using a more advanced formula.
 * This function incorporates gender and height to estimate stride length and total distance,
 * leading to a more personalized and accurate calorie count.
 *
 * @param {string} gender - 'male' or 'female'.
 * @param {number} age - Age in years.
 * @param {number} weight - Weight in kilograms.
 * @param {number} height - Height in centimeters.
 * @param {number} steps - Total number of steps.
 * @returns {number} The estimated total calories burned, rounded to the nearest whole number.
 */
function calculateCaloriesBurnedFromSteps(gender, age, weight, height, steps) {
    // Validate inputs to ensure they are valid.
    if (typeof weight !== 'number' || weight <= 0 ||
        typeof height !== 'number' || height <= 0 ||
        typeof age !== 'number' || age <= 0 ||
        typeof steps !== 'number' || steps <= 0 ||
        !['male', 'female'].includes(gender)) {
        console.error("Invalid input for calorie calculation. Please provide valid numbers and gender.");
        return 0;
    }

    // Step 1: Estimate stride length based on height and gender.
    // The coefficients (0.415 for men, 0.413 for women) are common approximations.
    let strideLengthMeters;
    if (gender === 'male') {
        strideLengthMeters = height * 0.415 / 100; // Convert cm to meters
    } else {
        strideLengthMeters = height * 0.413 / 100; // Convert cm to meters
    }
    
    // Step 2: Calculate total distance walked in kilometers.
    const distanceKm = (steps * strideLengthMeters) / 1000;

    // Step 3: Calculate calories burned using weight and distance.
    // A common formula is Cal/km = weight_kg * 0.7. This is a better estimate
    // than the simple steps-to-calories ratio, as it accounts for distance.
    const caloriesBurned = weight * distanceKm * 0.7;

    return Math.round(caloriesBurned);
}