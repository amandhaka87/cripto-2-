import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'

// Protected — generate secret + QR code (user scans in Google Authenticator)
export const generate2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `CriptoX (${req.user.email})`,
      length: 20,
    })

    // Store secret but don't enable yet — user must verify OTP first
    await User.findByIdAndUpdate(req.user._id, { 'twoFA.secret': secret.base32 })

    const qr = await QRCode.toDataURL(secret.otpauth_url)
    res.json({ success: true, secret: secret.base32, qr })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Protected — verify OTP and activate 2FA
export const enable2FA = async (req, res) => {
  try {
    const { otp } = req.body
    const user = await User.findById(req.user._id)

    if (!user.twoFA?.secret) {
      return res.status(400).json({ success: false, message: 'Generate 2FA QR first' })
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFA.secret,
      encoding: 'base32',
      token: String(otp),
      window: 1,
    })

    if (!valid) return res.status(400).json({ success: false, message: 'Invalid OTP — check Google Authenticator' })

    user.twoFA.enabled = true
    await user.save()
    res.json({ success: true, message: '2FA enabled successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Protected — verify OTP and disable 2FA
export const disable2FA = async (req, res) => {
  try {
    const { otp } = req.body
    const user = await User.findById(req.user._id)

    if (!user.twoFA?.enabled) {
      return res.status(400).json({ success: false, message: '2FA is not enabled' })
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFA.secret,
      encoding: 'base32',
      token: String(otp),
      window: 1,
    })

    if (!valid) return res.status(400).json({ success: false, message: 'Invalid OTP' })

    user.twoFA.enabled = false
    user.twoFA.secret = undefined
    await user.save()
    res.json({ success: true, message: '2FA disabled' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Semi-public (pendingTwoFA middleware) — verify OTP during login, return real JWT
export const verifyLoginOTP = async (req, res) => {
  try {
    const { otp } = req.body
    const user = req.user // set by pendingTwoFA middleware

    const valid = speakeasy.totp.verify({
      secret: user.twoFA.secret,
      encoding: 'base32',
      token: String(otp),
      window: 1,
    })

    if (!valid) return res.status(400).json({ success: false, message: 'Invalid OTP. Try again.' })

    const token = signToken(user._id)
    res.json({ success: true, token, user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
