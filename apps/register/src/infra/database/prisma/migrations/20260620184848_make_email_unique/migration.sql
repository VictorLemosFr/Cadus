/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Identidade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Identidade_email_key" ON "Identidade"("email");
