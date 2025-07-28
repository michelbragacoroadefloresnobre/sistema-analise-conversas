/*
  Warnings:

  - You are about to alter the column `notaVenda` on the `AiAnalysis` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.
  - You are about to alter the column `notaPosVenda` on the `AiAnalysis` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.
  - You are about to alter the column `nota` on the `CriterioFaltante` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "AiAnalysis" ALTER COLUMN "notaVenda" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "notaPosVenda" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CriterioFaltante" ALTER COLUMN "nota" SET DATA TYPE DOUBLE PRECISION;
