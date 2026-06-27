import express from "express";
import cors from "cors";
import { loginController } from "../controllers/LoginController";
import { logoutController } from "../controllers/LogoutController";
import { authMiddleware } from "../middlewares/authMiddleware";

const app = express();

const port = parseInt(process.env.PORT ?? "3001", 10);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:8080",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth" });
});

app.post("/auth/login", loginController);
app.post("/auth/logout", authMiddleware, logoutController);

app.listen(port, () => {
  console.log(`[auth] rodando na porta ${port}`);
});