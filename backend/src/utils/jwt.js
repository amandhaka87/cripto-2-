import jwt from 'jsonwebtoken'

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// Short-lived token used only between password-check and 2FA OTP verification
export const signTempToken = (id) =>
  jwt.sign({ id, type: 'pending_2fa' }, process.env.JWT_SECRET, { expiresIn: '5m' })

export const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id)
  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  })
}
