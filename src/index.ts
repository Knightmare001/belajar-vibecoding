import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import { healthRouter } from "./routes/health.route";
import { itemRouter } from "./routes/item.route";

const app = express();
const port = process.env.PORT || 3000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/api/items", itemRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Server running on Bun at http://localhost:${port}`);
    console.log(`📋 Health check: http://localhost:${port}/health`);
  });
}

export default app;
