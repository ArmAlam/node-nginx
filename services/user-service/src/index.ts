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
      await channel.assertQueue("tasks");
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

app.get("/users", (req, res) => {
  res.send({ msg: `Hello from User Service!`, containerId });
});

app.post("/users", (req, res) => {
  const task = {
    user: req.body,
    headers: req.headers,
    timestamp: Date.now(),
  };

  if (channel) {
    channel.sendToQueue("tasks", Buffer.from(JSON.stringify(task)));
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
  });
}

export default app;
