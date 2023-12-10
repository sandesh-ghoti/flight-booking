const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
async function createBooking(req, res) {
  try {
    const book = await BookingService.create({
      flightId: req.body.flightId,
      userId: req.body.flightId,
      noOfSeats: req.body.flightId,
    });
    SuccessResponse.data = book;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function cancelBooking(req, res) {
  try {
  } catch (error) {}
}
async function makePayment(req, res) {
  try {
  } catch (error) {}
}
module.exports = { createBooking, cancelBooking, makePayment };
