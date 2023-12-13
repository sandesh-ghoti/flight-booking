const axios = require("axios");
const { BookingRepository } = require("../repositories");
const AppError = require("../utils/errors/appError");
const bookingRepository = new BookingRepository();
const { StatusCodes } = require("http-status-codes");
const { FLIGHT_SERVER_ADDRESS } = require("../config/serverConfig");
const {
  INITIATED,
  BOOKED,
  CANCELLED,
  PENDING,
} = require("../utils/common/bookingStatus");
async function createBooking(data) {
  try {
    //verify flightid, userId and check if totalSeats>noOfseats or not
    const res = await axios.get(
      `${FLIGHT_SERVER_ADDRESS}/api/v1/flight/${data.flightId}`
    );
    const flight = res.data.data;
    // userId
    if (flight.totalSeats < data.noOfSeats) {
      throw new AppError(
        "remaining seats are less than wanted",
        StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE
      );
    }
    data.totalCost = flight.price * data.noOfSeats;
    data.status = INITIATED;
    const booking = await bookingRepository.create(data);
    //update totalSeats of flight
    const updatedres = await axios.patch(
      `${FLIGHT_SERVER_ADDRESS}/api/v1/flight/updateSeats/${data.flightId}`,
      { dec: true, noOfSeats: data.noOfSeats }
    );
    return updatedres.data;
  } catch (error) {
    //if flight not found then it will throw error so use status and dada from error to raise new apperror
    if (
      error &&
      error.response &&
      error.response.status &&
      error.response.status == StatusCodes.NOT_FOUND
    ) {
      throw new AppError(
        [
          "something wrong in booking service" +
            ` flight ${data.flightId} not found`,
        ],
        StatusCodes.NOT_FOUND
      );
    }
    throw new AppError(
      ["something wrong in booking service " + error.message],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function cancelBooking(bookingId) {
  try {
  } catch (error) {}
}

async function makePayment(bookingId) {
  try {
  } catch (error) {}
}
async function getAllBooking() {
  try {
    const bookings = await bookingRepository.getAll();
    return bookings;
  } catch (error) {
    throw new AppError(
      ["unable to fetch all bookings"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getBooking(bookingId) {
  try {
    const bookings = await bookingRepository.findByPk(bookingId);
    return bookings;
  } catch (error) {
    throw new AppError(
      ["unable to fetch booking " + bookingId],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  createBooking,
  cancelBooking,
  makePayment,
  getAllBooking,
  getBooking,
};
