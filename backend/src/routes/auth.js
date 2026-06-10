import express from 'express'
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js'
import { protect, pendingTwoFA } from '../middleware/auth.js'
import { verifyLoginOTP } from '../controllers/twoFAController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.post('/2fa/verify-login', pendingTwoFA, verifyLoginOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
