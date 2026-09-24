const express = require("express");

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require("./notification.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.get("/unread-count", authMiddleware, getUnreadCount);

router.patch("/:id/read", authMiddleware, markAsRead);

router.patch("/read-all", authMiddleware, markAllAsRead);

module.exports = router;