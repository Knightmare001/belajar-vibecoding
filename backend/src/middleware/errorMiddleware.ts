import { type Request, type Response, type NextFunction } from "express";
import { ClientError } from "../exceptions/clientError";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      message: err.message,
      data: null,
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    message: err?.message || "Internal Server Error",
    data: null,
  });
}

