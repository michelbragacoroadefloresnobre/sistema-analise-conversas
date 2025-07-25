import express from "express";
import multer from "multer";
import { db } from "./db";
import { inputParser } from "./services/inputParser";
import { createDailyReport } from "./services/reportService";
import { ReportSchema } from "./validators";
const app = express();
const port = process.env.PORT || 3000;

const upload = multer();

app.use(express.json({ limit: "50mb" }));

app.post("/generate-report", upload.none(), async (req, res) => {
  try {
    const body = ReportSchema.parse(req.body);

    console.log("Recebida requisição pra gerar relatorio");

    if (!body) {
      return res.status(400).send({ error: "Dados do relatorio inválidos" });
    }
    console.log("Salvando no banco de dados...");

    const data = await db.report.create({
      data: {
        reportDate: body.reportDate,
        type: body.type,
        conversations: {
          create: body.data.map((c) => {
            return {
              customerId: c.customerId,
              customerName: c.customerName,
              employeeName: c.employeeName,
              protocol: c.protocol,
              ai: {
                create: {
                  contextoIdentificado: c.ai.contextoIdentificado,
                  notaVenda: c.ai.notaVenda,
                  justificativaVenda: c.ai.justificativaVenda,
                  notaPosVenda: c.ai.notaPosVenda,
                  justificativaPosVenda: c.ai.justificativaPosVenda,
                  sensacaoCliente: c.ai.sensacaoCliente,
                  oportunidadesNaoAproveitadas:
                    c.ai.oportunidadesNaoAproveitadas,
                  resumoExecutivo: {
                    create: {
                      tipoAtendimento: c.ai.resumoExecutivo.tipoAtendimento,
                      oportunidade: c.ai.resumoExecutivo.oportunidade,
                      pontoAlto: c.ai.resumoExecutivo.pontoAlto,
                      classificacao: c.ai.resumoExecutivo.classificacao,
                    },
                  },
                },
              },
            };
          }),
        },
      },
      include: {
        conversations: {
          include: {
            ai: {
              include: {
                resumoExecutivo: true,
              },
            },
          },
        },
      },
    });

    console.log(JSON.stringify(data, null, 2));

    if (!data)
      return res
        .status(500)
        .send({ error: "Não foi possivel salvar no banco de dados" });

    let report;

    switch (data.type) {
      case "daily":
        report = await createDailyReport({
          ...inputParser(data.conversations),
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

app.get("/conversations/:id", (req, res) => {
  res.status(200).send({ message: "Funcionando" });
});

app.listen(port, () => {
  console.log(`Servidor de relatórios rodando na porta ${port}`);
});
