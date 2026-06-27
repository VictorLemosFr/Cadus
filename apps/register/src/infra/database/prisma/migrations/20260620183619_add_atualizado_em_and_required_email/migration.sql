/*
  Warnings:

  - Added the required column `atualizadoEm` to the `Identidade` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Identidade` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Identidade" ADD COLUMN     "atualizadoEm" TIMESTAMP(6) NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
