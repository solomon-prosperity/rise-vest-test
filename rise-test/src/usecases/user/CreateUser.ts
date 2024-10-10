/* eslint-disable prefer-const */
import UserRepository from "../../infra/repository/UserRepository";
import { PoolClient, QueryResult } from "pg";
import Config from "../../../config/default";
import { validateUserPayload } from "../../interface/http/validations/blog.validations.schema";
import { User } from "../../infra/support/interfaces";
import { ValidationResult } from "joi";
import BadRequestError from "../../interface/http/errors/BadRequest";
import ConflictError from "../../interface/http/errors/Conflict";
import bcrypt from "bcrypt";

class CreateUser {
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

  async execute(payload: User): Promise<QueryResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate input
        const { error }: ValidationResult = await validateUserPayload(payload);
        if (error) throw new BadRequestError(`${error.details[0].message}`);

        let { first_name, last_name, email, password, gender } = payload;
        // check for already existing user
        const isUser = await this.psqlClient.query(this.userRepository.getUserByCol("email"), [
          email,
        ]);
        if (isUser.rows.length > 0) throw new ConflictError("A User with this email already exist");

        // Encrypt password
        password = await bcrypt.hash(password, 10);
        // Store in database
        const { rows }: QueryResult = await this.psqlClient.query(
          this.userRepository.createUser(),
          [first_name, last_name, email, password, gender]
        );
        const user = rows[0];
        delete user.password;
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default CreateUser;
