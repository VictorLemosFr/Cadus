/*
  Warnings:

  - Added the required column `atualizadoEm` to the `Endereco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Endereco" ADD COLUMN     "atualizadoEm" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
