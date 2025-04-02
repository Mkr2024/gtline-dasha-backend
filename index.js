import express from "express";
import cors from "cors";
import * as dasha from "@dasha.ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let dashaApp;

async function initDasha() {
  dashaApp = await dasha.deploy({ app: process.env.DASHA_APP_NAME, apiKey: process.env.DASHA_API_KEY });
  await dashaApp.start();
  console.log("Dasha app started");
}

app.post("/talk", async (req, res) => {
  const userInput = req.body.text || "";
  try {
    const conv = dashaApp.createConversation({ input: userInput });
    const result = await conv.execute();
    res.json({ response: result.output });
  } catch (err) {
    console.error("Errore conversazione:", err);
    res.status(500).json({ error: "Conversazione fallita" });
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
  initDasha();
});