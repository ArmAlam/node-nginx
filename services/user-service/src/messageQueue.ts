import amqp from "amqplib";

let channel: amqp.Channel;
const MQ_URL = "amqp://user:pass@rabbitmq:5672";

export const connectQueue = async () => {
  const conn = await amqp.connect(MQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("tasks");
  console.log("Connected to RabbitMQ");
};

export const publishTask = (data: any) => {
  channel.sendToQueue("tasks", Buffer.from(JSON.stringify(data)));
};
