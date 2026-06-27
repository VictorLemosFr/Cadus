/*
  Warnings:

  - A unique constraint covering the columns `[cep]` on the table `Endereco` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Endereco_cep_key" ON "Endereco"("cep");
