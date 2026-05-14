/**
 * Authentication middleware
 * Verifies a Bearer JWT on incoming requests and attaches the user to `req.user`.
 * Use this to protect routes that require an authenticated user.
 */
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const jwtSecret = process.env.JWT_SECRET || 'change_this_secret'

module.exports = async (req, res, next) => {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const payload = jwt.verify(token, jwtSecret)
    // Attach user to request for downstream handlers (exclude password)
    const user = await User.findById(payload.id).select('-password')
    if (!user) return res.status(401).json({ error: 'Invalid token' })
    req.user = user
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
