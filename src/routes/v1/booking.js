const express = require("express");
const router = express.Router();
const { BookingController } = require("../../controllers");
const { bookingMiddleware } = require("../../middlerwares");
router.post("/", bookingMiddleware, BookingController.createBooking);
router.get("/", BookingController.getAllBooking);
router.get("/:id", BookingController.getBooking);
router.post("/payment", bookingMiddleware, BookingController.makePayment);
module.exports = router;
