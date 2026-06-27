#!/usr/bin/env node
import { startServer } from "./src/main/server";

/**
 * Inicia o servidor do Express.js
 */
const port = parseInt(process.env.PORT ?? "3000", 10);

startServer(port).catch((error) => {
  console.error("Falha ao iniciar servidor:", error);
  process.exit(1);
});
