const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
function validateBookingDetails(req, res, next) {
  console.log("validating booking details");
  if (!req.body.flightId || !req.body.user.id || !req.body.noOfSeats) {
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
    !req.body.user.id ||
    !req.body.bookingId ||
    !req.body.user.email
  ) {
    ErrorResponse.message = "something went wrong while making payment";
    ErrorResponse.error = "Incomplate booking payment request";
    return res.status(StatusCodes.PARTIAL_CONTENT).json(ErrorResponse);
  }
  next();
}
module.exports = { validateBookingDetails, validatePaymentDetails };
