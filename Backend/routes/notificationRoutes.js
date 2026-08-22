const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ notifications });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

router.get("/unread", authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.userId,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    console.error("GET UNREAD NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to load unread notifications" });
  }
});

router.patch("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { $set: { read: true } },
    );
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("MARK ALL NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: "Notification not found" });
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { $set: { read: true } },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ notification });
  } catch (error) {
    console.error("MARK NOTIFICATION ERROR:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: "Notification not found" });
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.userId,
    });
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

module.exports = router;
