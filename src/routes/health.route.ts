import { Router, type Request, type Response } from "express";
import { poolConnection } from "../db";

export const healthRouter = Router();

healthRouter.get("/", async (_req: Request, res: Response) => {
  let dbStatus = "disconnected";

  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    dbStatus = "connected";
  } catch (error: any) {
    dbStatus = `unreachable (${error?.message || "unknown error"})`;
  }

  res.json({
    status: "ok",
    runtime: "bun",
    timestamp: new Date().toISOString(),
    services: {
      server: "healthy",
      database: dbStatus,
    },
  });
});
