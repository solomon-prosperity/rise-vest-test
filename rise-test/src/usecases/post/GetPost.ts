import PostRepository from "../../infra/repository/PostRepository";
import { PoolClient, QueryResult } from "pg";
import Config from "../../../config/default";
import BadRequestError from "../../interface/http/errors/BadRequest";

class GetPost {
  postRepository: PostRepository;
  psqlClient: PoolClient;
  config: typeof Config;
  constructor({
    postRepository,
    psqlClient,
    config,
  }: {
    postRepository: PostRepository;
    psqlClient: PoolClient;
    config: typeof Config;
  }) {
    this.postRepository = postRepository;
    this.psqlClient = psqlClient;
    this.config = config;
  }

  async execute(postId: string): Promise<QueryResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!postId) throw new BadRequestError("post id cannot be empty");

        const { rows }: QueryResult = await this.psqlClient.query(
          this.postRepository.getPostByCol("postId"),
          [postId]
        );

        resolve(rows[0]);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default GetPost;
