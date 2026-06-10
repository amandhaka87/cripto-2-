import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

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
