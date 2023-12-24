const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
function validateBookingDetails(req, res, next) {
  if (!req.body.flightId || !req.body.userId || !req.body.noOfSeats) {
    ErrorResponse.message =
      "something went wrong while creating booking create request";
    ErrorResponse.error = "Incomplate booking create request";
    return res.status(StatusCodes.PARTIAL_CONTENT).json(ErrorResponse);
  }
  next();
}
function validatePaymentDetails(req, res, next) {
  if (
    !req.body.totalCost ||
    !req.body.userId ||
    !req.body.bookingId ||
    !req.user.email
  ) {
    ErrorResponse.message = "something went wrong while making payment";
    ErrorResponse.error = "Incomplate booking payment request";
    return res.status(StatusCodes.PARTIAL_CONTENT).json(ErrorResponse);
  }
  next();
}
module.exports = { validateBookingDetails, validatePaymentDetails };
