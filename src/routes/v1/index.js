const express = require("express");
const router = express.Router();
const booking = require("./booking");
const { Info } = require("../../controllers");
router.use("/bookings", booking);
router.get("/info", Info);
module.exports = router;
