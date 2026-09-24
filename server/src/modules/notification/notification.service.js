const Notification = require("./notification.model");

const createNotification = async ({
    userId,
    title,
    message,
    type,
    relatedId = null,
}) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        relatedId,
    });

    return notification;
};

const getUserNotifications = async (userId) => {
    return await Notification.find({ userId })
        .sort({ createdAt: -1 });
};

const getUnreadCount = async (userId) => {
    return await Notification.countDocuments({
        userId,
        isRead: false,
    });
};

const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            userId,
        },
        {
            isRead: true,
        },
        {
            new: true,
        }
    );

    if (!notification) {
        throw new Error("Notification not found");
    }

    return notification;
};

const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        {
            userId,
            isRead: false,
        },
        {
            isRead: true,
        }
    );

    return true;
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};