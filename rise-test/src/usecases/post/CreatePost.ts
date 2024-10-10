import PostRepository from "../../infra/repository/PostRepository";
import { PoolClient, QueryResult } from "pg";
import Config from "../../../config/default";
import { validatePostPayload } from "../../interface/http/validations/blog.validations.schema";
import { Post } from "../../infra/support/interfaces";
import { ValidationResult } from "joi";
import BadRequestError from "../../interface/http/errors/BadRequest";

class CreatePost {
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

  async execute(payload: Post): Promise<QueryResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate input
        const { error }: ValidationResult = await validatePostPayload(payload);
        if (error) throw new BadRequestError(`${error.details[0].message}`);

        const { post, userId } = payload;

        // Store in database
        const { rows }: QueryResult = await this.psqlClient.query(
          this.postRepository.createPost(),
          [userId, post]
        );

        resolve(rows[0]);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default CreatePost;
