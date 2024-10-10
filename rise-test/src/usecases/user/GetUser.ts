import UserRepository from "../../infra/repository/UserRepository";
import { PoolClient, QueryResult } from "pg";
import Config from "../../../config/default";
import NotFoundError from "../../interface/http/errors/NotFound";
import BadRequestError from "../../interface/http/errors/BadRequest";

class GetUser {
  userRepository: UserRepository;
  psqlClient: PoolClient;
  config: typeof Config;
  constructor({
    userRepository,
    psqlClient,
    config,
  }: {
    userRepository: UserRepository;
    psqlClient: PoolClient;
    config: typeof Config;
  }) {
    this.userRepository = userRepository;
    this.psqlClient = psqlClient;
    this.config = config;
  }

  async execute(userId: string): Promise<QueryResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) throw new BadRequestError("user id cannot be empty");
        const { rows }: QueryResult = await this.psqlClient.query(
          this.userRepository.getUserByCol("id"),
          [userId]
        );
        if (rows.length == 0) throw new NotFoundError("user not found");
        resolve(rows[0]);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default GetUser;
