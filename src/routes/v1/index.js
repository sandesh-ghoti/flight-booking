const express = require("express");
const router = express.Router();
const bookingRouter = require("./booking");
const { InfoController } = require("../../controllers");
router.use("/bookings", bookingRouter);
router.get("/info", InfoController);
module.exports = router;
