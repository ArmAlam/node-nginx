import express from "express";
import { publishTask } from "./rabbitmq/publisher";

const app = express();
app.use(express.json());

const containerId = process.env.CONTAINER_ID || "unknown";

app.get("/users", (_, res) => {
  res.send({ msg: "Hello from User Service!", containerId });
});

app.post("/users", (req, res) => {
  const task = {
    number: req.body.number,
    headers: req.headers,
    timestamp: Date.now(),
  };
  publishTask(task);
  res.send({ msg: "Task sent to queue", task });
});

export default app;
