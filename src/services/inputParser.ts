import { ConversationAnalysis } from "../types/prisma-types";

export function inputParser(conversations: ConversationAnalysis[]) {
  const aiAnalyse = conversations.map((c) => c.ai);

  const totalConversations = conversations.length;
  const finalScore = aiAnalyse.map((c) => c!.notaVenda);

  const averageScore =
    finalScore.length > 0
      ? (finalScore.reduce((a, b) => a + b, 0) / finalScore.length).toFixed(1)
      : "N/A";

  const averageTimeToRespond = "N/A";
  const resolutionTax = "N/A";

  const attendantStatsMap = new Map<
    string,
    { totalScore: number; count: number }
  >();

  conversations.forEach((convo) => {
    // Trata casos de múltiplos atendentes na mesma conversa (ex: "Nome1 + Nome2")
    const attendants = convo.employeeName.split(" + ");
    attendants.forEach((name) => {
      const trimmedName = name.trim();
      const stats = attendantStatsMap.get(trimmedName) ?? {
        totalScore: 0,
        count: 0,
      };
      stats.totalScore += convo!.ai!.notaVenda;
      stats.count += 1;
      attendantStatsMap.set(trimmedName, stats);
    });
  });

  const rankedAttendants = Array.from(attendantStatsMap.entries()).map(
    ([name, stats]) => ({
      nome: name,
      notaMedia: stats.totalScore / stats.count,
    })
  );

  // 3. Classificar Atendentes
  rankedAttendants.sort((a, b) => b.notaMedia - a.notaMedia);

  const bestAttendants = rankedAttendants.slice(0, 3);
  const worstAttendants = [...rankedAttendants].reverse().slice(0, 3);

  const rankedConversations = conversations.sort(
    (a, b) => b!.ai!.notaVenda - a!.ai!.notaVenda
  );

  const bestConversations = rankedConversations.slice(0, 5);
  const worstConversations = rankedConversations.reverse().slice(0, 5);

  const finalReport = {
    resumoExecutivo: {
      totalConversas: totalConversations,
      notaMedia: parseFloat(averageScore),
      tempoMedioResposta: averageTimeToRespond,
      taxaResolucao: resolutionTax,
      comparativoDiaAnterior: "N/A", // Exemplo
    },
    rankings: {
      topFuncionarios: bestAttendants,
      atencaoNecessaria: worstAttendants,
    },
    conversasDestaque: {
      melhores: bestConversations,
      piores: worstConversations,
    },
  };

  return finalReport;
}

export type FinalReport = ReturnType<typeof inputParser>;
