import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

const router = express.Router()
router.use(protect)

const PLANS = {
  Silver:   { roi: 8,  durationMonths: 3,  min: 100,   max: 999   },
  Gold:     { roi: 15, durationMonths: 6,  min: 1000,  max: 9999  },
  Platinum: { roi: 25, durationMonths: 12, min: 10000, max: 100000 },
}

// Activate a plan after deposit
router.post('/activate', async (req, res) => {
  try {
    const { planName, amount, txHash, walletAddress } = req.body

    const config = PLANS[planName]
    if (!config) return res.status(400).json({ success: false, message: 'Invalid plan' })
    if (amount < config.min || amount > config.max) {
      return res.status(400).json({ success: false, message: `Amount must be $${config.min}–$${config.max}` })
    }

    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + config.durationMonths)

    await User.findByIdAndUpdate(req.user._id, {
      activePlan: {
        name: planName,
        invested: amount,
        roi: config.roi,
        startDate: new Date(),
        endDate,
        status: 'active',
      },
    })

    await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount,
      status: 'pending',
      txHash,
      walletAddress,
      plan: planName,
    })

    res.json({ success: true, message: 'Plan activation pending deposit confirmation' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.get('/info', (req, res) => {
  res.json({ success: true, plans: PLANS })
})

export default router
