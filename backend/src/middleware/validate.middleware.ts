import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    const parsedData = result.data as {
      body?: Request["body"];
      params?: Request["params"];
    };

    req.body = parsedData.body ?? req.body;
    req.params = parsedData.params ?? req.params;

    next();
  };
}
