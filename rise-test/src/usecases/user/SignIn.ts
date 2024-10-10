import UserRepository from "../../infra/repository/UserRepository";
import { PoolClient, QueryResult } from "pg";
import Config from "../../../config/default";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BadRequestError from "../../interface/http/errors/BadRequest";
import UnauthorizedError from "../../interface/http/errors/Unauthorized";
import { validateAuthPayload } from "../../interface/http/validations/blog.validations.schema";
import { Auth } from "../../infra/support/interfaces";
import { ValidationResult } from "joi";

class SignIn {
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

  async execute({ email, password }: Auth): Promise<QueryResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate input
        const { error }: ValidationResult = await validateAuthPayload({ email, password });
        if (error) throw new BadRequestError(` ${error.details[0].message}`);
        const { rows }: QueryResult = await this.psqlClient.query(
          this.userRepository.getUserByCol("email"),
          [email]
        );
        const user = rows[0];
        if (!user) throw new UnauthorizedError("Invalid Credentials!");
        // Validate password
        const validatePassword: boolean = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
          throw new UnauthorizedError("Invalid Credentials!");
        }
        // sign token
        const secret: string | undefined = Config.jwtSecret;
        const token: string = await jwt.sign(
          {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            gender: user.gender,
          },
          `${secret}`
        );
        delete user.password;
        user.token = token;

        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default SignIn;
