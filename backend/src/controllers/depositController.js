import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { sendEmail, templates } from '../utils/emailService.js'

const PLANS = {
  Silver:   { roi: 8,  durationMonths: 3,  min: 100,   max: 999   },
  Gold:     { roi: 15, durationMonths: 6,  min: 1000,  max: 9999  },
  Platinum: { roi: 25, durationMonths: 12, min: 10000, max: 100000 },
}

// User submits deposit (txHash from Trust Wallet)
export const submitDeposit = async (req, res) => {
  try {
    const { planName, amount, txHash, walletAddress } = req.body

    if (!planName || !amount || !txHash) {
      return res.status(400).json({ success: false, message: 'Plan, amount and txHash are required' })
    }

    const config = PLANS[planName]
    if (!config) return res.status(400).json({ success: false, message: 'Invalid plan name' })

    const amt = parseFloat(amount)
    if (amt < config.min || amt > config.max) {
      return res.status(400).json({
        success: false,
        message: `Amount must be between $${config.min} and $${config.max} for ${planName} plan`,
      })
    }

    // Check duplicate txHash
    const existing = await Transaction.findOne({ txHash })
    if (existing) {
      return res.status(400).json({ success: false, message: 'This transaction hash already exists' })
    }

    const tx = await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount: amt,
      status: 'pending',
      txHash,
      walletAddress: walletAddress || '',
      plan: planName,
      notes: `User submitted deposit for ${planName} plan`,
    })

    // Store pending plan info on user
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + config.durationMonths)

    await User.findByIdAndUpdate(req.user._id, {
      'activePlan.name': planName,
      'activePlan.invested': amt,
      'activePlan.roi': config.roi,
      'activePlan.startDate': new Date(),
      'activePlan.endDate': endDate,
      'activePlan.status': 'pending',
    })

    // Email: deposit received
    sendEmail({
      to: req.user.email,
      subject: '⏳ Deposit Received — Pending Verification',
      html: templates.depositSubmitted(req.user.name, planName, amt, txHash),
    })

    res.status(201).json({
      success: true,
      message: 'Deposit submitted. Admin will confirm within 24 hours.',
      transactionId: tx._id,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Get company wallet address
export const getWalletInfo = (req, res) => {
  res.json({
    success: true,
    wallet: process.env.COMPANY_USDT_WALLET,
    network: process.env.USDT_NETWORK || 'TRC-20',
    minConfirmations: 19,
  })
}

// Admin: get all pending deposits
export const getPendingDeposits = async (req, res) => {
  try {
    const deposits = await Transaction.find({ type: 'deposit', status: 'pending' })
      .populate('user', 'name email phone activePlan')
      .sort({ createdAt: -1 })

    res.json({ success: true, data: deposits, count: deposits.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Admin: confirm deposit
export const confirmDeposit = async (req, res) => {
  try {
    const { txId } = req.params

    const tx = await Transaction.findById(txId).populate('user')
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' })
    if (tx.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Transaction already ${tx.status}` })
    }

    // Mark transaction completed
    tx.status = 'completed'
    tx.processedAt = new Date()
    await tx.save()

    // Activate user plan
    const depositor = await User.findByIdAndUpdate(tx.user._id, {
      'activePlan.status': 'active',
    }, { new: true })

    // Referral bonus — pay referrer
    const REFERRAL_PCT = { Silver: 3, Gold: 5, Platinum: 7 }
    if (depositor?.referredBy) {
      const pct = REFERRAL_PCT[tx.plan] || 3
      const bonus = (tx.amount * pct) / 100

      const referrer = await User.findByIdAndUpdate(depositor.referredBy, {
        $inc: { 'wallet.balance': bonus, 'wallet.totalEarned': bonus, referralEarnings: bonus },
      }, { new: true })

      await Transaction.create({
        user: depositor.referredBy,
        type: 'referral_bonus',
        amount: bonus,
        status: 'completed',
        plan: tx.plan,
        notes: `Referral bonus (${pct}%) from ${depositor.name}`,
        processedAt: new Date(),
      })

      // Email referrer
      if (referrer) {
        sendEmail({
          to: referrer.email,
          subject: `🎁 Referral Bonus: +$${bonus} USDT Credited!`,
          html: templates.referralBonus(referrer.name, depositor.name, tx.plan, bonus),
        })
      }
    }

    // Email user: plan activated
    const monthlyRoi = ((tx.amount * (depositor?.activePlan?.roi || 0)) / 100).toFixed(2)
    sendEmail({
      to: tx.user.email,
      subject: `🚀 ${tx.plan} Plan Activated — Welcome to CriptoX!`,
      html: templates.depositConfirmed(tx.user.name, tx.plan, tx.amount, monthlyRoi),
    })

    res.json({ success: true, message: 'Deposit confirmed. Plan activated.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Admin: reject deposit
export const rejectDeposit = async (req, res) => {
  try {
    const { txId } = req.params
    const { reason } = req.body

    const tx = await Transaction.findById(txId)
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' })
    if (tx.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Transaction already ${tx.status}` })
    }

    tx.status = 'rejected'
    tx.notes = reason || 'Rejected by admin'
    tx.processedAt = new Date()
    await tx.save()

    // Reset user plan
    const rejectedUser = await User.findByIdAndUpdate(tx.user, {
      $unset: { activePlan: '' },
    }, { new: true }).populate('user')

    // Email: deposit rejected
    const userDoc = await User.findById(tx.user)
    if (userDoc) {
      sendEmail({
        to: userDoc.email,
        subject: '❌ Deposit Verification Failed',
        html: templates.depositRejected(userDoc.name, tx.plan, tx.amount, reason),
      })
    }

    res.json({ success: true, message: 'Deposit rejected.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
