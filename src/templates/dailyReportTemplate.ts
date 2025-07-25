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
    <meta charset="UTF-8" />
    <title>Relatório Diário - Tallos</title>
    <link rel="stylesheet" href="./style.css" />
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
          ? `
      <table>
        <tr>
          <th>Funcionário</th>
          <th>Nota Média</th>
        </tr>
        ${rankings.atencaoNecessaria
          .map(
            (f) => `
        <tr>
          <td class="danger">${f.nome}</td>
          <td class="danger">${f.notaMedia}</td>
        </tr>
        `
          )
          .join("")}
      </table>
      `
          : "<p>Nenhum funcionário com nota abaixo de 7.0 hoje!</p>"
      }

      <h2>⭐ Melhores Conversas (Top 5)</h2>
      <table>
        <tr>
          <th>Funcionário</th>
          <th>Cliente</th>
          <th>Nota</th>
        </tr>
        ${conversasDestaque.melhores
          .map(
            (c) => `
        <tr>
          <td>${c.employeeName}</td>
          <td>${c.customerName}</td>
          <td>${c!.ai!.notaVenda}</td>
        </tr>
        `
          )
          .join("")}
      </table>

      <h2>⚠️ Piores Conversas (Top 5)</h2>
      <table>
        <tr>
          <th>Funcionário</th>
          <th>Cliente</th>
          <th>Nota</th>
          <th>Ações</th>
        </tr>
        ${conversasDestaque.piores
          .map(
            (c: any) => `
        <tr>
          <td>${c.employeeName}</td>
          <td>${c.customerName}</td>
          <td>${c.ai.notaVenda}</td>
          <td>
            <a
              class="details-button"
              href="${process.env.WEBSITE_URL + "/conversations/" + c.id}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-file-text-icon lucide-file-text"
              >
                <path
                  d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            </a>
          </td>
        </tr>
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
