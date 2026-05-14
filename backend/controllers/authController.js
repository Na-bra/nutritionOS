/**
 * Authentication controller
 * Handles user registration and login, issuing JWTs on success.
 */
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// JWT configuration (override via environment variables in production)
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret'
const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d'

// Register a new user. Expects { name, email, password } in the request body.
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })

    // Prevent duplicate signups
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already in use' })

    // User model hashes the password in a pre-save hook
    const user = await User.create({ name, email, password })
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiry })
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: err.message || 'Registration failed' })
  }
}

// Login existing user. Expects { email, password } in the request body.
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    // Compare supplied password with stored hash
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiry })
    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
