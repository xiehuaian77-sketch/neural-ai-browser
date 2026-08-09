import express from "express";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pino from "pino";
import multer from "multer";

import { PROVIDER_DEFS, getAllProvidersForUI } from "./src/server/providers";
import { executeChat, executeChatStream, ExecuteChatOptions } from "./src/server/chatExecutor";
import { executeBattle } from "./src/server/battleExecutor";
import { parseFile } from "./src/server/fileParser";
import {
  ChatRequestSchema,
  ParsePageRequestSchema,
  AgentStepRequestSchema,
  SynthesizeRequestSchema,
  BattleRequestSchema,
  FileUploadRequestSchema,
  validateEnv,
} from "./src/server/validation";

dotenv.config();

// Validate environment before anything else
const env = validateEnv();

const app = express();
const PORT = env.PORT;
const HOST = env.HOST;

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// ==============================
// Rate Limiting
// ==============================

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==============================
// File Upload Configuration
// ==============================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/csv",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith("text/")) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// ==============================
// Health & Models API
// ==============================

app.get("/api/health", (_req, res) => {
  const providers = PROVIDER_DEFS.map((p) => p.id);
  res.json({ status: "ok", timestamp: new Date().toISOString(), providers });
});

app.get("/api/models", (_req, res) => {
  res.json({ providers: getAllProvidersForUI() });
});

// ==============================
// Unified Chat Endpoint
// ==============================

app.post("/api/chat", chatLimiter, async (req, res) => {
  const parseResult = ChatRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: `Invalid request: ${parseResult.error.issues.map((i) => i.message).join(", ")}`,
    });
  }

  const body = parseResult.data;

  try {
    const text = await executeChat(body as ExecuteChatOptions);
    res.json({ success: true, text, provider: body.provider, model: body.model });
  } catch (error: any) {
    logger.error({ err: error, provider: body.provider, model: body.model, route: "/api/chat" }, "chat failed");
    res.status(500).json({
      success: false,
      provider: body.provider,
      model: body.model,
      error: error?.message || "Chat request failed.",
    });
  }
});

// ==============================
// SSE Streaming Chat Endpoint
// ==============================

app.post("/api/chat/stream", chatLimiter, async (req, res) => {
  const parseResult = ChatRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: `Invalid request: ${parseResult.error.issues.map((i) => i.message).join(", ")}`,
    });
  }

  const body = parseResult.data;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    const stream = executeChatStream(body as ExecuteChatOptions);
    let fullText = "";

    for await (const chunk of stream) {
      fullText += chunk;
      res.write(`data: ${JSON.stringify({ delta: chunk, text: fullText })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true, text: fullText })}\n\n`);
    res.end();
  } catch (error: any) {
    logger.error({ err: error, provider: body.provider, model: body.model, route: "/api/chat/stream" }, "stream chat failed");
    res.write(`data: ${JSON.stringify({ error: error?.message || "Stream failed." })}\n\n`);
    res.end();
  }
});

// ==============================
// Battle Mode Endpoint
// ==============================

app.post("/api/battle", chatLimiter, async (req, res) => {
  const parseResult = BattleRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: `Invalid request: ${parseResult.error.issues.map((i) => i.message).join(", ")}`,
    });
  }

  const body = parseResult.data;

  try {
    const result = await executeBattle(body.question, 
      { provider: body.sideA.provider, model: body.sideA.model || '' },
      { provider: body.sideB.provider, model: body.sideB.model || '' }
    );
    res.json(result);
  } catch (error: any) {
    logger.error({ err: error, route: "/api/battle" }, "battle failed");
    res.status(500).json({
      success: false,
      error: error?.message || "Battle request failed.",
    });
  }
});

// ==============================
// File Upload & Parsing Endpoints
// ==============================

app.post("/api/upload", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ success: false, error: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    const parsedFiles = await Promise.all(
      files.map(async (file) => {
        const parsed = await parseFile(file);
        return {
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          ...parsed,
        };
      })
    );

    res.json({ success: true, files: parsedFiles });
  } catch (error: any) {
    logger.error({ err: error, route: "/api/upload" }, "upload failed");
    res.status(500).json({ success: false, error: error?.message || "Upload failed." });
  }
});

app.post("/api/parse-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const parsed = await parseFile(req.file);
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    logger.error({ err: error, route: "/api/parse-file" }, "parse-file failed");
    res.status(500).json({ success: false, error: error?.message || "File parsing failed." });
  }
});

// ==============================
// Legacy Gemini Endpoints (refactored to use executeChat)
// ==============================

// API: AI Browser Web Page Perception & Semantic Parser
app.post("/api/gemini/parse-page", async (req, res) => {
  const parseResult = ParsePageRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: `Invalid request: ${parseResult.error.issues.map((i) => i.message).join(", ")}`,
    });
  }

  const { url, goal, provider = "gemini", model } = parseResult.data;

  try {
    const systemInstruction = `You are the core perception engine of an AI-Dedicated Web Browser.
Your job is to analyze a given URL or query/topic, simulate or retrieve real web page content, and output a structured machine-readable JSON representation for an AI Agent to browse.

Output JSON must adhere to this schema:
{
  "title": "Page Title",
  "domain": "example.com",
  "summary": "2-3 sentence core summary of the page for instant AI comprehension",
  "markdownContent": "# Main Title\n\nStructured article/page content in clean markdown...",
  "rawTokenCount": 5400,
  "aiOptimizedTokenCount": 420,
  "loadTimeMs": 180,
  "interactiveElementsCount": 8,
  "extractedEntities": [
    {
      "id": "e-1",
      "category": "Key Fact" | "Price / Metric" | "Technical Term" | "Code / API" | "Date / Time" | "Person / Org",
      "text": "Extracted entity value or statement",
      "confidence": 95,
      "sourceNodeId": "a-1"
    }
  ],
  "domTree": [
    {
      "id": "a-1",
      "type": "heading" | "paragraph" | "link" | "button" | "input" | "table" | "card" | "list",
      "tag": "h1",
      "label": "Heading label or text",
      "content": "Full text or sub-content",
      "isActionable": false,
      "actionType": "click",
      "boundingBox": { "x": 10, "y": 5, "w": 80, "h": 8 },
      "tokenCount": 15,
      "relevanceScore": 95
    }
  ]
}
Ensure all IDs are unique (a-1, a-2, etc.). Provide 6 to 12 realistic DOM nodes.`;

    const userPrompt = `URL or Web Goal: "${url || "https://arxiv.org/abs/2608.01234"}"
Specific Agent Objective: "${goal || "Examine and parse page structure"}"`;

    const text = await executeChat({
      provider: provider || "gemini",
      model: model || "gemini-2.5-flash",
      messages: [{ role: "user", content: userPrompt }],
      systemInstruction,
      responseMimeType: "application/json",
    });

    const parsedData = JSON.parse(text || "{}");
    res.json({ success: true, data: parsedData, sources: [], provider });
  } catch (error: any) {
    logger.error({ err: error, route: "/api/gemini/parse-page" }, "parse-page failed");
    res.status(500).json({ success: false, error: error?.message || "Failed to parse page." });
  }
});

// API: Autonomous Agent Step Planner
app.post("/api/gemini/agent-step", async (req, res) => {
  const parseResult = AgentStepRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: `Invalid request: ${parseResult.error.issues.map((i) => i.message).join(", ")}`,
    });
  }

  const { goal, currentPageTitle, currentPageUrl, domTree, history, provider = "gemini", model } = parseResult.data;

  try {
    const systemInstruction = `You are an Autonomous AI Browser Agent executing web tasks inside an AI Browser.
Given the target goal, current page summary, and available DOM nodes, decide the single next best step for the agent to perform.

Return JSON in this format:
{
  "thought": "Deep reasoning behind the next action",
  "action": {
    "type": "navigate" | "click" | "input" | "extract" | "scroll" | "synthesize",
    "targetNodeId": "a-3",
    "targetDescription": "Clicking the 'Download PDF' link",
    "value": "Optional string value"
  },
  "resultSummary": "Anticipated result or newly discovered fact"
}`;

    const prompt = `Goal: "${goal}"
Current Page: "${currentPageTitle}" (${currentPageUrl})
DOM Nodes available: ${JSON.stringify(domTree || []).slice(0, 3000)}
Previous Steps Executed: ${JSON.stringify(history || [])}`;

    const text = await executeChat({
      provider: provider || "gemini",
      model: model || "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      systemInstruction,
      responseMimeType: "application/json",
    });

    const stepResult = JSON.parse(text || "{}");
    res.json({ success: true, step: stepResult, provider });
  } catch (error: any) {
    logger.error({ err: error, route: "/api/gemini/agent-step" }, "agent-step failed");
    res.status(500).json({ success: false, error: error?.message || "Failed to generate agent step." });
  }
});

// API: Synthesize Knowledge Report
app.post("/api/gemini/synthesize-knowledge", async (req, res) => {
  const parseResult = SynthesizeRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: `Invalid request: ${parseResult.error.issues.map((i) => i.message).join(", ")}`,
    });
  }

  const { taskGoal, pageDataList, exportFormat, provider = "gemini", model } = parseResult.data;

  try {
    const prompt = `Synthesize a comprehensive structured report based on web browsing session for goal: "${taskGoal}".
Export format requested: ${exportFormat || "markdown"}.
Pages analyzed: ${JSON.stringify(pageDataList || []).slice(0, 6000)}

Output a rich, thorough synthesis including Key Findings, Data Tables, Direct Links, Actionable Insights, and Entity Graph summaries.`;

    const text = await executeChat({
      provider: provider || "gemini",
      model: model || "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      systemInstruction: "You are an AI research analyst compiling data gathered from AI browser agent runs.",
    });

    res.json({ success: true, report: text, provider });
  } catch (error: any) {
    logger.error({ err: error, route: "/api/gemini/synthesize-knowledge" }, "synthesize-knowledge failed");
    res.status(500).json({ success: false, error: error?.message || "Synthesis failed." });
  }
});

// ==============================
// Download ZIP
// ==============================

app.get("/api/download-zip", async (_req, res) => {
  try {
    const zip = new JSZip();
    const rootDir = process.cwd();
    const ignoreList = ["node_modules", "dist", ".git", ".DS_Store"];

    const addFilesToZip = (dirPath: string, zipFolder: JSZip) => {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        if (ignoreList.includes(item)) continue;
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) addFilesToZip(fullPath, subFolder);
        } else if (stat.isFile()) {
          zipFolder.file(item, fs.readFileSync(fullPath));
        }
      }
    };

    addFilesToZip(rootDir, zip);
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="neural-ai-browser.zip"');
    res.send(zipBuffer);
  } catch (error: any) {
    logger.error({ err: error, route: "/api/download-zip" }, "zip generation failed");
    res.status(500).json({ success: false, error: "Failed to generate project ZIP archive." });
  }
});

// ==============================
// Pre-flight Checks
// ==============================

const configuredProviders = PROVIDER_DEFS.filter((def) => {
  const apiKey = process.env[def.envKey];
  return apiKey && !apiKey.startsWith(`YOUR_${def.envKey.replace("_API_KEY", "").toUpperCase()}_API_KEY`);
});

if (configuredProviders.length === 0) {
  console.warn("⚠️  No API keys configured. Please set at least one provider API key in .env");
  console.warn("   See .env.example for available providers.");
}

// ==============================
// Vite Dev / Production Static
// ==============================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    logger.info(`AI Browser Express Server listening on http://${HOST}:${PORT}`);
    logger.info(`Available providers: ${PROVIDER_DEFS.map((p) => p.name).join(", ") || "none (check .env)"}`);
  });
}

startServer();
