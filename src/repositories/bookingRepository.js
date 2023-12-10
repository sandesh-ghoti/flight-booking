const CrudRepository = require("./crud-repository");
const { City } = require("./../models");

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }
}

module.exports = BookingRepository;
