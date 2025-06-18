import app from "./app";
import { initRabbitMQ, closeRabbitMQ } from "./rabbitmq/connection";
import { consumeResults } from "./rabbitmq/consumer";

const PORT = Number(process.env.PORT) || 3000;
const SHUTDOWN_TIMEOUT = 10000; // 10s timeout for graceful shutdown

let server: ReturnType<typeof app.listen> | null = null;

const start = async () => {
  try {
    console.log("Starting User Service...");
    await initRabbitMQ();
    await consumeResults();

    server = app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });

    // Handle shutdown signals
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (err) {
    console.error("Failed to start service:", err);
    await gracefulShutdown();
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  console.log("\n Gracefully shutting down...");
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server?.close((err) => (err ? reject(err) : resolve(null)));
      });
      console.log("HTTP server closed.");
    }

    await closeRabbitMQ();

    console.log("Cleanup complete. Exiting.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    setTimeout(() => {
      console.error("Forced exit after timeout.");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);
  }
};

start();
