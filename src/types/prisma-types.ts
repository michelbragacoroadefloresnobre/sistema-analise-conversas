export type ContextoIdentificado =
  | "telefone"
  | "hibrido"
  | "whatsApp"
  | "nao_aplicavel";

export type Classificacao =
  | "excelente"
  | "bom"
  | "regular"
  | "fraco"
  | "nao_aplicavel";

/**
 * Representa o objeto aninhado 'resumoExecutivo' da sua análise de IA.
 */
export type ResumoExecutivo = {
  id: number;
  tipoAtendimento: string;
  pontoAlto: string;
  oportunidade: string;
  classificacao: Classificacao;
  aiAnalysisId: number;
};

/**
 * Representa a análise completa da IA, incluindo o resumo executivo.
 */
export type AiAnalysis = {
  id: number;
  contextoIdentificado: ContextoIdentificado;
  notaVenda: number;
  notaPosVenda: number;
  justificativaVenda: string;
  justificativaPosVenda: string;
  sensacaoCliente: string;
  oportunidadesNaoAproveitadas: string[];
  conversationAnalysisId: number;
  resumoExecutivo: ResumoExecutivo | null;
};

/**
 * Representa uma única conversa analisada, incluindo os dados completos da IA.
 */
export type ConversationAnalysis = {
  id: number;
  customerId: string;
  customerName: string;
  employeeName: string;
  protocol: string;
  reportId: number;
  ai: AiAnalysis | null;
};

export type ReportType = {
  id: number;
  reportDate: Date; // O tipo DateTime do Prisma é mapeado para o tipo Date do TypeScript
  type: string;
  createdAt: Date;
  conversations: ConversationAnalysis[];
};
