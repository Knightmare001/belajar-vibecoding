import { Router, type Request, type Response } from "express";
import { userRouter } from "../services/users/routes";
import { poolConnection } from "../lib/db";

const router = Router();

// Health Check
router.get("/health", async (_req: Request, res: Response) => {
  let dbStatus = "disconnected";
  try {
    const conn = await poolConnection.getConnection();
    await conn.ping();
    conn.release();
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

// Domain Routes
router.use("/api/users", userRouter);

export default router;

