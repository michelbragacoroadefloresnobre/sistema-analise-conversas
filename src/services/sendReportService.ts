import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? "0"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia o relatório diário por e-mail para uma lista de destinatários.
 * @param htmlContent O corpo do e-mail em formato HTML.
 * @param reportDate A data do relatório para usar no título.
 */
export async function sendReportByEmail(
  htmlContent: string,
  reportDate: string,
  attachments: {
    filename: string;
    content: Buffer<ArrayBufferLike>;
    cid?: string;
  }[]
) {
  const mailOptions = {
    from: `"Relatórios Automáticos" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_RECIPENTS,
    subject: `Relatório Diário de Atendimento - ${reportDate}`,
    html: htmlContent,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}
