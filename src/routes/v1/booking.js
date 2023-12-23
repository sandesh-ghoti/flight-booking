const express = require("express");
const router = express.Router();
const { BookingController } = require("../../controllers");
const { bookingMiddleware } = require("../../middlerwares");
router.post(
  "/",
  bookingMiddleware.validateBookingDetails,
  BookingController.createBooking
);
router.get("/", BookingController.getAllBooking);
router.get("/:id", BookingController.getBooking);
router.post(
  "/payment",
  bookingMiddleware.validatePaymentDetails,
  BookingController.makePayment
);
router.post("/cancelOldBooking", BookingController.cancelOldBooking);
router.post("/cancelBooking/:id", BookingController.cancelBooking);
module.exports = router;
