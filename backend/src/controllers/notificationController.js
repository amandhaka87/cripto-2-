import Notification from '../models/Notification.js'

// Internal helper — called from other controllers, not a route
export const createNotification = async (userId, title, message, type = 'system') => {
  try {
    await Notification.create({ user: userId, title, message, type })
  } catch (err) {
    console.error('Notification create error:', err.message)
  }
}

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false })

    res.json({ success: true, data: notifications, unreadCount })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const markRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true, readAt: new Date() }
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
