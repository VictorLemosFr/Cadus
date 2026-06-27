-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "Pronome" AS ENUM ('ELE_DELE', 'ELA_DELA', 'ELU_DELU', 'OUTRO');

-- CreateTable
CREATE TABLE "Identidade" (
    "id" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "genero" "Genero" NOT NULL,
    "generoCustom" VARCHAR(150),
    "pronome" "Pronome",
    "pronomeCustom" VARCHAR(150),
    "telefone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "senha" VARCHAR(255) NOT NULL,
    "enderecoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Identidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" TEXT NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "logradouro" VARCHAR(200),
    "numero" VARCHAR(10) NOT NULL,
    "complemento" VARCHAR(100),

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Identidade_cpf_key" ON "Identidade"("cpf");

-- AddForeignKey
ALTER TABLE "Identidade" ADD CONSTRAINT "Identidade_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
