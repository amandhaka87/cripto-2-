import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { createNotification } from '../controllers/notificationController.js'

const router = express.Router()
router.use(protect)

// Top investors by referral count
router.get('/referrals', async (req, res) => {
  try {
    const top = await User.find({ referralCount: { $gt: 0 } })
      .select('name referralCount referralEarnings activePlan.name')
      .sort({ referralCount: -1 })
      .limit(20)

    res.json({ success: true, data: top })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Top investors by investment amount
router.get('/investors', async (req, res) => {
  try {
    const top = await User.find({ 'activePlan.invested': { $gt: 0 } })
      .select('name activePlan.name activePlan.invested activePlan.roi')
      .sort({ 'activePlan.invested': -1 })
      .limit(20)

    res.json({ success: true, data: top })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// My rank
router.get('/my-rank', async (req, res) => {
  try {
    const myInvested = req.user.activePlan?.invested || 0
    const myReferrals = req.user.referralCount || 0

    const [investorRank, referralRank] = await Promise.all([
      User.countDocuments({ 'activePlan.invested': { $gt: myInvested } }),
      User.countDocuments({ referralCount: { $gt: myReferrals } }),
    ])

    res.json({
      success: true,
      data: {
        investorRank: investorRank + 1,
        referralRank: referralRank + 1,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Daily spin — reward
router.post('/spin', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // Check if already spun today
    const today = new Date().toDateString()
    const lastSpin = user.lastSpinDate ? new Date(user.lastSpinDate).toDateString() : null
    if (lastSpin === today) {
      return res.status(400).json({ success: false, message: 'Already spun today. Come back tomorrow!' })
    }

    const REWARDS = [
      { label: 'Try Again', amount: 0, probability: 35 },
      { label: '$1 Bonus', amount: 1, probability: 25 },
      { label: '$5 Bonus', amount: 5, probability: 18 },
      { label: '$10 Bonus', amount: 10, probability: 12 },
      { label: '$25 Bonus', amount: 25, probability: 7 },
      { label: '$50 Bonus', amount: 50, probability: 2.5 },
      { label: '$100 Bonus', amount: 100, probability: 0.5 },
    ]

    const rand = Math.random() * 100
    let cumulative = 0
    let reward = REWARDS[0]
    for (const r of REWARDS) {
      cumulative += r.probability
      if (rand <= cumulative) { reward = r; break }
    }

    // Credit reward
    if (reward.amount > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'wallet.balance': reward.amount, 'wallet.totalEarned': reward.amount },
        lastSpinDate: new Date(),
      })
      await Transaction.create({
        user: req.user._id,
        type: 'spin_reward',
        amount: reward.amount,
        status: 'completed',
        notes: `Spin wheel reward: ${reward.label}`,
        processedAt: new Date(),
      })
      createNotification(
        req.user._id,
        'Spin Reward Won!',
        `You won ${reward.label} from the daily spin wheel. Credited to your wallet.`,
        'spin'
      )
    } else {
      await User.findByIdAndUpdate(req.user._id, { lastSpinDate: new Date() })
    }

    res.json({ success: true, reward })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
