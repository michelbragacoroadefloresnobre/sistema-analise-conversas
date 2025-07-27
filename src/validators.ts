import { z } from "zod";

const ResumoExecutivoSchema = z.object({
  tipoAtendimento: z.string({
    required_error: "O campo 'tipoAtendimento' é obrigatório.",
  }),
  pontoAlto: z.string({
    required_error: "O campo 'pontoAlto' é obrigatório.",
  }),
  oportunidade: z.string({
    required_error: "O campo 'oportunidade' é obrigatório.",
  }),
  classificacao: z.enum(
    ["excelente", "bom", "regular", "fraco", "nao_aplicavel"],
    {
      required_error: "O campo 'classificacao' é obrigatório.",
    }
  ),
});

const AiAnalysisSchema = z.object({
  contextoIdentificado: z.enum(
    ["telefone", "hibrido", "whatsApp", "nao_aplicavel"],
    {
      required_error: "O campo 'contextoIdentificado' é obrigatório.",
    }
  ),
  notaVenda: z
    .number({
      required_error: "O campo 'notaVenda' é obrigatório.",
    })
    .int(),
  justificativaVenda: z.string({
    required_error: "O campo 'justificativaVenda' é obrigatório.",
  }),
  notaPosVenda: z
    .number({
      required_error: "O campo 'notaPosVenda' é obrigatório.",
    })
    .int(),
  justificativaPosVenda: z.string({
    required_error: "O campo 'justificativaPosVenda' é obrigatório.",
  }),
  oportunidadesNaoAproveitadas: z.array(z.string(), {
    required_error: "O campo 'oportunidadesNaoAproveitadas' é obrigatório.",
  }),
  sensacaoCliente: z.string({
    required_error: "O campo 'sensacaoCliente' é obrigatório.",
  }),
  resumoExecutivo: ResumoExecutivoSchema,
});

const ConversationAnalysisSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  employeeName: z.string(),
  protocol: z.string(),
  status: z.string(),
  ai: AiAnalysisSchema,
});

export const ReportSchema = z.object({
  reportDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "A 'reportDate' deve estar no formato YYYY-MM-DD."
    ),
  data: z
    .array(ConversationAnalysisSchema)
    .min(1, "O relatório deve conter pelo menos uma conversa."),
  type: z.enum(["daily"]),
});

export type ReportPayload = z.infer<typeof ReportSchema>;
