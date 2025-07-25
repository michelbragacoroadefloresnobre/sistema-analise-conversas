-- CreateEnum
CREATE TYPE "ContextoIdentificado" AS ENUM ('telefone', 'hibrido', 'whatsApp', 'nao_aplicavel');

-- CreateEnum
CREATE TYPE "Classificacao" AS ENUM ('excelente', 'bom', 'regular', 'fraco', 'nao_aplicavel');

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reportDate" DATE NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationAnalysis" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "ConversationAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" SERIAL NOT NULL,
    "contextoIdentificado" "ContextoIdentificado" NOT NULL,
    "notaVenda" INTEGER NOT NULL,
    "notaPosVenda" INTEGER NOT NULL,
    "justificativaVenda" TEXT NOT NULL,
    "justificativaPosVenda" TEXT NOT NULL,
    "sensacaoCliente" TEXT NOT NULL,
    "oportunidadesNaoAproveitadas" TEXT[],
    "conversationAnalysisId" INTEGER NOT NULL,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumoExecutivo" (
    "id" SERIAL NOT NULL,
    "tipoAtendimento" TEXT NOT NULL,
    "pontoAlto" TEXT NOT NULL,
    "oportunidade" TEXT NOT NULL,
    "classificacao" "Classificacao" NOT NULL,
    "aiAnalysisId" INTEGER NOT NULL,

    CONSTRAINT "ResumoExecutivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiAnalysis_conversationAnalysisId_key" ON "AiAnalysis"("conversationAnalysisId");

-- CreateIndex
CREATE UNIQUE INDEX "ResumoExecutivo_aiAnalysisId_key" ON "ResumoExecutivo"("aiAnalysisId");

-- AddForeignKey
ALTER TABLE "ConversationAnalysis" ADD CONSTRAINT "ConversationAnalysis_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_conversationAnalysisId_fkey" FOREIGN KEY ("conversationAnalysisId") REFERENCES "ConversationAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumoExecutivo" ADD CONSTRAINT "ResumoExecutivo_aiAnalysisId_fkey" FOREIGN KEY ("aiAnalysisId") REFERENCES "AiAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
