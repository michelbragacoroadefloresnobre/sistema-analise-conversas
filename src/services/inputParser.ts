import { Prisma } from "../generated/prisma";

type ConversationAnalysis = Prisma.ConversationAnalysisGetPayload<{
  include: {
    ai: {
      include: {
        resumoExecutivo: true;
      };
    };
  };
}>;

export function inputParser(conversations: ConversationAnalysis[]) {
  const totalConversations = conversations.length;

  const finalScores = conversations.map((c) => c.ai?.notaVenda ?? 0);
  const averageScore =
    finalScores.length > 0
      ? (finalScores.reduce((a, b) => a + b, 0) / finalScores.length).toFixed(2)
      : "N/A";

  const averageTimeToRespond = "N/A";
  const resolutionTax = "N/A";

  const attendantStatsMap = new Map<
    string,
    { totalScore: number; count: number; saleConversations: number }
  >();

  conversations.forEach((convo) => {
    const attendants = convo.employeeName.split(" + ");
    attendants.forEach((name) => {
      const trimmedName = name.trim();
      const stats = attendantStatsMap.get(trimmedName) ?? {
        totalScore: 0,
        count: 0,
        saleConversations: 0,
      };
      stats.totalScore += convo.ai!.notaVenda!;
      stats.saleConversations += convo.ai?.resumoExecutivo?.houveVenda ? 1 : 0;
      stats.count += 1;
      attendantStatsMap.set(trimmedName, stats);
    });
  });

  const rankedAttendants = Array.from(attendantStatsMap.entries()).map(
    ([name, stats]) => ({
      nome: name,
      notaMedia: stats.totalScore / stats.count,
      totalConversas: stats.count,
      conversasComVenda: stats.saleConversations,
    })
  );

  rankedAttendants.sort((a, b) => b.notaMedia - a.notaMedia);

  conversations.sort((a, b) => b.ai!.notaVenda! - a!.ai!.notaVenda!);

  const bestConversations = conversations.slice(0, 20);
  const worstConversations = [...conversations].reverse().slice(0, 20);

  const conversationsWithoutSale = conversations.filter(
    (c) => !c.ai?.resumoExecutivo?.houveVenda
  );

  const totalConversationsWithoutSale = conversationsWithoutSale.length;

  const conversationsWithoutSaleExamples = conversationsWithoutSale
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      employeeName: c.employeeName,
      customerName: c.customerName,
      oportunidade:
        c.ai?.resumoExecutivo?.oportunidade || "Nenhuma observação.",
    }));

  const finalReport = {
    resumoExecutivo: {
      totalConversas: totalConversations,
      notaMedia: averageScore === "N/A" ? 0 : parseFloat(averageScore),
      tempoMedioResposta: averageTimeToRespond,
      taxaResolucao: resolutionTax,
      comparativoDiaAnterior: "N/A",
      totalConversasSemVenda: totalConversationsWithoutSale,
    },
    atendentes: rankedAttendants,
    rankings: {
      topFuncionarios: rankedAttendants.slice(0, 5),
      atencaoNecessaria: [...rankedAttendants].reverse().slice(0, 5),
    },
    conversasDestaque: {
      melhores: bestConversations,
      piores: worstConversations,
    },
    conversasSemVenda: conversationsWithoutSaleExamples,
  };

  return finalReport;
}

export type FinalReport = ReturnType<typeof inputParser>;
