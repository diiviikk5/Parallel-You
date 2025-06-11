const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const { prompt, persona, model } = req.body;

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    return res.status(400).json({ error: "Missing API Key" });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // ✅ Use a valid free model
  const selectedModel = model || "mistralai/mistral-7b-instruct:free";

  const systemPrompt = `
You are roleplaying as a character named "${persona?.name || "AI Entity"}" from a parallel universe.

Description: ${persona?.description || "No description provided."}
Greeting: ${persona?.greeting || "Say hello!"}

⚠️ Stay completely in character and never reveal you're an AI.
✅ Speak naturally, with personality and emotion, and respond with immersive, in-universe flair.
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "No reply from AI", raw: response.data });
    }

    res.json({ response: reply });
  } catch (error) {
    console.error("❌ AI request failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI request failed: " + (error.response?.data?.error?.message || error.message),
      data: error.response?.data
    });
  }
});

app.listen(3001, () => {
  console.log("🧠 AI server running at http://localhost:3001");
});
