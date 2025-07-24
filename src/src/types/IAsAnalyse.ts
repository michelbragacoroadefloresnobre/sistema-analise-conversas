interface ExecutiveSummary {
  tipoAtendimento: string;
  pontoAlto: string;
  oportunidade: string;
  classificacao: string;
}

export interface AIsAnalyse {
  status: string;
  notaVenda: number;
  notaPosVenda: number;
  notaFinal: number;
  classificacao: string;
  resumoExecutivo: ExecutiveSummary;
  pontosMelhoria: string[];
  tempoRespostaMinutos: number | null;
  foiResolvido: boolean;
}
