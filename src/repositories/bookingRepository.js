const CrudRepository = require("./crudRepository");
const { Booking } = require("./../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/appError");
const { Op } = require("sequelize");
const { CANCELLED, BOOKED } = require("../utils/common/bookingStatus");

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }
  async get(bookingId, transaction) {
    const booking = await Booking.findByPk(bookingId, {
      transaction: transaction,
    });
    if (!booking) {
      throw new AppError(
        ["Not able to fund the resource"],
        StatusCodes.NOT_FOUND
      );
    }
    return booking;
  }
  async create(data, transaction) {
    const booking = await Booking.create(data, {
      transaction: transaction,
    });
    if (!booking) {
      throw new AppError(
        ["Not able to create booking"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return booking;
  }
  async update(bookingId, data, transaction) {
    const booking = await Booking.update(
      data,
      { where: { id: bookingId } },
      {
        transaction: transaction,
      }
    );
    if (!booking) {
      throw new AppError(
        ["Not able to update booking"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return booking;
  }
  async cancelOldBookings(time) {
    const res = await Booking.update(
      { status: CANCELLED },
      {
        where: {
          [Op.and]: [
            { createdAt: { [Op.lt]: time } },
            { status: { [Op.ne]: BOOKED } },
            { status: { [Op.ne]: CANCELLED } },
          ],
        },
      }
    );
    return res;
  }
  async getOldBookings(time) {
    const res = await Booking.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.lt]: time } },
          { status: { [Op.ne]: BOOKED } },
          { status: { [Op.ne]: CANCELLED } },
        ],
      },
    });
    return res;
  }
}

module.exports = BookingRepository;
