/**
 * User model
 * Stores user profile and credential data. Passwords are hashed using bcrypt
 * before being persisted. The schema includes common profile fields used by
 * the nutrition app (age, weight, height, goals, allergies, preferences).
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
	// Full name for display
	name: { type: String, required: true, trim: true },
	// Email is used as the unique login identifier
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
	},
	// Hashed password (plaintext never stored)
	password: { type: String, required: true },
	age: { type: Number, min: 0 },
	weight: { type: Number, min: 0 },
	height: { type: Number, min: 0 },
	// Goal can be one of the enumerated values or 'custom'
	goal: { type: String, enum: ['lose', 'maintain', 'gain', 'custom'], default: 'maintain' },
	// Array of allergy strings (e.g. ['peanuts', 'gluten'])
	allergies: { type: [String], default: [] },
	// Free-form preferences object for UI/settings
	preferences: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true })

// Pre-save hook: hash the password when it's created or changed.
userSchema.pre('save', async function () {
	if (!this.isModified('password')) return
	try {
		const saltRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10
		const hash = await bcrypt.hash(this.password, saltRounds)
		this.password = hash
	} catch (err) {
		throw err
	}
})

// Instance helper: compare a candidate password with the stored hash.
userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)

