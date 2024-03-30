import { Request, Response, NextFunction, RequestHandler } from "express"

const asyncTryCatchHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
  };
};

export default asyncTryCatchHandler;