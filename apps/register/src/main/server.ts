import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { setupRegisterRoutes } from "./routes/SetupRegisterRoutes";

export const createApp = (): express.Application => {
  const app = express();

  // CORS antes de tudo — mesmo padrão dos outros serviços
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:8080",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, _res: Response, next: NextFunction): void => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  const router = express.Router();
  setupRegisterRoutes(router);
  app.use("/", router);

  app.get("/health", (_req: Request, res: Response): void => {
    res.json({ status: "OK" });
  });

  app.use((req: Request, res: Response): void => {
    res.status(404).json({
      error: "Rota não encontrada",
      path: req.path,
      method: req.method,
    });
  });

  app.use(
    (err: Error | any, _req: Request, res: Response, _next: NextFunction): void => {
      console.error("[ERROR]", err);
      const isDevelopment = process.env.NODE_ENV !== "production";
      const response: Record<string, any> = {
        error: err.message || "Erro interno do servidor",
      };
      if (isDevelopment) response.stack = err.stack;
      res.status(500).json(response);
    }
  );

  return app;
};

export const startServer = async (port: number = 3000): Promise<void> => {
  const app = createApp();
  app.listen(port, () => {
    console.log(`[register] rodando na porta ${port}`);
  });
};

if (import.meta.main) {
  const port = parseInt(process.env.PORT ?? "3000", 10);
  startServer(port).catch(console.error);
}