const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
async function createBooking(req, res) {
  try {
    const book = await BookingService.createBooking({
      flightId: req.body.flightId,
      recipientEmail: req.body.recipientEmail,
      noOfSeats: req.body.noOfSeats,
    });
    SuccessResponse.data = book;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function getAllBooking(req, res) {
  try {
    const bookings = await BookingService.getAllBooking();
    SuccessResponse.data = bookings;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function getBooking(req, res) {
  try {
    const bookings = await BookingService.getAllBooking(req.params.id);
    SuccessResponse.data = bookings;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function cancelOldBooking(req, res) {
  console.log("cancel old booking called");
  try {
    const bookings = await BookingService.cancelOldBookings();
    SuccessResponse.data = bookings;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function cancelBooking(req, res) {
  try {
    const bookings = await BookingService.cancelBooking(req.params.id);
    SuccessResponse.data = bookings;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function makePayment(req, res) {
  try {
    const bookings = await BookingService.makePayment({
      bookingId: req.body.bookingId,
      userId: req.body.userId,
      totalCost: req.body.totalCost,
      recipientEmail: req.body.recipientEmail,
    });
    SuccessResponse.data = bookings;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
module.exports = {
  createBooking,
  cancelBooking,
  cancelOldBooking,
  makePayment,
  getAllBooking,
  getBooking,
};
