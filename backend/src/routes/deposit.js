import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import {
  submitDeposit,
  getWalletInfo,
  getPendingDeposits,
  confirmDeposit,
  rejectDeposit,
} from '../controllers/depositController.js'

const router = express.Router()

// User routes
router.get('/wallet-info', protect, getWalletInfo)
router.post('/submit', protect, submitDeposit)

// Admin routes
router.get('/pending', protect, adminOnly, getPendingDeposits)
router.patch('/:txId/confirm', protect, adminOnly, confirmDeposit)
router.patch('/:txId/reject', protect, adminOnly, rejectDeposit)

export default router
