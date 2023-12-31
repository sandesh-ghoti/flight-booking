const amqplib = require("amqplib");
let channel, connection;
const {RABBITMQ_ADDRESS}=require('../config/serverConfig')
async function connectQueue() {
  try {
    connection = await amqplib.connect(`amqp://${RABBITMQ_ADDRESS}`);
    channel = await connection.createChannel();

    await channel.assertQueue("Airline-notification-queue");
  } catch (error) {
    console.log(error);
    await new Promise((resolve) => setTimeout(resolve, 5000));
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
