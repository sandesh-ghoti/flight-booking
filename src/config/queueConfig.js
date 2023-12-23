const amqplib = require("amqplib");
let channel, connection;
async function connectQueue() {
  try {
    connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertQueue("Airline-notification-queue");
  } catch (error) {
    console.log(error);
  }
}

async function sendDatatoQueue(data) {
  try {
    channel.sendToQueue(
      "Airline-notification-queue",
      Buffer.from(JSON.stringify(data))
    );
  } catch (error) {
    console.log("queue error", error);
    throw error;
  }
}
module.exports = {
  connectQueue,
  sendDatatoQueue,
};
