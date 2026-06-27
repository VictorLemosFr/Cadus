import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaConsultaRepository } from "../../infra/database/PrismaConsultaRepository";
import { RegistrarConsulta } from "../../application/usecases/RegistrarConsulta";
import { GetHistoricoPaciente } from "../../application/usecases/GetHistoricoPaciente";

const app = express();

// CORS antes do express.json()
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:8080",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const consultaRepo      = new PrismaConsultaRepository();
const registrarConsulta = new RegistrarConsulta(consultaRepo);
const getHistorico      = new GetHistoricoPaciente(consultaRepo);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "historico" });
});

app.post("/consultas", async (req, res) => {
  const body = req.body;

  let dataFormatada: string;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(body.dataConsulta)) {
    dataFormatada = body.dataConsulta;
  } else {
    const date = new Date(body.dataConsulta);
    const dia  = String(date.getUTCDate()).padStart(2, "0");
    const mes  = String(date.getUTCMonth() + 1).padStart(2, "0");
    const ano  = date.getUTCFullYear();
    dataFormatada = `${dia}/${mes}/${ano}`;
  }

  const dados = { ...body, dataConsulta: dataFormatada };

  const result = await registrarConsulta.registrar(dados);
  if (result.isError()) {
    res.status(400).json({ errors: result.value });
    return;
  }
  res.status(201).json({ id: result.value.consultaId.value });
});

app.get("/consultas/:pacienteId", async (req, res) => {
  const consultas = await getHistorico.execute(req.params.pacienteId);
  res.status(200).json(
    consultas.map((c) => ({
      id:             c.consultaId.value,
      pacienteId:     c.pacienteId,
      profissionalId: c.profissionalId,
      motivoConsulta: c.motivoConsulta.value,
      diagnostico:    c.diagnostico?.value,
      instituicao:    c.instituicao.value,
      dataConsulta:   c.dataConsulta.value,
      criadoEm:       c.criadoEm.value,
    }))
  );
});

// Porta corrigida: era ?? "3001", conflitava com o auth
const PORT = parseInt(process.env.PORT ?? "3002", 10);
app.listen(PORT, () => {
  console.log(`[historico] rodando na porta ${PORT}`);
});