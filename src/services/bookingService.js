const axios = require("axios");
const { BookingRepository } = require("../repositories");
const AppError = require("../utils/errors/appError");
const bookingRepository = new BookingRepository();
const { StatusCodes } = require("http-status-codes");
const {
  FLIGHT_SERVER_ADDRESS,
  BOOKING_EXPIRE_TIME,
} = require("../config/serverConfig");
const db = require("../models");
const {
  INITIATED,
  BOOKED,
  CANCELLED,
  PENDING,
} = require("../utils/common/bookingStatus");
const { messageQueue } = require("../config");
const { sendDatatoQueue } = require("../config/queueConfig");
async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
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
    data.status = PENDING;
    const booking = await bookingRepository.create(data);
    //update totalSeats of flight
    const updatedres = await axios.patch(
      `${FLIGHT_SERVER_ADDRESS}/api/v1/flight/updateSeats/${data.flightId}`,
      { dec: true, noOfSeats: data.noOfSeats }
    );
    await transaction.commit();
    updatedres.data.data.bookingId = booking.id;
    console.log(updatedres.data.data);
    return updatedres.data.data;
  } catch (error) {
    //if flight not found then it will throw error so use status and dada from error to raise new apperror
    await transaction.rollback();
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["error while creating booking " + error.name + error.message],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    let booking = await bookingRepository.get(bookingId, transaction);
    if (!booking) {
      throw new AppError(
        ["booking not exists " + bookingId],
        StatusCodes.BAD_REQUEST
      );
    }
    if (booking.status == CANCELLED) {
      await transaction.commit();
      return true;
    }
    // increase seats in flight service also
    await axios.patch(
      `${FLIGHT_SERVER_ADDRESS}/api/v1/flight/updateSeats/${booking.flightId}`,
      { dec: false, noOfSeats: booking.noOfSeats }
    );
    //update status of booking
    booking = await bookingRepository.update(
      bookingId,
      { status: CANCELLED },
      transaction
    );
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["while canceling booking " + error.name + error.message],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    let booking = await bookingRepository.get(data.bookingId, transaction);
    if (booking.userId != data.userId) {
      throw new AppError(
        ["user of booking and current user not match"],
        StatusCodes.BAD_REQUEST
      );
    }
    if (booking.status == CANCELLED) {
      throw new AppError(
        ["booking already cancelled"],
        StatusCodes.BAD_REQUEST
      );
    }
    if (booking.status == BOOKED) {
      throw new AppError(["already booked"], StatusCodes.BAD_REQUEST);
    }
    const bookingTime = new Date(booking.createdAt);
    if (new Date() - bookingTime > BOOKING_EXPIRE_TIME) {
      await cancelBooking(data.bookingId);
      throw new AppError(["booking time expired"], StatusCodes.BAD_REQUEST);
    }
    if (booking.totalCost != data.totalCost) {
      throw new AppError(
        ["totalprice of booking not matched"],
        StatusCodes.BAD_REQUEST
      );
    }
    //make payment
    // change status
    booking = await bookingRepository.update(
      data.bookingId,
      { status: BOOKED },
      { transaction: transaction }
    );
    sendDatatoQueue({
      recipientEmail: data.recipientEmail,
      subject: `ticket booked id ${data.bookingId}`,
      content: "booked",
    });
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ["while making payment " + error.name + error.message],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function cancelOldBookings() {
  try {
    const time = new Date(new Date() - BOOKING_EXPIRE_TIME);
    const res = await bookingRepository.getOldBookings(time);
    //cancel each old booking
    res.forEach(async (booking) => {
      await cancelBooking(booking.id);
    });
    return res;
  } catch (error) {
    console.log(error);
  }
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
    const bookings = await bookingRepository.get(bookingId);
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
  cancelOldBookings,
};
