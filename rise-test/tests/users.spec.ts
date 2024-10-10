/* eslint-disable quotes */
import { expect } from "chai";
import { PoolClient } from "pg";
import request from "supertest";
import Application from "../src/usecases/application";
import container from "../src/container";

const newUser = {
  first_name: "Ben",
  last_name: "Jerome",
  gender: "male",
  email: "benjamin@gmail.com",
  password: "password",
};

describe("POST /v1/users", () => {
  let server: unknown;
  let app: Application;
  let psqlClient: PoolClient;
  before(async () => {
    app = new Application(container.cradle);
    const appInstance = await app.start();
    server = appInstance.server;
    psqlClient = appInstance.psqlClient;
  });
  afterEach(async () => {
    try {
      await psqlClient.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;');
    } catch (error) {
      console.error("Error truncating table:", error);
    }
  });
  after(async function () {
    await psqlClient.release();
    await app.close();
  });

  context("when request body for user creation is ok and email has not been taken", function () {
    it("should create a new user", async () => {
      const response = await request(server).post("/v1/users").send(newUser).expect(201);
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property("first_name");
      expect(response.body.data).to.have.property("last_name");
      expect(response.body.data.first_name).to.equal(newUser.first_name);
      expect(response.body.data.last_name).to.equal(newUser.last_name);
    });
  });

  context("when request body for user creation is ok but email is already taken", function () {
    it("should return a conflict error", async () => {
      // create user first
      await request(server).post("/v1/users").send(newUser);
      const response = await request("localhost:40121").post("/v1/users").send(newUser).expect(409);
      expect(response.body.success).to.equal(false);
    });
  });

  context("when request body for login is ok", function () {
    it("should login user", async () => {
      const payload = {
        email: newUser.email,
        password: newUser.password,
      };
      // create user first
      await request(server).post("/v1/users").send(newUser);
      const response = await request(server).post("/v1/users/login").send(payload).expect(200);
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("first_name");
      expect(response.body.data).to.have.property("last_name");
      expect(response.body.data).to.have.property("token");
      expect(response.body.data.email).to.equal(payload.email);
    });
  });

  context("when request body for login is not ok", function () {
    it("should return an error for invalid input", async () => {
      const invalidPost = {
        // Missing post content
      };
      const response = await request(server).post("/v1/users/login").send(invalidPost).expect(400);
      expect(response.body.success).to.equal(false);
    });
  });

  context("when login credentials are not ok", function () {
    it("should deny access", async () => {
      const payload = {
        email: newUser.email,
        password: "wrongpassword",
      };
      const response = await request(server).post("/v1/users/login").send(payload).expect(401);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal("Invalid Credentials!");
    });
  });

  context("Retrieve Users", function () {
    it("should retrieve all users", async () => {
      const payload = {
        email: newUser.email,
        password: newUser.password,
      };
      // create user first
      await request(server).post("/v1/users").send(newUser);
      const loginResponse = await request(server).post("/v1/users/login").send(payload);
      const { token } = loginResponse.body.data;
      const response = await request(server)
        .get("/v1/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal("Users retrieved successfully!");
      expect(response.body.data[0].first_name).to.equal(newUser.first_name);
    });

    it("should retrieve a user by userId", async () => {
      const payload = {
        email: newUser.email,
        password: newUser.password,
      };
      // create user first
      const user = await request(server).post("/v1/users").send(newUser);
      const loginResponse = await request(server).post("/v1/users/login").send(payload);
      const { token } = loginResponse.body.data;
      const { id } = user.body.data;
      const response = await request(server)
        .get(`/v1/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal("User retrieved successfully!");
      expect(response.body.data.first_name).to.equal(newUser.first_name);
    });
  });

  context("Retrieve Top 3 Users with the most Posts", function () {
    it("should retrieve the top 3 users with the most posts", async () => {
      const payload = {
        email: newUser.email,
        password: newUser.password,
      };
      // create user first
      await request(server).post("/v1/users").send(newUser);
      const loginResponse = await request(server).post("/v1/users/login").send(payload);
      const { token } = loginResponse.body.data;
      const response = await request(server)
        .get("/v1/users/top-three")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal(
        "Top 3 users with the most posts retrieved successfully!"
      );
    });
  });
});
