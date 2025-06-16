import app from "./app";
import { initRabbitMQ } from "./rabbitmq/connection";
import { consumeResults } from "./rabbitmq/consumer";

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  await initRabbitMQ();
  await consumeResults();

  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
})();
