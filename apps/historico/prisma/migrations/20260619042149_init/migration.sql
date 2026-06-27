-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "pacienteId" VARCHAR(36) NOT NULL,
    "profissionalId" VARCHAR(36) NOT NULL,
    "motivoConsulta" VARCHAR(500) NOT NULL,
    "diagnostico" TEXT,
    "instituicao" VARCHAR(200) NOT NULL,
    "dataConsulta" TIMESTAMP(6) NOT NULL,
    "criadoEm" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);
