import express from 'express'
import { getDashboard, getTransactions, updateProfile, getReferrals, requestWithdrawal, getWithdrawals } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/dashboard', getDashboard)
router.get('/transactions', getTransactions)
router.put('/profile', updateProfile)
router.get('/referrals', getReferrals)
router.post('/withdraw', requestWithdrawal)
router.get('/withdrawals', getWithdrawals)

export default router
