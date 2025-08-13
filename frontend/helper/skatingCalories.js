/**
 * Calculates the estimated calories burned from a skating activity using the METs formula.
 *
 * The formula is: Calories = (METs * 3.5 * weight_kg * duration_minutes) / 200.
 *
 * @param {number} weight - Body weight in kilograms.
 * @param {number} durationMinutes - The duration of the activity in minutes.
 * @param {string} activity - The type of skating activity ('roller skating' or 'normal skating').
 * @returns {number} The estimated total calories burned, rounded to the nearest whole number.
 */
function calculateSkatingCalories(weight, durationMinutes, activity) {
    // Validate inputs.
    if (typeof weight !== 'number' || weight <= 0 ||
        typeof durationMinutes !== 'number' || durationMinutes <= 0 ||
        typeof activity !== 'string' || activity.trim() === '') {
        console.error("Invalid input for skating calorie calculation.");
        return 0;
    }

    // Define MET values for different skating activities.
    // METs (Metabolic Equivalent of Task) represent the energy cost of an activity.
    let mets;
    switch (activity.toLowerCase()) {
        case 'roller skating':
            mets = 7.0;
            break;
        case 'normal skating':
            // Using a moderate MET value as a general estimate for normal skating.
            mets = 6.0;
            break;
        default:
            console.warn(`Unknown skating activity: ${activity}. Using a default MET value of 6.0.`);
            mets = 6.0;
            break;
    }

    // Calculate calories burned using the MET formula.
    const caloriesBurned = (mets * 3.5 * weight * durationMinutes) / 200;
    
    return Math.round(caloriesBurned);
}