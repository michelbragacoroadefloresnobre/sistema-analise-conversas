import { generateBarChart } from './chartGenerator';
import { getDailyReportHtml } from '../templates/dailyReportTemplate';
import { generatePdfFromHtml } from './pdfGenerator';

export async function createDailyReport(reportData: any) {
  console.log(reportData)
  const topFuncionariosData = reportData.rankings.top_funcionarios.map((f: any) => ({
    label: f.nome,
    value: f.nota_media
  }));
  const barChartImage = await generateBarChart(topFuncionariosData);

  const html = getDailyReportHtml(reportData, barChartImage);

  const pdf = await generatePdfFromHtml(html);

  return { html, pdf };
}