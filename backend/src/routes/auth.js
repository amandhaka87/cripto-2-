import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { protect, pendingTwoFA } from '../middleware/auth.js'
import { verifyLoginOTP } from '../controllers/twoFAController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.post('/2fa/verify-login', pendingTwoFA, verifyLoginOTP)

export default router
