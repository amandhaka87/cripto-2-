import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { sendEmail, templates } from '../utils/emailService.js'
import { createNotification } from './notificationController.js'

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(10)

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
        transactions,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Transaction.countDocuments({ user: req.user._id })
    res.json({ success: true, data: transactions, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone']
    const updates = {}
    allowed.forEach(field => { if (req.body[field]) updates[field] = req.body[field] })

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json({ success: true, user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getReferrals = async (req, res) => {
  try {
    const referrals = await User.find({ referredBy: req.user._id })
      .select('name email createdAt activePlan.name')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: {
        code: req.user.referralCode,
        count: req.user.referralCount,
        earnings: req.user.referralEarnings,
        referrals,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body
    const amt = parseFloat(amount)

    if (!amt || !walletAddress) {
      return res.status(400).json({ success: false, message: 'Amount and wallet address are required' })
    }
    if (amt < 10) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is $10 USDT' })
    }

    const user = await User.findById(req.user._id)
    if (user.wallet.balance < amt) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' })
    }

    // Hold funds immediately
    user.wallet.balance -= amt
    await user.save()

    const tx = await Transaction.create({
      user: user._id,
      type: 'withdrawal',
      amount: amt,
      status: 'pending',
      walletAddress,
      notes: `Withdrawal request to ${walletAddress}`,
    })

    sendEmail({
      to: user.email,
      subject: `⏳ Withdrawal Request: $${amt} USDT`,
      html: templates.withdrawalSubmitted(user.name, amt, walletAddress),
    })

    createNotification(
      user._id,
      'Withdrawal Request Submitted',
      `Your withdrawal request for $${amt} USDT has been submitted. Admin will process it within 24 hours.`,
      'withdrawal'
    )

    res.status(201).json({ success: true, message: 'Withdrawal request submitted', transactionId: tx._id })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ user: req.user._id, type: 'withdrawal' })
      .sort({ createdAt: -1 })
    res.json({ success: true, data: withdrawals })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
