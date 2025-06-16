import request from "supertest";
import app from "../index";

describe("User Service API", () => {
  it("GET /users should return greeting with containerId", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("msg");
    expect(res.body).toHaveProperty("containerId");
  });

  // it("POST /users should echo request body and headers", async () => {
  //   const res = await request(app)
  //     .post("/users")
  //     .send({ name: "Alice", role: "admin" });

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toMatchObject({
  //     name: "Alice",
  //     role: "admin",
  //   });

  //   expect(res.body).toHaveProperty("host"); // from headers
  // });
});
