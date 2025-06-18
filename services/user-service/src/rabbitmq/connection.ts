import amqp, { Channel } from "amqplib";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

let channel: Channel;

export const initRabbitMQ = async () => {
  const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
  const MAX_RETRIES = 5;
  let retries = 0;

  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();
      await channel.assertQueue("tasks", { durable: true });
      console.log("Connected to RabbitMQ");
      break;
    } catch (err) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error("Max retries reached.");
        process.exit(1);
      }
      console.warn("Retrying RabbitMQ connection in 5s...");
      await sleep(5000);
    }
  }
};

export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  console.log("RabbitMQ connection closed.");
};

export const getChannel = () => channel;
