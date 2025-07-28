/*
  Warnings:

  - You are about to drop the column `oportunidadesNaoAproveitadas` on the `AiAnalysis` table. All the data in the column will be lost.
  - You are about to alter the column `notaVenda` on the `AiAnalysis` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,2)`.
  - You are about to alter the column `notaPosVenda` on the `AiAnalysis` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "AiAnalysis" DROP COLUMN "oportunidadesNaoAproveitadas",
ALTER COLUMN "notaVenda" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "notaPosVenda" SET DATA TYPE DECIMAL(4,2);

-- CreateTable
CREATE TABLE "CriterioFaltante" (
    "id" SERIAL NOT NULL,
    "criterio" TEXT NOT NULL,
    "nota" DECIMAL(4,2) NOT NULL,
    "aiAnalysisId" INTEGER NOT NULL,

    CONSTRAINT "CriterioFaltante_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CriterioFaltante" ADD CONSTRAINT "CriterioFaltante_aiAnalysisId_fkey" FOREIGN KEY ("aiAnalysisId") REFERENCES "AiAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
