const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const { SYSTEM_PROMPT } = require("./prompt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"; // FREE wala public model
const API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const HEADERS = {
  "Authorization": "Bearer", // Blank — no key for public models
  "Content-Type": "application/json"
};

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nNOBI:`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200 } })
    });

    const data = await response.json();

    const output = Array.isArray(data) ? data[0].generated_text : "🤬 No response laude.";
    const reply = output.replace(prompt, "").trim();

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "🔥 ERROR: " + err.message });
  }
});

app.listen(PORT, () => console.log(`🔥 NOBI BOT active on http://localhost:${PORT}`));