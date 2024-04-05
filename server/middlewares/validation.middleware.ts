import * as z from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

import HttpException from "../utils/classes/http.exception";

function validationMiddleware(schema: z.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const value = await schema.safeParseAsync(
        Object.keys(req.body).length === 0 ? req.headers : req.body,
      );

      if (!value.success) {
        const errors: { field: any; message: string }[] =
          value.error.issues.map((err) => {
            // Extract field name and error message
            const field = err.path[0]; // the first element in the path is the field name
            const message = err.message;

            // Create a more informative error object
            return { field, message };
          });

        res.status(400).send({ errors });
      } else {
        req.body = value.data;
        next();
      }
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default validationMiddleware;
