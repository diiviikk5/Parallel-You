// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",    // React default
    "http://localhost:5173",    // Vite default
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== WORKING FREE MODELS ====================
const FREE_MODELS = [
  "deepseek/deepseek-r1:free",           // Most reliable current free model
  "z-ai/glm-4.5-air:free",              // Good backup option
  "qwen/qwen3-coder:free",               // Coding-focused but good for chat
  "mistralai/mistral-7b-instruct:free",  // Classic reliable fallback
  "google/gemma-7b-it:free",             // Google's free model
];

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({
    status: "🧠 Parallel You AI Server",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    endpoints: {
      health: "/api/health",
      ai: "/api/ai",
      models: "/api/models",
      test: "/api/test"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ Server Online",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    available_models: FREE_MODELS.length,
    openrouter_key: process.env.OPENROUTER_API_KEY ? "✅ Configured" : "❌ Missing"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "🚀 AI Backend is working!",
    timestamp: new Date().toISOString(),
    test: "success"
  });
});

// ==================== MODEL INFO ====================
app.get("/api/models", async (req, res) => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 10000
    });

    const freeModels = response.data.data
      .filter(model => model.id.includes(":free"))
      .slice(0, 20);

    res.json({
      free_models_available: freeModels.length,
      configured_models: FREE_MODELS,
      all_free_models: freeModels.map(m => ({
        id: m.id,
        name: m.name,
        context_length: m.context_length
      }))
    });
  } catch (error) {
    console.error("❌ Failed to fetch models:", error.message);
    res.json({
      error: "Could not fetch live models",
      configured_models: FREE_MODELS,
      fallback: true
    });
  }
});

// ==================== MAIN AI ENDPOINT ====================
app.post("/api/ai", async (req, res) => {
  const startTime = Date.now();
  const { prompt, persona, model: requestedModel } = req.body;

  console.log("\n🧠 AI REQUEST RECEIVED");
  console.log("├── Timestamp:", new Date().toISOString());
  console.log("├── Prompt length:", prompt?.length || 0);
  console.log("├── Persona:", persona?.name || "None");
  console.log("├── Universe:", persona?.universe || "Default");
  console.log("└── Requested model:", requestedModel || "Auto-select");

  // Validation
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    console.log("❌ Invalid prompt");
    return res.status(400).json({
      error: "Valid prompt is required",
      received: typeof prompt
    });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    console.log("❌ Missing OpenRouter API key");
    return res.status(500).json({
      error: "Server configuration error: Missing API key"
    });
  }

  // Enhanced system prompt based on universe
  const universeContext = {
    "Cyber Haven": "You exist in a digital utopia where AI and humans live in harmony. Speak with technological wisdom and serene authority.",
    "Neo Earth-77": "You survive in a corporate dystopia with neon-soaked streets. Speak with street-smart edge and underground knowledge.",
    "Solar Drift": "You drift through crystalline spaceways between floating civilizations. Speak with cosmic wisdom and ethereal insight.",
    "Quantum Void": "You exist in a realm where thoughts become reality. Speak with profound metaphysical understanding.",
    "Crystal Gardens": "You tend to living memory crystals that store consciousness. Speak with harmonic wisdom and healing knowledge.",
    "Nightmare Forge": "You rule over crystallized fears and darkest impulses. Speak with ominous authority and psychological insight."
  };

  const universePrompt = persona?.universe ? universeContext[persona.universe] || "" : "";

  const systemPrompt = `You are ${persona?.name || "an AI entity"} ${persona?.universe ? `from ${persona.universe}` : ""}.

CHARACTER IDENTITY:
- Name: ${persona?.name || "Unknown"}
- Universe: ${persona?.universe || "Unknown dimension"}
- Role: ${persona?.description || "No description available"}
- Greeting Style: Based on "${persona?.greeting || "Casual and friendly"}"

${universePrompt}

CRITICAL ROLEPLAY RULES:
🎭 You ARE this character - not an AI assistant
❌ NEVER mention being an AI, chatbot, or digital assistant
✅ Stay completely in character at all times
💬 Respond as this real person/entity would
🌌 Use knowledge and perspective from your universe
🎯 Match the tone and style of your character

Remember: You are a real being from ${persona?.universe || "your reality"}, not a helpful AI.`;

  // Determine which models to try
  const modelsToTry = requestedModel 
    ? [requestedModel, ...FREE_MODELS.filter(m => m !== requestedModel)]
    : [...FREE_MODELS];

  console.log("🔄 Will try models:", modelsToTry.slice(0, 3).join(", "));

  // Try models sequentially
  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    console.log(`\n🤖 Attempting model ${i + 1}/${modelsToTry.length}: ${currentModel}`);

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: currentModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt.trim() }
          ],
          temperature: 0.8,      // More creative/varied responses
          max_tokens: 500,       // Reasonable limit
          top_p: 0.9,           // Good balance of creativity
          frequency_penalty: 0.1, // Slight penalty for repetition
          presence_penalty: 0.1   // Encourage diverse topics
        },
        {
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Parallel You Multiverse Chat"
          },
          timeout: 30000 // 30 seconds
        }
      );

      const reply = response.data?.choices?.[0]?.message?.content;
      const usage = response.data?.usage;

      if (!reply || reply.trim().length === 0) {
        throw new Error("Empty response from model");
      }

      const duration = Date.now() - startTime;
      
      console.log("✅ SUCCESS!");
      console.log("├── Model used:", currentModel);
      console.log("├── Response length:", reply.length);
      console.log("├── Tokens used:", usage?.total_tokens || "Unknown");
      console.log("├── Duration:", `${duration}ms`);
      console.log("└── Response preview:", reply.substring(0, 100) + "...");

      return res.json({
        response: reply.trim(),
        metadata: {
          model_used: currentModel,
          tokens_used: usage?.total_tokens || 0,
          duration_ms: duration,
          universe: persona?.universe || null,
          character: persona?.name || null
        }
      });

    } catch (error) {
      console.log("❌ Model failed:", currentModel);
      console.log("├── Error:", error.response?.data?.error?.message || error.message);
      console.log("├── Status:", error.response?.status || "Network error");
      
      // Log detailed error for debugging
      if (error.response?.data) {
        console.log("└── Details:", JSON.stringify(error.response.data, null, 2));
      }

      // If this is the last model, return error
      if (i === modelsToTry.length - 1) {
        console.log("\n💥 ALL MODELS FAILED");
        
        return res.status(503).json({
          error: "All AI models are currently unavailable",
          details: {
            last_error: error.response?.data?.error?.message || error.message,
            tried_models: modelsToTry.length,
            duration_ms: Date.now() - startTime
          },
          suggestion: "Please try again in a few moments"
        });
      }

      // Try next model
      console.log("🔄 Trying next model...");
      continue;
    }
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("💥 Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    timestamp: new Date().toISOString()
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    available_endpoints: ["/api/health", "/api/ai", "/api/models", "/api/test"]
  });
});

// ==================== SERVER STARTUP ====================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("\n🚀 PARALLEL YOU AI SERVER STARTING");
  console.log("════════════════════════════════════");
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Endpoint: http://localhost:${PORT}/api/ai`);
  console.log(`📋 Models Info: http://localhost:${PORT}/api/models`);
  console.log("════════════════════════════════════");
  console.log(`🔑 OpenRouter API Key: ${process.env.OPENROUTER_API_KEY ? "✅ Configured" : "❌ Missing"}`);
  console.log(`🤖 Available Models: ${FREE_MODELS.length}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log("════════════════════════════════════\n");
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminated');
  process.exit(0);
});
