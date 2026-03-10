const express = require("express");
const router = express.Router();
const { getQueueStats } = require("../queue/deleteQueue");

router.get("/stats", (req, res) => {
  res.json({ success: true, data: getQueueStats() });
});

module.exports = router;