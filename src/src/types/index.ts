type TipoAtendimento = "telefone" | "whatsApp" | "hibrido";
type Classificacao =
  | "fraco"
  | "regular"
  | "bom"
  | "excelente"
  | "não aplicável";

interface ResumoExecutivo {
  tipoAtendimento: TipoAtendimento;
  pontoAlto: string;
  oportunidade: string;
  classificacao: Classificacao;
}

export interface AnaliseAI {
  contextoIdentificado: TipoAtendimento;
  notaVenda: number;
  justificativaVenda: string;
  notaPosVenda: number;
  justificativaPosVenda: string;
  oportunidadesNaoAproveitadas: string[];
  sensacaoCliente: string;
  resumoExecutivo: ResumoExecutivo;
}

export interface DadosAtendimento {
  customerId: string;
  customerName: string;
  employeeName: string;
  protocol: string;
  status: "analisado" | "pendente" | "erro";
  ai: AnaliseAI;
}

interface RelatorioAtendimento {
  reportDate: string; // formato: "YYYY-MM-DD"
  data: DadosAtendimento[];
  type: "daily" | "weekly" | "monthly";
}

export type RelatoriosAtendimento = RelatorioAtendimento[];
