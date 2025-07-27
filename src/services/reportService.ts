import { generateBarChart } from "./chartGenerator";
import { FinalReport } from "./inputParser";
import { generatePdfFromHtml } from "./pdfGenerator";
import { getDailyReportHtml } from "./templateGenerator";

export async function createDailyReport(
  reportData: FinalReport & { metadata: { reportDate: string; type: string } }
) {
  const topFuncionariosData = reportData.rankings.topFuncionarios.map((f) => ({
    label: f.nome,
    value: f.notaMedia,
  }));

  const barChartImage = await generateBarChart(topFuncionariosData);

  const html = await getDailyReportHtml(reportData, barChartImage);

  const pdf = await generatePdfFromHtml(html.forPdf);

  return { html: html.forEmail, pdf };
}
