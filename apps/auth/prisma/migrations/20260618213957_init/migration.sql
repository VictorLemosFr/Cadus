-- CreateTable
CREATE TABLE "Sessao" (
    "id" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TentativaLogin" (
    "id" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoAte" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TentativaLogin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenRecuperacao" (
    "id" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenRecuperacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sessao_token_key" ON "Sessao"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TentativaLogin_cpf_key" ON "TentativaLogin"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "TokenRecuperacao_token_key" ON "TokenRecuperacao"("token");
