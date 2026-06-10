import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { sendEmail, templates } from '../utils/emailService.js'
import { createNotification } from './notificationController.js'

export const getStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, kycPending, transactions] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ 'kyc.status': 'submitted' }),
      Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    ])

    const planCounts = await User.aggregate([
      { $match: { 'activePlan.name': { $exists: true } } },
      { $group: { _id: '$activePlan.name', count: { $sum: 1 }, invested: { $sum: '$activePlan.invested' } } },
    ])

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        kycPending,
        totalInvested: transactions[0]?.total || 0,
        planCounts,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, kyc, status } = req.query
    const query = {}
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }]
    if (kyc) query['kyc.status'] = kyc
    if (status === 'active') query.isActive = true
    if (status === 'suspended') query.isActive = false

    const users = await User.find(query)
      .select('-password -twoFA.secret -emailVerifyToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)
    res.json({ success: true, data: users, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const updateKYC = async (req, res) => {
  try {
    const { userId } = req.params
    const { status, rejectionReason } = req.body

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid KYC status' })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        'kyc.status': status,
        'kyc.reviewedAt': new Date(),
        ...(rejectionReason && { 'kyc.rejectionReason': rejectionReason }),
      },
      { new: true }
    )

    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (status === 'verified') {
      sendEmail({ to: user.email, subject: '✅ KYC Verified — Full Access Granted', html: templates.kycApproved(user.name) })
      createNotification(userId, 'KYC Verified', 'Your identity has been verified. You now have full access to all features.', 'kyc')
    } else {
      sendEmail({ to: user.email, subject: '❌ KYC Rejected — Action Required', html: templates.kycRejected(user.name, rejectionReason) })
      createNotification(userId, 'KYC Rejected', `Your KYC was rejected. Reason: ${rejectionReason || 'Documents unclear'}. Please resubmit.`, 'kyc')
    }

    res.json({ success: true, message: `KYC ${status}`, user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    user.isActive = !user.isActive
    await user.save()
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'suspended'}`, isActive: user.isActive })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const creditROI = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user || !user.activePlan?.name) {
      return res.status(400).json({ success: false, message: 'No active plan found' })
    }

    const roiAmount = (user.activePlan.invested * user.activePlan.roi) / 100
    user.wallet.balance += roiAmount
    user.wallet.totalEarned += roiAmount

    await user.save()
    await Transaction.create({ user: userId, type: 'roi_credit', amount: roiAmount, status: 'completed', plan: user.activePlan.name })

    sendEmail({
      to: user.email,
      subject: `💰 Monthly ROI Credited: +$${roiAmount} USDT`,
      html: templates.roiCredited(user.name, user.activePlan.name, roiAmount, user.wallet.balance.toFixed(2)),
    })

    createNotification(
      userId,
      'Monthly ROI Credited',
      `$${roiAmount} ROI has been added to your wallet from your ${user.activePlan.name} plan.`,
      'roi'
    )

    res.json({ success: true, message: `ROI of $${roiAmount} credited`, roiAmount })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'withdrawal', status: 'pending' })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: withdrawals, count: withdrawals.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const approveWithdrawal = async (req, res) => {
  try {
    const { txId } = req.params
    const { txHash } = req.body

    const tx = await Transaction.findById(txId).populate('user')
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' })
    if (tx.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Transaction already ${tx.status}` })
    }

    tx.status = 'completed'
    tx.txHash = txHash || ''
    tx.processedAt = new Date()
    await tx.save()

    sendEmail({
      to: tx.user.email,
      subject: `✅ Withdrawal Sent: $${tx.amount} USDT`,
      html: templates.withdrawalApproved(tx.user.name, tx.amount, txHash),
    })

    createNotification(
      tx.user._id,
      'Withdrawal Approved',
      `Your withdrawal of $${tx.amount} USDT has been processed and sent to your wallet.`,
      'withdrawal'
    )

    res.json({ success: true, message: 'Withdrawal approved and marked as sent' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const rejectWithdrawal = async (req, res) => {
  try {
    const { txId } = req.params
    const { reason } = req.body

    const tx = await Transaction.findById(txId).populate('user')
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' })
    if (tx.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Transaction already ${tx.status}` })
    }

    tx.status = 'rejected'
    tx.notes = reason || 'Rejected by admin'
    tx.processedAt = new Date()
    await tx.save()

    // Refund balance
    await User.findByIdAndUpdate(tx.user._id, {
      $inc: { 'wallet.balance': tx.amount },
    })

    sendEmail({
      to: tx.user.email,
      subject: `❌ Withdrawal Rejected — $${tx.amount} Refunded`,
      html: templates.withdrawalRejected(tx.user.name, tx.amount, reason),
    })

    createNotification(
      tx.user._id,
      'Withdrawal Rejected',
      `Your withdrawal of $${tx.amount} was rejected. Reason: ${reason || 'Admin review failed'}. Amount has been refunded to your wallet.`,
      'withdrawal'
    )

    res.json({ success: true, message: 'Withdrawal rejected, balance refunded' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
