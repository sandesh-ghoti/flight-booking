const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
function validateBookingDetails(req, res, next) {
  console.log(req.body.flightId);
  if (!req.body.flightId || !req.body.userId || !req.body.noOfSeats) {
    ErrorResponse.message =
      "something went wrong while creating booking create request";
    ErrorResponse.error = "Incomplate booking create request";
    return res.status(StatusCodes.PARTIAL_CONTENT).json(ErrorResponse);
  }
  next();
}
module.exports = validateBookingDetails;
