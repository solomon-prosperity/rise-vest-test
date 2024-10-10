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
const newPost = {
  post: "This is a test post content.",
};
// remove console.logs in test environment
if (process.env.NODE_ENV === "test") {
  console.log = () => {};
}
describe("POST /v1/posts", () => {
  let server: unknown;
  let app: Application;
  let psqlClient: PoolClient;
  let token: string;
  let userId: number;
  before(async () => {
    app = new Application(container.cradle);
    const appInstance = await app.start();
    server = appInstance.server;
    psqlClient = appInstance.psqlClient;
  });
  beforeEach(async () => {
    const payload = {
      email: newUser.email,
      password: newUser.password,
    };
    const user = await request(server).post("/v1/users").send(newUser);
    const { id } = user.body.data;
    userId = id;
    const loginResponse = await request(server).post("/v1/users/login").send(payload);
    const { token: authToken } = loginResponse.body.data;
    token = authToken;
  });
  afterEach(async () => {
    try {
      await psqlClient.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;');
      await psqlClient.query('TRUNCATE TABLE "posts" RESTART IDENTITY CASCADE;');
    } catch (error) {
      console.error("Error truncating tables:", error);
    }
  });
  after(async function () {
    await psqlClient.release();
    await app.close();
  });

  context("when post body is ok", function () {
    it("should create a new post", async () => {
      const response = await request(server)
        .post("/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(newPost)
        .expect(201);
      expect(response.body.data).to.have.property("postid");
      expect(response.body.data).to.have.property("userid");
      expect(response.body.data.post).to.equal(newPost.post);
    });
  });

  context("when post body is not ok", function () {
    it("should return an error for invalid input", async () => {
      const invalidPost = {
        // Missing post content
      };

      const response = await request(server)
        .post("/v1/posts")
        .send(invalidPost)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(response.body.success).to.equal(false);
    });
  });

  context("if the post exists", function () {
    it("should add a comment to the post", async () => {
      const newComment = {
        comment: "this is a test comment",
      };
      // create a post first
      const post = await request(server)
        .post("/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(newPost);
      const { postid } = post.body.data;
      const response = await request(server)
        .post(`/v1/posts/${postid}/comments`)
        .send(newComment)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      expect(response.body.success).to.equal(true);
    });

    it("should retrieve comments on the post", async () => {
      const newComment = {
        comment: "this is a test comment",
      };
      // create a post first
      const post = await request(server)
        .post("/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(newPost);
      const { postid } = post.body.data;

      // add a comment to the post
      await request(server)
        .post(`/v1/posts/${postid}/comments`)
        .send(newComment)
        .set("Authorization", `Bearer ${token}`);

      const response = await request(server)
        .get(`/v1/posts/${postid}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal("Post comments retrieved successfully!");
      expect(response.body.data[0].comment).to.equal(newComment.comment);
    });
  });

  context("if token is not provided in the request", function () {
    it("should return an error for unauthorized access", async () => {
      const newPost = {
        post: "This is a test post content.",
      };
      const response = await request(server).post("/v1/posts").send(newPost).expect(401);
      expect(response.body.success).to.equal(false);
    });
  });

  context("Retrieve Posts", function () {
    it("should retrieve all posts", async () => {
      // create a post first
      await request(server).post("/v1/posts").set("Authorization", `Bearer ${token}`).send(newPost);
      const response = await request(server)
        .get("/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal("Posts retrieved successfully!");
      expect(response.body.data[0].post).to.equal(newPost.post);
    });

    it("should retrieve a post by post ID", async () => {
      // create a post first
      const post = await request(server)
        .post("/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(newPost);
      const { postid } = post.body.data;
      const response = await request(server)
        .get(`/v1/posts/${postid}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal("Post retrieved successfully!");
      expect(response.body.data.post).to.equal(newPost.post);
    });

    it("should retrieve a user's posts", async () => {
      // create a post first
      await request(server).post("/v1/posts").set("Authorization", `Bearer ${token}`).send(newPost);
      const response = await request(server)
        .get(`/v1/posts/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal("User Posts retrieved successfully!");
      expect(response.body.data[0].post).to.equal(newPost.post);
    });
  });
});
