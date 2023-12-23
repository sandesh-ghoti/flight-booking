const cron = require("node-cron");

const { BookingService } = require("../services");

function scheduleCrons() {
  // * * * * * (seconds, minutes,hour, days, weeks)
  cron.schedule("*/5 * * * *", async () => {
    await BookingService.cancelOldBookings();
  });
}

module.exports = scheduleCrons;
