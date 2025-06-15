import express from "express";
import amqp from "amqplib";

const app = express();

app.use(express.json());
const PORT = 3000;

const containerId = process.env.CONTAINER_ID || "unknown";

// RabbitMQ setup
const RABBITMQ_URL = "amqp://user:pass@rabbitmq:5672"; // TODO: Use environment variable for RabbitMQ URL | Create helper function
let channel: amqp.Channel;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initRabbitMQ = async () => {
  const MAX_RETRIES = 5;
  // Retry connection every 5 seconds until successful
  let retries = 0;
  while (true) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("tasks", { durable: true });
      console.log("Connected to RabbitMQ");
      break; // Exit loop if connection is successful
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error("Max retries reached. Exiting...");
        process.exit(1); // Exit if max retries reached
      }
      console.error(
        "Failed to connect to RabbitMQ, retrying in 5 seconds...",
        error
      );
      await sleep(5000); // Wait before retrying
    }
  }
};

async function consumeResults() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue("results", { durable: true });

    console.log("📡 Waiting for results...");
    ch.consume("results", (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log("Result received from Go:", data);
        ch.ack(msg);
      }
    });
  } catch (err) {
    console.error("Result consumer error:", err);
  }
}

app.get("/users", (req, res) => {
  res.send({ msg: `Hello from User Service!`, containerId });
});

app.post("/users", (req, res) => {
  const task = {
    number: req.body.number,
    headers: req.headers,
    timestamp: Date.now(),
  };

  if (channel) {
    channel.sendToQueue("tasks", Buffer.from(JSON.stringify(task)), {
      persistent: true,
    });
    console.log("Published task to RabbitMQ:", task);
    res.send({ msg: "Task published to RabbitMQ", task });
  } else {
    console.error("Cannot publish. RabbitMQ channel not ready.");
  }
});

// START SERVER
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, async () => {
    console.log(`User service running on port ${PORT}`);
    await initRabbitMQ();
    await consumeResults();
  });
}

export default app;
