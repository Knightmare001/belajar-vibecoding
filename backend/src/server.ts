import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();
const port = process.env.PORT || 3000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// Global Error Handler
app.use(errorMiddleware);

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Server running on Bun at http://localhost:${port}`);
    console.log(`📋 Health check: http://localhost:${port}/health`);
  });
}

export default app;

