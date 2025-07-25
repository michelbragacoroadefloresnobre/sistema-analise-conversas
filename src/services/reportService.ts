import { getDailyReportHtml } from "../templates/dailyReportTemplate";
import { generateBarChart } from "./chartGenerator";
import { FinalReport } from "./inputParser";
import { generatePdfFromHtml } from "./pdfGenerator";

export async function createDailyReport(
  reportData: FinalReport & { metadata: { reportDate: string; type: string } }
) {
  const topFuncionariosData = reportData.rankings.topFuncionarios.map((f) => ({
    label: f.nome,
    value: f.notaMedia,
  }));

  const barChartImage = await generateBarChart(topFuncionariosData);

  const html = getDailyReportHtml(reportData, barChartImage);

  const pdf = await generatePdfFromHtml(html);

  return { html, pdf };
}
