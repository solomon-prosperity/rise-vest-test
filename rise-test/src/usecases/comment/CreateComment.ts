import CommentRepository from "../../infra/repository/CommentRepository";
import { PoolClient, QueryResult } from "pg";
import Config from "../../../config/default";
import { validateCommentPayload } from "../../interface/http/validations/blog.validations.schema";
import { Comment } from "../../infra/support/interfaces";
import { ValidationResult } from "joi";
import BadRequestError from "../../interface/http/errors/BadRequest";

class CreateComment {
  commentRepository: CommentRepository;
  psqlClient: PoolClient;
  config: typeof Config;
  constructor({
    commentRepository,
    psqlClient,
    config,
  }: {
    commentRepository: CommentRepository;
    psqlClient: PoolClient;
    config: typeof Config;
  }) {
    this.commentRepository = commentRepository;
    this.psqlClient = psqlClient;
    this.config = config;
  }

  async execute(payload: Comment): Promise<QueryResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate input
        const { error }: ValidationResult = await validateCommentPayload(payload);
        if (error) throw new BadRequestError(`${error.details[0].message}`);

        const { comment, postId, userId } = payload;

        // Store in database
        const { rows }: QueryResult = await this.psqlClient.query(
          this.commentRepository.createComment(),
          [postId, userId, comment]
        );

        resolve(rows);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default CreateComment;
