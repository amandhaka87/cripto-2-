import User from '../models/User.js'
import { sendTokenResponse, signTempToken } from '../utils/jwt.js'
import { generateReferralCode } from '../utils/referral.js'
import { sendEmail, templates } from '../utils/emailService.js'

const PLAN_CONFIG = {
  Silver:   { roi: 8,  durationMonths: 3 },
  Gold:     { roi: 15, durationMonths: 6 },
  Platinum: { roi: 25, durationMonths: 12 },
}

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, plan, referralCode } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' })

    // Handle referral
    let referrer = null
    if (referralCode) {
      referrer = await User.findOne({ referralCode })
    }

    const newReferralCode = generateReferralCode(name)
    const user = await User.create({
      name, email, phone, password,
      referralCode: newReferralCode,
      referredBy: referrer?._id,
    })

    // Increment referrer count
    if (referrer) {
      referrer.referralCount += 1
      await referrer.save()
    }

    // Welcome email
    sendEmail({
      to: user.email,
      subject: '🎉 Welcome to CriptoX — Your Account is Ready!',
      html: templates.welcome(user.name, newReferralCode),
    })

    sendTokenResponse(user, 201, res)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }
    res.status(500).json({ success: false, message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' })
    }

    // If 2FA is enabled, return a short-lived temp token instead of the real JWT
    if (user.twoFA?.enabled) {
      return res.json({
        success: true,
        requiresTwoFA: true,
        tempToken: signTempToken(user._id),
      })
    }

    // Login alert email
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    sendEmail({
      to: user.email,
      subject: '🔐 New Login to Your CriptoX Account',
      html: templates.loginAlert(user.name, now, null),
    })

    sendTokenResponse(user, 200, res)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() })
}
