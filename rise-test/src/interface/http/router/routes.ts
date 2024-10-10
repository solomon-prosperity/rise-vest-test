import express from "express";
import routerV1 from "./v1";
import { Request, Response } from "express";
import cors from "cors";
import { AwilixContainer } from "awilix";
import error from "../middlewares/error";

interface AppAwilixContainer extends AwilixContainer {
  containerMiddleware: string | RegExp | Array<string | RegExp>;
}
export default ({ containerMiddleware }: AppAwilixContainer) => {
  const apiRouter = express.Router();

  apiRouter.use(express.json());
  apiRouter.use(containerMiddleware);

  apiRouter.route("/").get((req: Request, res: Response) => {
    res.status(200).json({
      message: "API v1  is running",
      env: process.env.NODE_ENV,
      serviceName: process.env.SERVICE_NAME,
    });
  });

  apiRouter.use("/v1", cors(), routerV1);
  // handle errors (404 is not technically an error)
  apiRouter.use(error);

  return apiRouter;
};
