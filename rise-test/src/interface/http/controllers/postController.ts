import HTTP_STATUS from "http-status-codes";
import BaseController from "./BaseController";
import { Request, Response } from "express";
import { IPost } from "../../../infra/support/interfaces";

class PostController extends BaseController {
  createPost!: IPost;
  getUserPosts!: IPost;
  getPosts!: IPost;
  getPost!: IPost;
  createComment!: IPost;
  getPostComments!: IPost;
  constructor({
    createPost,
    getUserPosts,
    getPosts,
    getPost,
    createComment,
    getPostComments,
  }: {
    createPost: IPost;
    getUserPosts: IPost;
    getPosts: IPost;
    getPost: IPost;
    createComment: IPost;
    getPostComments: IPost;
  }) {
    super();
    this.createPost = createPost;
    this.getUserPosts = getUserPosts;
    this.getPosts = getPosts;
    this.getPost = getPost;
    this.createComment = createComment;
    this.getPostComments = getPostComments;
  }

  async create(req: Request, res: Response): Promise<void> {
    const { post } = req.body;
    const { id } = req.user;
    const response = await this.createPost.execute({ post, userId: id });
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "Post created successfully!", HTTP_STATUS.CREATED);
  }

  async get(req: Request, res: Response): Promise<void> {
    const postId: string = req.params.postId;
    const response = await this.getPost.execute(postId);
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "Post retrieved successfully!", HTTP_STATUS.OK);
  }

  async getAllUserPosts(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.userId;
    const response = await this.getUserPosts.execute(userId);
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "User Posts retrieved successfully!", HTTP_STATUS.OK);
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    const response = await this.getPosts.execute();
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "Posts retrieved successfully!", HTTP_STATUS.OK);
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const { comment } = req.body;
    const { postId } = req.params;
    const { id } = req.user;
    const response = await this.createComment.execute({ comment, postId, userId: id });
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "Comment added to post successfully!", HTTP_STATUS.CREATED);
  }

  async getAllPostComments(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const response = await this.getPostComments.execute(postId);
    // send response
    this.responseManager
      .getResponseHandler(res)
      .onSuccess(response, "Post comments retrieved successfully!", HTTP_STATUS.OK);
  }
}

export default PostController;
