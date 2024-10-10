import ResponseManager from "../manager/response";
import HttpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { IError } from "../../../infra/support/interfaces";

// Error middleware handler
// eslint-disable-next-line no-unused-vars
export default (err: IError, req: Request, res: Response, next: NextFunction) => {
  console.log("\n START OF ERROR \n---------------");
  console.log(err);
  console.log("-------------\n END OF ERROR \n");
  switch (err.name || err.error!.name) {
    case "ValidationError":
      ResponseManager.getResponseHandler(res).onError(
        err.name || err.error!.name,
        HttpStatus.BAD_REQUEST,
        err.message || err.error!.toString(),
        err.errors || err.error!.details
      );
      next();
      break;

    default:
      ResponseManager.getResponseHandler(res).onError(
        err.name || "InternalServerError",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        err.message || "Something bad happened!",
        err.data || {}
      );
  }
};
