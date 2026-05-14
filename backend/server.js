/**
 * Entrypoint for starting the HTTP server.
 * Loads environment variables, connects to MongoDB, and starts the Express app.
 */
const app = require('./app')
const connectDB = require('./config/db')
require('dotenv').config()

// Prefer configured PORT, fallback to 5000
const PORT = process.env.PORT || 5000

// Connect to MongoDB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/`)
  })
}).catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})