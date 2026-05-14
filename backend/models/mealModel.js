/**
 * Meal model
 * Represents a single meal/food item and its macronutrient/calorie breakdown.
 */
const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
  mealName: { type: String, required: true, trim: true },
  calories: { type: Number, min: 0, default: 0 },
  protein: { type: Number, min: 0, default: 0 },
  carbs: { type: Number, min: 0, default: 0 },
  fat: { type: Number, min: 0, default: 0 },
  // Category helps group meals by typical time or purpose
  category: { type: String, trim: true, enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'], default: 'other' },
  // Ingredient list for display or filtering
  ingredients: { type: [String], default: [] },
  // e.g. 'vegan', 'vegetarian', 'keto', 'paleo', etc.
  dietType: { type: String, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('Meal', mealSchema)
