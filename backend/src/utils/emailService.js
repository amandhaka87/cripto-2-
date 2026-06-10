import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const BASE_STYLE = `
  font-family: 'Inter', Arial, sans-serif;
  background: #0B0C1E;
  color: #FFFFFF;
`

const wrapper = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0B0C1E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0C1E;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#11122B;border-radius:16px;border:1px solid rgba(123,97,255,0.2);overflow:hidden;max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7B61FF,#00D4FF);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:1.6rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">
              ⚡ CriptoX
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:0.85rem;">Crypto Investment Platform</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0A0B1E;padding:20px 32px;text-align:center;border-top:1px solid rgba(123,97,255,0.1);">
            <p style="margin:0;color:#4A5568;font-size:0.78rem;">
              © 2025 CriptoX · Powered by USDT TRC-20 ·
              <a href="#" style="color:#7B61FF;text-decoration:none;">Unsubscribe</a>
            </p>
            <p style="margin:6px 0 0;color:#4A5568;font-size:0.72rem;">
              This email was sent from jassss2580@gmail.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

const btn = (text, url) => `
  <a href="${url}" style="display:inline-block;margin-top:20px;padding:13px 28px;background:linear-gradient(135deg,#7B61FF,#00D4FF);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:0.95rem;">
    ${text}
  </a>
`

const highlight = (label, value, color = '#7B61FF') => `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid rgba(123,97,255,0.1);">
      <span style="color:#718096;font-size:0.85rem;">${label}</span>
    </td>
    <td style="padding:8px 0;border-bottom:1px solid rgba(123,97,255,0.1);text-align:right;">
      <span style="color:${color};font-weight:700;font-size:0.9rem;">${value}</span>
    </td>
  </tr>
`

// ─── TEMPLATES ──────────────────────────────────────────────────────────────

export const templates = {

  welcome: (name, referralCode) => wrapper(`
    <h2 style="color:#fff;font-size:1.4rem;margin:0 0 8px;">Welcome to CriptoX, ${name}! 🎉</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Your account is ready. Start investing and earn up to <strong style="color:#00D4FF">25% monthly ROI</strong> with our transparent USDT investment plans.
    </p>
    <table width="100%" style="background:rgba(123,97,255,0.08);border:1px solid rgba(123,97,255,0.2);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Your Referral Code', referralCode, '#7B61FF')}
      ${highlight('Platform', 'CriptoX', '#00D4FF')}
      ${highlight('Supported Network', 'USDT TRC-20', '#00FF88')}
    </table>
    <p style="color:#A0AEC0;font-size:0.85rem;margin:16px 0 0;">
      Share your referral code and earn <strong style="color:#fff">3–7%</strong> bonus on every deposit your friends make!
    </p>
    ${btn('Go to Dashboard', `${process.env.CLIENT_URL}/dashboard`)}
  `),

  loginAlert: (name, time, ip) => wrapper(`
    <h2 style="color:#fff;font-size:1.3rem;margin:0 0 8px;">New Login Detected 🔐</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Hi <strong style="color:#fff">${name}</strong>, a new login was detected on your account.
    </p>
    <table width="100%" style="background:rgba(123,97,255,0.06);border:1px solid rgba(123,97,255,0.15);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Time', time, '#A0AEC0')}
      ${highlight('IP Address', ip || 'Unknown', '#A0AEC0')}
    </table>
    <p style="color:#F6C90E;font-size:0.85rem;margin:16px 0 0;">
      ⚠️ If this wasn't you, please change your password immediately.
    </p>
    ${btn('Secure My Account', `${process.env.CLIENT_URL}/login`)}
  `),

  depositSubmitted: (name, plan, amount, txHash) => wrapper(`
    <h2 style="color:#fff;font-size:1.3rem;margin:0 0 8px;">Deposit Received ⏳</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Hi <strong style="color:#fff">${name}</strong>, we've received your deposit request. Our team will verify and activate your plan within <strong style="color:#fff">24 hours</strong>.
    </p>
    <table width="100%" style="background:rgba(123,97,255,0.06);border:1px solid rgba(123,97,255,0.15);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Plan', plan, '#F6C90E')}
      ${highlight('Amount', `$${amount} USDT`, '#00D4FF')}
      ${highlight('TxHash', txHash.slice(0, 20) + '...', '#A0AEC0')}
      ${highlight('Status', '⏳ Pending Verification', '#F6C90E')}
    </table>
    ${btn('View Dashboard', `${process.env.CLIENT_URL}/dashboard`)}
  `),

  depositConfirmed: (name, plan, amount, monthlyRoi) => wrapper(`
    <h2 style="color:#00FF88;font-size:1.3rem;margin:0 0 8px;">Plan Activated! 🚀</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Congratulations <strong style="color:#fff">${name}</strong>! Your deposit has been confirmed and your <strong style="color:#F6C90E">${plan} Plan</strong> is now active.
    </p>
    <table width="100%" style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Plan', plan, '#F6C90E')}
      ${highlight('Amount Invested', `$${amount} USDT`, '#00D4FF')}
      ${highlight('Monthly Earnings', `+$${monthlyRoi} USDT`, '#00FF88')}
      ${highlight('Status', '✅ Active', '#00FF88')}
    </table>
    <p style="color:#A0AEC0;font-size:0.85rem;margin:16px 0 0;">
      Your monthly ROI will be credited automatically. Check your dashboard for real-time updates.
    </p>
    ${btn('View My Plan', `${process.env.CLIENT_URL}/dashboard`)}
  `),

  depositRejected: (name, plan, amount, reason) => wrapper(`
    <h2 style="color:#FF3B30;font-size:1.3rem;margin:0 0 8px;">Deposit Rejected ❌</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Hi <strong style="color:#fff">${name}</strong>, unfortunately your deposit could not be verified.
    </p>
    <table width="100%" style="background:rgba(255,59,48,0.05);border:1px solid rgba(255,59,48,0.2);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Plan', plan, '#A0AEC0')}
      ${highlight('Amount', `$${amount} USDT`, '#A0AEC0')}
      ${highlight('Reason', reason || 'Transaction not found', '#FF6B6B')}
    </table>
    <p style="color:#A0AEC0;font-size:0.85rem;margin:16px 0 0;">
      Please try again with a valid transaction hash, or contact support.
    </p>
    ${btn('Try Again', `${process.env.CLIENT_URL}/payment`)}
  `),

  roiCredited: (name, plan, roiAmount, newBalance) => wrapper(`
    <h2 style="color:#00FF88;font-size:1.3rem;margin:0 0 8px;">Monthly ROI Credited! 💰</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Great news <strong style="color:#fff">${name}</strong>! Your monthly ROI has been credited to your wallet.
    </p>
    <table width="100%" style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Plan', plan, '#F6C90E')}
      ${highlight('ROI Credited', `+$${roiAmount} USDT`, '#00FF88')}
      ${highlight('New Balance', `$${newBalance} USDT`, '#00D4FF')}
    </table>
    ${btn('View Wallet', `${process.env.CLIENT_URL}/dashboard`)}
  `),

  referralBonus: (name, fromName, plan, bonus) => wrapper(`
    <h2 style="color:#7B61FF;font-size:1.3rem;margin:0 0 8px;">Referral Bonus Earned! 🎁</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Hi <strong style="color:#fff">${name}</strong>! Your referral <strong style="color:#fff">${fromName}</strong> just invested in a ${plan} plan. You've earned a referral bonus!
    </p>
    <table width="100%" style="background:rgba(123,97,255,0.06);border:1px solid rgba(123,97,255,0.2);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Referred By', fromName, '#A0AEC0')}
      ${highlight('Their Plan', plan, '#F6C90E')}
      ${highlight('Your Bonus', `+$${bonus} USDT`, '#00FF88')}
    </table>
    <p style="color:#A0AEC0;font-size:0.85rem;margin:16px 0 0;">
      Keep sharing your referral code to earn more!
    </p>
    ${btn('View Referrals', `${process.env.CLIENT_URL}/referrals`)}
  `),

  kycApproved: (name) => wrapper(`
    <h2 style="color:#00FF88;font-size:1.3rem;margin:0 0 8px;">KYC Verified! ✅</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Hi <strong style="color:#fff">${name}</strong>, your identity has been successfully verified. You now have full access to all CriptoX features.
    </p>
    <div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">🛡️</div>
      <p style="color:#00FF88;font-weight:700;margin:0;">KYC Status: Verified</p>
    </div>
    ${btn('Go to Dashboard', `${process.env.CLIENT_URL}/dashboard`)}
  `),

  kycRejected: (name, reason) => wrapper(`
    <h2 style="color:#FF3B30;font-size:1.3rem;margin:0 0 8px;">KYC Rejected</h2>
    <p style="color:#A0AEC0;line-height:1.7;margin:0 0 20px;">
      Hi <strong style="color:#fff">${name}</strong>, your KYC verification was not successful.
    </p>
    <table width="100%" style="background:rgba(255,59,48,0.05);border:1px solid rgba(255,59,48,0.2);border-radius:12px;padding:16px;" cellpadding="0" cellspacing="0">
      ${highlight('Reason', reason || 'Documents unclear or invalid', '#FF6B6B')}
    </table>
    <p style="color:#A0AEC0;font-size:0.85rem;margin:16px 0 0;">
      Please resubmit with clear, valid documents.
    </p>
    ${btn('Resubmit KYC', `${process.env.CLIENT_URL}/dashboard`)}
  `),
}

// ─── SEND FUNCTION ──────────────────────────────────────────────────────────

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"CriptoX" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log(`✅ Email sent to ${to}: ${subject}`)
  } catch (err) {
    // Log but don't crash the server — email is non-critical
    console.error(`❌ Email failed to ${to}:`, err.message)
  }
}
