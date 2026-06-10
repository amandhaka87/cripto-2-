import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'roi_credit', 'referral_bonus', 'admin_credit', 'spin_reward'],
    required: true,
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'rejected'], default: 'pending' },
  txHash: { type: String },
  walletAddress: { type: String },
  plan: { type: String },
  notes: { type: String },
  processedAt: Date,
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
