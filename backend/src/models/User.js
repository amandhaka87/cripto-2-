import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // KYC
  kyc: {
    status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected'], default: 'pending' },
    documents: [{ type: String }],
    submittedAt: Date,
    reviewedAt: Date,
    rejectionReason: String,
  },

  // Plan
  activePlan: {
    name: { type: String, enum: ['Silver', 'Gold', 'Platinum'] },
    invested: { type: Number, default: 0 },
    roi: { type: Number },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['active', 'matured', 'withdrawn'], default: 'active' },
  },

  // Wallet
  wallet: {
    balance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    walletAddress: { type: String },
  },

  // Referral
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCount: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },

  // Security
  twoFA: {
    enabled: { type: Boolean, default: false },
    secret: String,
  },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  isActive: { type: Boolean, default: true },
  lastSpinDate: { type: Date },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.twoFA?.secret
  delete obj.emailVerifyToken
  delete obj.passwordResetToken
  return obj
}

export default mongoose.model('User', userSchema)
