import express from "express";
import multer from "multer";
import { inputParser } from "./src/services/inputParser";
import { createDailyReport } from "./src/services/reportService";
const app = express();
const port = process.env.PORT || 3000;

const upload = multer();

app.use(express.json({ limit: "50mb" }));

app.post("/generate-report", upload.none(), async (req, res) => {
  try {
    console.log("Recebida requisição pra gerar relatorio");
    const body = req.body;

    if (!body) {
      return res.status(400).send({ error: "Dados do relatorio inválidos" });
    }

    let report;

    switch (body.type) {
      case "daily":
        report = await createDailyReport({
          ...inputParser(body.data),
          metadata: { reportDate: body.reportDate, type: body.type },
        });
        break;
      default:
        return res
          .status(400)
          .send({ error: "Tipo de relatório não suportado." });
    }

    console.log("Relatório gerado com sucesso. Enviando resposta...");

    res.setHeader("Content-Type", "multipart/form-data; boundary=boundary");

    const responseParts = [
      `--boundary`,
      `Content-Disposition: form-data; name="html"`,
      `Content-Type: text/html`,
      ``,
      report.html,
      `--boundary`,
      `Content-Disposition: form-data; name="pdf"; filename="relatorio.pdf"`,
      `Content-Type: application/pdf`,
      ``,
      report.pdf,
      `--boundary--`,
    ];

    const responseBody = responseParts.join("\r\n");
    res.status(200).send(Buffer.from(responseBody));
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).send({ error: "Falha ao gerar o relatorio." });
  }
});

app.listen(port, () => {
  console.log(`Servidor de relatórios rodando na porta ${port}`);
});
