// /controllers/aicontroller.js
const axios = require("axios");
const { prepareResponse } = require("../utils/response");
const http = require("../utils/http");
const { GET, SERVER_ERROR_MESSAGE } = require("../utils/messages");

const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const SITE_URL = process.env.OPENROUTER_SITE_URL || "https://your-domain.com";
const APP_NAME = process.env.OPENROUTER_APP_NAME || "Your App Name";
const TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 60_000);

// Global default key (used if a per-model key is not set)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

/**
 * Registry of your models with:
 * - id: OpenRouter model id
 * - keyEnv: optional env var to override API key for this model
 */
const REGISTRY = {
  amitav: {
    label: "Amitav AI (Best Model)",
    id: "amitav", // 🚀 custom meta-model — triggers best-of logic
    keyEnv: null, // no key needed, we handle internally
  },
  deepseek_v3: {
    label: "DeepSeek V3 0324 (free)",
    id: "deepseek/deepseek-chat-v3-0324:free",
    keyEnv: "OPENROUTER_API_KEY_DEEPSEEK_V3",
  },
  gemini_flash_exp: {
    label: "Gemini 2.0 Flash Experimental (free)",
    id: "google/gemini-2.0-flash-exp:free",
    keyEnv: "OPENROUTER_API_KEY_GEMINI_FLASH",
  },
  deepseek_r1: {
    label: "DeepSeek R1 (free)",
    id: "deepseek/deepseek-r1:free",
    keyEnv: "OPENROUTER_API_KEY_DEEPSEEK_R1",
  },
  gpt_oss_20b: {
    label: "OpenAI gpt-oss-20b (free)",
    id: "openai/gpt-oss-20b:free",
    keyEnv: "OPENROUTER_API_KEY_GPT_OSS_20B",
  },
};

// Order used for Amitav best-of
const AMITAV_MODELS = [
  REGISTRY.deepseek_v3.id,
  REGISTRY.gemini_flash_exp.id,
  REGISTRY.deepseek_r1.id,
  REGISTRY.gpt_oss_20b.id,
];
const MODELS_FOR_UI = [REGISTRY.amitav.id, ...AMITAV_MODELS];

// Judge model (can be one of the 4)
const JUDGE_MODEL =
  process.env.OPENROUTER_JUDGE_MODEL || REGISTRY.gpt_oss_20b.id;

/** Resolve API key for a specific OpenRouter model id (model-specific key wins). */
function resolveApiKeyForModel(modelId) {
  // Find registry entry whose id matches modelId
  const entry = Object.values(REGISTRY).find((e) => e.id === modelId);
  if (entry?.keyEnv && process.env[entry.keyEnv])
    return process.env[entry.keyEnv];
  if (!OPENROUTER_API_KEY) {
    const e = new Error(
      `Missing API key. Set ${entry?.keyEnv || "OPENROUTER_API_KEY"} in .env`
    );
    e.status = 500;
    throw e;
  }
  return OPENROUTER_API_KEY;
}

/** Low-level OpenRouter call */
async function callOpenRouter(model, body) {
  const apiKey = resolveApiKeyForModel(model);
  const url = `${OPENROUTER_BASE_URL}/chat/completions`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": SITE_URL,
    "X-Title": APP_NAME,
  };

  const payload = {
    model,
    messages: body.messages,
    temperature: body.temperature ?? 0.7,
    max_tokens: body.max_tokens,
    top_p: body.top_p,
    tools: body.tools,
    tool_choice: body.tool_choice,
    ...(body.metadata ? { metadata: body.metadata } : {}),
  };

  const resp = await axios.post(url, payload, { headers, timeout: TIMEOUT_MS });
  const choice = resp?.data?.choices?.[0];

  return {
    model,
    role: choice?.message?.role || "assistant",
    content: choice?.message?.content || "",
    finish_reason: choice?.finish_reason || "stop",
    raw: resp.data,
  };
}

/** Best-of across multiple models using a judge */
async function bestOf(modelIds, body) {
  const settled = await Promise.allSettled(
    modelIds.map((m) => callOpenRouter(m, body))
  );
  const candidates = settled
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter(Boolean);

  if (!candidates.length) {
    const e = new Error("All model calls failed");
    e.status = 502;
    throw e;
  }

  // Default winner = first successful
  let winner = candidates[0];
  let judgeJSON = null;

  // Judge prompt
  const judgeMessages = [
    {
      role: "system",
      content:
        'You are a strict ranking judge. Return ONLY JSON like {"winner_index": number, "rationale":"..."}',
    },
    {
      role: "user",
      content: [
        "PROMPT:",
        JSON.stringify(body.messages, null, 2),
        "",
        "CANDIDATES:",
        ...candidates.map(
          (c, i) => `#${i}\nModel: ${c.model}\n---\n${c.content}\n---`
        ),
        "",
        "Return JSON ONLY.",
      ].join("\n"),
    },
  ];

  try {
    const judgeResp = await callOpenRouter(JUDGE_MODEL, {
      messages: judgeMessages,
      temperature: 0,
    });
    const match = judgeResp.content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (
        typeof parsed.winner_index === "number" &&
        candidates[parsed.winner_index]
      ) {
        judgeJSON = parsed;
        winner = candidates[parsed.winner_index];
      }
    }
  } catch {
    // ignore judge errors; keep default winner
  }

  return {
    winner,
    judge: judgeJSON,
    candidates: candidates.map((c) => ({
      model: c.model,
      finish_reason: c.finish_reason,
      content: c.content,
    })),
  };
}

/**
 * POST /ai/message
 * body:
 * {
 *   model?: "amitav" | one of:
 *           "deepseek/deepseek-chat-v3-0324:free" |
 *           "google/gemini-2.0-flash-exp:free" |
 *           "deepseek/deepseek-r1:free" |
 *           "openai/gpt-oss-20b:free"
 *   messages: [{ role: "system"|"user"|"assistant", content: "..." }, ...],
 *   temperature?, max_tokens?, top_p?, tools?, tool_choice?, metadata?
 * }
 */
exports.sendMessage = async (req, res) => {
  const body = req.body || {};
  const picked = (body.model || "").toLowerCase();

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ ok: false, error: "messages[] is required" });
  }

  // If a specific model is picked and it's not "amitav"
  if (picked && picked !== "amitav") {
    try {
      // Allow passing either the full id OR any friendly key in REGISTRY
      const byKey = REGISTRY[picked];
      const modelId = byKey ? byKey.id : body.model;
      const out = await callOpenRouter(modelId, body);
      const data = {
        ok: true,
        strategy: "single",
        model: out.model,
        message: { role: out.role, content: out.content },
        finish_reason: out.finish_reason,
      };
      return res.status(http.OK).json(prepareResponse("OK", GET, data, null));
    } catch (err) {
      return res
        .status(http.SERVER_ERROR)
        .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, err));
    }
  }

  // Amitav = best-of across your 4 models
  try {
    const { winner, candidates, judge } = await bestOf(AMITAV_MODELS, body);
    const data = {
      ok: true,
      strategy: "amitav-best-of",
      model: winner.model,
      message: { role: winner.role || "assistant", content: winner.content },
      finish_reason: winner.finish_reason,
      candidates,
      judge,
    };
    return res.status(http.OK).json(prepareResponse("OK", GET, data, null));
  } catch (err) {
    return res
      .status(http.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, err));
  }
};

/** GET /ai/models — show configured models + judge */
exports.listModels = async (_req, res) => {
  const data = {
    ok: true,
    models: MODELS_FOR_UI,
    judge: JUDGE_MODEL,
    registry: Object.fromEntries(
      Object.entries(REGISTRY).map(([k, v]) => [
        k,
        { label: v.label, id: v.id },
      ])
    ),
  };
  res.status(http.OK).json(prepareResponse("OK", GET, data, null));
};
