import { FinalReport } from "../services/inputParser";
import { reportCss } from "./report.css";

export function getDailyReportHtml(
  data: FinalReport & { metadata: { reportDate: string; type: string } },
  chartImage: string
): string {
  const { metadata, rankings, resumoExecutivo, conversasDestaque } = data;

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Diário - Tallos</title>
      ${reportCss}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Relatório Diário de Atendimento</h1>
          <p>Dados de: ${formatDate(metadata.reportDate)}</p>
        </div>

        <h2>📊 Resumo Executivo</h2>
        <div class="summary-grid">
          <div class="metric-card">
            <h3>Nota Média</h3>
            <p>${resumoExecutivo.notaMedia}</p>
          </div>
          <div class="metric-card">
            <h3>Conversas</h3>
            <p>${resumoExecutivo.totalConversas}</p>
          </div>
          <div class="metric-card">
            <h3>Tempo Médio</h3>
            <p>${resumoExecutivo.tempoMedioResposta}</p>
          </div>
        </div>

        <h2>👥 Top Funcionários</h2>
        <div class="chart-container">
            <img src="${chartImage}" alt="Gráfico de Top Funcionários" />
        </div>
        
        <h2>🚨 Atenção Necessária</h2>
        ${
          rankings.atencaoNecessaria.length > 0
            ? `<table>
              <tr><th>Funcionário</th><th>Nota Média</th></tr>
              ${rankings.atencaoNecessaria
                .map(
                  (f) => `
                <tr><td class="danger">${f.nome}</td><td class="danger">${f.notaMedia}</td></tr>
              `
                )
                .join("")}
            </table>`
            : "<p>Nenhum funcionário com nota abaixo de 7.0 hoje!</p>"
        }
        
        <h2>⭐ Melhores Conversas (Top 5)</h2>
        <table>
          <tr><th>Funcionário</th><th>Cliente</th><th>Nota</th></tr>
          ${conversasDestaque.melhores
            .map(
              (c) => `
            <tr><td>${"N/A"}</td><td>${"N/A"}</td><td>${"N/A"}</td></tr>
          `
            )
            .join("")}
        </table>

        <h2>⚠️ Piores Conversas (Top 5)</h2>
        <table>
          <tr><th>Funcionário</th><th>Cliente</th><th>Nota</th></tr>
          ${conversasDestaque.piores
            .map(
              (c: any) => `
            <tr><td>${"N/A"}</td><td>${"N/A"}</td><td>${"N/A"}</td></tr>
          `
            )
            .join("")}
        </table>
        
        <div class="footer">
          <p>Relatório gerado automaticamente pelo Sistema.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
