import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

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
    await User.findByIdAndUpdate(tx.user._id, {
      'activePlan.status': 'active',
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
    await User.findByIdAndUpdate(tx.user, {
      $unset: { activePlan: '' },
    })

    res.json({ success: true, message: 'Deposit rejected.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
