import amqp from "amqplib";

export const consumeResults = async () => {
  const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue("results", { durable: true });
    await ch.prefetch(1);

    console.log("📡 Waiting for results...");
    ch.consume("results", (msg) => {
      if (msg) {
        try {
          const result = JSON.parse(msg.content.toString());
          console.log("Received from Go:", result);
          ch.ack(msg);
        } catch (err) {
          ch.nack(msg, false, false);
        }
      }
    });
  } catch (err) {
    console.error("Error consuming results:", err);
  }
};
