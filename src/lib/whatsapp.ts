import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const wClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

wClient.on("qr", (qr) =>
  qrcode.generate(qr, { small: true }, (qrcode) => console.log(qrcode))
);

wClient.on("ready", () => console.log("WhatsApp client initialized"));

export { wClient };
