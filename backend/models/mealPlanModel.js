/**
 * MealPlan model
 * Associates a user with a set of meals for a given date and stores the
 * aggregated calorie total. Useful for daily meal planning and history.
 */
const mongoose = require('mongoose')

const mealPlanSchema = new mongoose.Schema({
	// Owner of the meal plan
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	// Array of Meal references (order matters if you want breakfast->dinner)
	meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
	// Cached total calories for quick lookup
	totalCalories: { type: Number, min: 0, default: 0 },
	// The date this plan applies to (defaults to now)
	date: { type: Date, required: true, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('MealPlan', mealPlanSchema)

