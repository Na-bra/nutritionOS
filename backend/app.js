/**
 * Express application instance and route mounting.
 * This file configures middleware and mounts routes used by the API.
 */
const express = require('express')
const app = express();

// Parse incoming JSON requests
app.use(express.json())

// Healthcheck route — quick way to verify API is reachable
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API running' })
})

// Authentication routes (register / login)
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

module.exports = app