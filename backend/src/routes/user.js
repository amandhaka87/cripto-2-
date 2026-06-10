import express from 'express'
import { getDashboard, getTransactions, updateProfile, getReferrals, requestWithdrawal, getWithdrawals } from '../controllers/userController.js'
import { generate2FA, enable2FA, disable2FA } from '../controllers/twoFAController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/dashboard', getDashboard)
router.get('/transactions', getTransactions)
router.put('/profile', updateProfile)
router.get('/referrals', getReferrals)
router.post('/withdraw', requestWithdrawal)
router.get('/withdrawals', getWithdrawals)

router.post('/2fa/generate', generate2FA)
router.post('/2fa/enable', enable2FA)
router.post('/2fa/disable', disable2FA)

export default router
