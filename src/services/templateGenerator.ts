import { renderFile } from "ejs";
import { FinalReport } from "./inputParser";
import path from "path";
import { getView } from "../utils";

export const ATTENDANTS_CHART_CID = "attendantsChart";

export async function getDailyReportHtml(
  data: FinalReport & { metadata: { reportDate: string; type: string } },
  chartImage: Buffer<ArrayBufferLike>
) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const htmlOptions = {
    data,
    formatDate,
    websiteUrl:
      process.env.WEBSITE_URL || "http://localhost:" + process.env.PORT,
  };

  const _pdfHtml = renderFile(getView("dailyReport.ejs"), {
    ...htmlOptions,
    chartImage: `data:image/png;base64,${chartImage.toString("base64")}`,
  });

  const _emailHtml = renderFile(getView("dailyReport.ejs"), {
    ...htmlOptions,
    chartImage: `cid:${ATTENDANTS_CHART_CID}`,
  });

  const [pdfHtml, emailHtml] = await Promise.all([_pdfHtml, _emailHtml]);

  return {
    forPdf: pdfHtml,
    forEmail: {
      content: emailHtml,
      attachments: [
        {
          filename: "attendants-chart.png",
          content: chartImage,
          cid: ATTENDANTS_CHART_CID,
        },
      ],
    },
  };
}
