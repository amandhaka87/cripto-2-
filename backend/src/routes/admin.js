import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import { getStats, getUsers, updateKYC, toggleUserStatus, creditROI } from '../controllers/adminController.js'

const router = express.Router()
router.use(protect, adminOnly)

router.get('/stats', getStats)
router.get('/users', getUsers)
router.patch('/users/:userId/kyc', updateKYC)
router.patch('/users/:userId/toggle', toggleUserStatus)
router.post('/users/:userId/credit-roi', creditROI)

export default router
