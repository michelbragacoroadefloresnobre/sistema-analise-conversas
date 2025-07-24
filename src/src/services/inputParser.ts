import { AIsAnalyse } from "../types/IAsAnalyse";

export function inputParser(input: AIsAnalyse[]) {
  const analysed = input.filter(
    (r) =>
      r.status === "analisado" &&
      r.resumoExecutivo.tipoAtendimento !== "Telefone"
  );

  const date = new Date().toISOString().split("T")[0];

  const totalConversations = analysed.length;
  const finalScore = analysed.map((c) => c.notaFinal);
  const averageScore =
    finalScore.length > 0
      ? (finalScore.reduce((a, b) => a + b, 0) / finalScore.length).toFixed(1)
      : "N/A";

  const averageTimeToRespond = "N/A";
  const resolutionTax = "N/A";

  const bestConversations = analysed
    .sort((a, b) => b.notaFinal - a.notaFinal)
    .slice(0, 5);

  const poorConversations = analysed
    .sort((a, b) => b.notaFinal - a.notaFinal)
    .slice(0, 5);

  const finalReport = {
    resumoExecutivo: {
      totalConversas: totalConversations,
      notaMedia: parseFloat(averageScore),
      tempoMedioResposta: averageTimeToRespond,
      taxaResolucao: resolutionTax,
      comparativoDiaAnterior: "N/A", // Exemplo
    },
    rankings: {
      topFuncionarios: [{ nome: "N/A", notaMedia: 0 }],
      atencaoNecessaria: [{ nome: "N/A", notaMedia: 0 }],
    },
    conversasDestaque: {
      melhores: bestConversations,
      piores: poorConversations,
    },
  };

  return finalReport;
}

export type FinalReport = ReturnType<typeof inputParser>;
