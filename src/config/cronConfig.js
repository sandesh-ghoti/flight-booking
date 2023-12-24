const cron = require("node-cron");

const { BookingService } = require("../services");

function scheduleCrons() {
  // * * * * * (seconds, minutes,hour, days, weeks)
  cron.schedule("*/10 * * * *", async () => {
    await BookingService.cancelOldBookings();
  });
}

module.exports = scheduleCrons;
