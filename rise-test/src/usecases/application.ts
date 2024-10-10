import restServer from "../interface/http/server";
import { connectPsqlDB } from "../infra/database/postgreSQL";
import log from "../interface/http/utils/logger";
import Config from "config";
import container from "../container";
import { asValue } from "awilix";

type ShutdownFunction = () => Promise<void>;
class Application {
  restServer: restServer;
  logger: typeof log;
  config: typeof Config;
  shutdown!: ShutdownFunction;

  constructor({
    restServer,
    logger,
    config,
  }: {
    restServer: restServer;
    logger: typeof log;
    config: typeof Config;
  }) {
    this.restServer = restServer;
    this.logger = logger;
    this.config = config;
  }

  async start() {
    const psqlClient = await connectPsqlDB();
    container.register({
      psqlClient: asValue(psqlClient),
    });
    const server = await this.restServer.start();
    return { server, psqlClient };
  }

  async close() {
    await this.restServer.stop();
  }
}

export default Application;
