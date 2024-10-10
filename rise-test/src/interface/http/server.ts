import express, { Express, Router } from "express";
import http from "http";
import Config from "config";
import log from "./utils/logger";
import { AddressInfo } from "net";

interface NewExpress extends Express {
  server?: http.Server;
}

class Server {
  config: typeof Config;
  router!: Router;
  logger: typeof log;
  express: NewExpress;

  constructor({
    config,
    router,
    logger,
  }: {
    config: typeof Config;
    router: Router;
    logger: typeof log;
  }) {
    this.config = config; // Assuming config is an instance of Config class
    this.logger = logger; // Assuming logger is an instance of log class
    this.express = express();
    this.express.disable("x-powered-by");
    this.express.use(router);
    this.express.use(express.json());

    // Use http.createServer to create a server instance
    this.express.server = http.createServer(this.express);
  }

  start() {
    return new Promise((resolve) => {
      if (this.express.server) {
        const server = this.express.server.listen(this.config.get("httpPort"), () => {
          const { port } = server.address() as AddressInfo;
          this.logger.info(`[pid ${process.pid}] REST server Listening on port ${port}`);
          return resolve(this.express.server);
        });
      }
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this.express.server) {
        this.express.server.close((err?: Error) => {
          if (err) {
            this.logger.error("Error stopping the server:", err);
            return reject(err);
          }
          resolve(true);
        });
      } else {
        this.logger.warn("Server is not running.");
        resolve(false);
      }
    });
  }
}

export default Server;
