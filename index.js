const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"; // FREE!
const API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const HEADERS = {
  "Authorization": "Bearer", // no key needed for some public models
  "Content-Type": "application/json"
};

const SYSTEM_PROMPT = `You are NOBI BOT. Reply toxic, sarcastic, but accurate. Never apologize. Roasts + Code = your style.`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nNOBI:`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 150 } })
    });

    const data = await response.json();
    const reply = data[0]?.generated_text?.replace(prompt, "").trim() || "🤐 No reply";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "🔥 ERROR: " + err.message });
  }
});

app.listen(3000, () => console.log("🔥 NOBI BOT ON PORT 3000"));