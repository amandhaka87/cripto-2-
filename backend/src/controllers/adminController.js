import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

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

    res.json({ success: true, message: `ROI of $${roiAmount} credited`, roiAmount })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
