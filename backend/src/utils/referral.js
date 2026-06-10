export const generateReferralCode = (name) => {
  const base = name.replace(/\s+/g, '').toUpperCase().slice(0, 4)
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CX-${base}${rand}`
}
