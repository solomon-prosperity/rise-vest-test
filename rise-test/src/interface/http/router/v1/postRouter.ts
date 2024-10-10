import express from "express";
import { makeInvoker } from "awilix-express";
import PostController from "../../controllers/postController";
import { verifyToken } from "../../middlewares/verifyToken";

const api = makeInvoker(PostController);
const router = express.Router();

router.post("/", verifyToken, api("create"));
router.get("/:postId", verifyToken, api("get"));
router.get("/users/:userId", verifyToken, api("getAllUserPosts"));
router.get("/", verifyToken, api("getAllPosts"));
router.post("/:postId/comments", verifyToken, api("addComment"));
router.get("/:postId/comments", verifyToken, api("getAllPostComments"));

export default router;
