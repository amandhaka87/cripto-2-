import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import { getStats, getUsers, updateKYC, toggleUserStatus, creditROI, getPendingWithdrawals, approveWithdrawal, rejectWithdrawal } from '../controllers/adminController.js'

const router = express.Router()
router.use(protect, adminOnly)

router.get('/stats', getStats)
router.get('/users', getUsers)
router.patch('/users/:userId/kyc', updateKYC)
router.patch('/users/:userId/toggle', toggleUserStatus)
router.post('/users/:userId/credit-roi', creditROI)

router.get('/withdrawals', getPendingWithdrawals)
router.patch('/withdrawals/:txId/approve', approveWithdrawal)
router.patch('/withdrawals/:txId/reject', rejectWithdrawal)

export default router
