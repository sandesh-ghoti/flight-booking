const dotenv = require("dotenv");
dotenv.config("../.env");
module.exports = {
  PORT: process.env.PORT,
  FLIGHT_SERVER_ADDRESS: process.env.FLIGHT_SERVER_ADDRESS,
};
