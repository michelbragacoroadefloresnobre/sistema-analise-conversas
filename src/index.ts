import express from "express";
import { ZodError } from "zod";
import { db } from "./db";
import { inputParser } from "./services/inputParser";
import { createDailyReport } from "./services/reportService";
import { sendReportByEmail } from "./services/sendReportService";
import { getView } from "./utils";
import { ReportSchema } from "./validators";
import { wClient } from "./lib/whatsapp";
import { MessageMedia } from "whatsapp-web.js";
import { readFile, writeFile } from "fs/promises";
import { Readable } from "stream";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.set("view engine", "ejs");
app.set("views", getView());

app.post("/reports", async (req, res) => {
  try {
    let body = ReportSchema.parse(req.body);

    if (!body) {
      return res.status(400).send({ error: "Dados do relatorio inválidos" });
    }

    body = {
      ...body,
      data: body.data.filter(
        (r) =>
          r.status.toLowerCase() === "analisado" &&
          r.ai.resumoExecutivo.tipoAtendimento.toLowerCase() !== "telefone"
      ),
    };

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
                  notaVenda: c.ai.notaVenda || 0,
                  justificativaVenda: c.ai.justificativaVenda,
                  notaPosVenda: c.ai.notaPosVenda || 0,
                  justificativaPosVenda:
                    c.ai.justificativaPosVenda || "indisponivel",
                  sensacaoCliente: c.ai.sensacaoCliente,
                  criteriosFaltantes: {
                    create: c.ai.criteriosFaltantes,
                  },
                  resumoExecutivo: {
                    create: {
                      tipoAtendimento: c.ai.resumoExecutivo.tipoAtendimento,
                      houveVenda: c.ai.resumoExecutivo.houveVenda,
                      oportunidade: c.ai.resumoExecutivo.oportunidade,
                      pontoAlto: c.ai.resumoExecutivo.pontoAlto,
                      classificacao:
                        c.ai.resumoExecutivo.classificacao || "nao_aplicavel",
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
                criteriosFaltantes: true,
                resumoExecutivo: true,
              },
            },
          },
        },
      },
    });

    if (!data)
      return res
        .status(500)
        .send({ error: "Não foi possivel salvar no banco de dados" });

    let report: Awaited<ReturnType<typeof createDailyReport>>;

    switch (data.type) {
      case "daily":
        report = await createDailyReport({
          ...inputParser(data.conversations),
          metadata: { reportDate: body.reportDate, type: body.type },
        });
        break;
      default:
        return;
    }

    res.status(200).send({ message: "Relatorio gerado com sucesso!" });

    const reportDate = req.body.reportDate;
    await sendReportByEmail(report.html.content, reportDate, [
      ...report.html.attachments,
      {
        filename: "relatorio.pdf",
        content: report.pdf,
      },
    ]);

    const pdfBase64 = Buffer.from(report.pdf).toString("base64");

    await wClient.sendMessage(
      "5511910394565@c.us",
      new MessageMedia("application/pdf", pdfBase64, "relatorio.pdf"),
      {
        caption: `Relatório Diario ${reportDate}`,
        sendMediaAsDocument: true,
      }
    );

    return;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Erro de validação:", error.format());

      return res.status(400).json({
        error: "Dados invalidos",
        content: error.format(),
      });
    }
    console.error("Erro no processo:", error);
    // res.status(500).send({ error: "Algo deu errado. Se persistir contante o suporte." });
  }
});

app.get("/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conversationId = parseInt(id, 10);

    if (isNaN(conversationId)) {
      return res.status(400).send("O ID da conversa deve ser um número.");
    }

    const conversation = await db.conversationAnalysis.findUnique({
      where: { id: conversationId },
      include: {
        ai: {
          include: {
            resumoExecutivo: true,
          },
        },
      },
    });

    if (!conversation) {
      return res
        .status(404)
        .render("error", { message: "Análise de Conversa não encontrada" });
    }

    const getClassificationClass = (
      classification: string | null | undefined
    ) => {
      switch (classification) {
        case "excelente":
          return "status-excelente";
        case "bom":
          return "status-bom";
        case "regular":
          return "status-regular";
        case "fraco":
          return "status-fraco";
        default:
          return "status-default";
      }
    };

    res.render("conversation", {
      conversation,
      getClassificationClass,
    });
  } catch (error) {
    console.error("Erro ao buscar a conversa:", error);
    res.status(500).render("error", { message: "Erro interno no servidor" });
  }
});

app.listen(port, () => {
  console.log(`Servidor de relatórios rodando na porta ${port}`);
});

wClient.initialize();
