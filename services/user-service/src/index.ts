import express from "express";

const app = express();

app.use(express.json());
const PORT = 3000;

const containerId = process.env.CONTAINER_ID || "unknown";

app.get("/users", (req, res) => {
  res.send({ msg: `Hello from User Service!`, containerId });
});

app.post("/users", (req, res) => {
  res.send({ ...req.body, ...req.headers });
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
}

export default app;
