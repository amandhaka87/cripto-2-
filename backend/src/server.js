import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import planRoutes from './routes/plan.js'
import adminRoutes from './routes/admin.js'
import depositRoutes from './routes/deposit.js'

dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174', credentials: true }))
app.use(express.json({ limit: '10kb' }))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' })
app.use('/api/', limiter)

const authLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many auth attempts' })
app.use('/api/auth/', authLimiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/deposit', depositRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' })
})

// Connect DB and start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  })
