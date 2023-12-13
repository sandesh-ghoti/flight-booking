const { StatusCodes } = require("http-status-codes");

const info = (req, res) => {
  console.log(req.body);
  return res.status(StatusCodes.OK).json({});
};

module.exports = info;
