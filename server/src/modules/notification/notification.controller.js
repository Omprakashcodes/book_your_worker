const notificationService = require("./notification.service");

const getNotifications = async (req, res) => {
    try {
        const notifications =
            await notificationService.getUserNotifications(req.user.userId);

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const count =
            await notificationService.getUnreadCount(req.user.userId);

        res.status(200).json({
            success: true,
            data: {
                count,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification =
            await notificationService.markAsRead(
                req.params.id,
                req.user.userId
            );

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.userId);

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};