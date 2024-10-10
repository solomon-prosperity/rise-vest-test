import HttpStatus from "http-status-codes";
import { Response } from "express";

const BasicResponse = {
  success: false,
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: "",
  data: {},
  links: [],
  name: "",
};

interface NewResponse extends Response {
  errorMessage?: string;
}

class ResponseManager {
  static get HTTP_STATUS() {
    return HttpStatus;
  }

  static getResponseHandler(res: Response) {
    return {
      onSuccess: (data: object, message: string, code: number) => {
        ResponseManager.respondWithSuccess(res, code, data, message);
      },
      onError: (errorName: string, errorCode: number, errorMessage: string, data: object) => {
        ResponseManager.respondWithError(res, errorName, errorCode, errorMessage, data);
      },
    };
  }

  static generateHATEOASLink(link: string, method: string, rel: string) {
    return {
      link,
      method,
      rel,
    };
  }

  static respondWithSuccess(
    res: Response,
    code = ResponseManager.HTTP_STATUS.OK,
    data = {},
    message = "success",
    links = []
  ) {
    const response = { ...BasicResponse };
    response.success = true;
    response.message = message;
    response.data = data;
    response.links = links;
    response.statusCode = code;

    res.status(code).json(response);
  }

  static respondWithError(
    res: NewResponse,
    errorName: string,
    errorCode = ResponseManager.HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = "Unknown error",
    data = {}
  ) {
    const response = { ...BasicResponse };
    response.success = false;
    response.name = errorName;
    response.message = message;
    response.statusCode = errorCode;
    response.data = data;
    response.data = data;
    res.errorMessage = response.message;
    res.status(errorCode).json(response);
  }
}
export default ResponseManager;
