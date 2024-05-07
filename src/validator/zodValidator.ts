import { ZodSchema } from "zod";

import { Request, Response, NextFunction } from "express";

export const zodValidator =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "invalid Request Params Received",
        data: {},
        error: error,
      });
    }
  };
