import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { ProviderConfig } from "./providers";

// ==============================
// Chat Executor (replaces self-referential fetch)
// ==============================

export interface ExecuteChatOptions {
  provider: string;
  model?: string;
  messages: { role: string; content: string }[];
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
  tools?: any[];
}

const DEMO_MODE = process.env.DEMO_MODE === 'true';

const DEMO_RESPONSES: Record<string, string> = {
  gemini: "## Neural DOM Analysis Complete\n\n**Page Title**: GitHub Trending\n**Domain**: github.com\n**Summary**: This page aggregates the most popular repositories on GitHub, updated daily.\n\n### Extracted Entities\n- **Repository**: facebook/react — ⭐ 250k\n- **Repository**: vuejs/core — ⭐ 47k\n- **Repository**: sveltejs/svelte — ⭐ 82k\n\n### Key Findings\n1. React maintains dominance with 250k+ stars\n2. Svelte shows highest growth velocity (+15% MoM)\n3. AI-powered dev tools occupy 40% of trending slots",
  openai: "Based on the current GitHub Trending data:\n\n1. **React** continues to lead with 250k+ stars, though growth has plateaued.\n2. **Svelte** is the fastest-growing framework with a 15% month-over-month increase.\n3. **AI development tools** (like Cursor, Claude Code) now represent 40% of all trending repositories.\n\nConclusion: The ecosystem is shifting toward AI-augmented development workflows.",
  deepseek: "GitHub Trending 分析结果：\n\n**Top 3 趋势**\n1. AI 编程助手（Cursor、Claude Code）占据榜单 40%\n2. Rust 基础设施项目持续增长\n3. 国产开源项目（DeepSeek、Qwen）首次进入 Top 10\n\n**数据洞察**：过去 30 天，AI 相关项目的平均 star 增速是传统项目的 3.2 倍。",
  qwen: "综合 GitHub Trending 数据分析：\n\n- **AI 编程工具**：Cursor、Claude Code、Copilot 三分天下\n- **前端框架**：React 存量第一，Svelte 增速第一，Vue 稳步增长\n- **新兴语言**：Mojo 连续 7 天出现在榜单中\n\n建议关注：AI-native development tools 赛道。",
  glm: "GitHub Trending 趋势报告：\n\n## 核心发现\n1. **AI 辅助编程**成为今年最热赛道\n2. **Rust**在系统级工具开发中占比提升\n3. **国产开源项目**国际影响力显著增强\n\n## 数据支撑\n- AI 项目平均 star 增速：+28%\n- 传统项目平均 star 增速：+4%",
  kimi: "GitHub Trending 深度洞察：\n\n**现象一：AI 编程工具爆发**\n- Cursor、Claude Code、GitHub Copilot 包揽前三\n- 这些工具的共同点：支持多模型、本地代码理解、终端集成\n\n**现象二：长文本能力成为标配**\n- 200k+ context window 的项目占比从 5% 升至 35%",
  yi: "GitHub Trending 快照分析：\n\n| 排名 | 项目 | 语言 | Stars | 增长 |\n|------|------|------|-------|------|\n| 1 | facebook/react | TypeScript | 250k | +2% |\n| 2 | sveltejs/svelte | TypeScript | 82k | +15% |\n| 3 | vuejs/core | TypeScript | 47k | +5% |\n\n**关键洞察**：Svelte 的增长率是 React 的 7.5 倍。",
  baichuan: "GitHub Trending 周报：\n\n**热点一：AI 编程助手**\n- Cursor 编辑器连续 3 周霸榜\n- 核心差异化：AI 原生工作流 + 多模态理解\n\n**热点二：国产开源出海**\n- DeepSeek、Qwen、GLM 同时进入 Top 20\n- 说明国产 AI 基础设施获全球认可",
  minimax: "GitHub Trending 全景分析：\n\n## 市场格局\n1. **AI 编程工具**：Cursor 领跑，Claude Code 追赶\n2. **前端框架**：React 存量市场，Svelte 增量市场\n3. **AI 基础设施**：模型推理、向量数据库、RAG 框架热度不减\n\n## 建议\n关注 AI-native 工具链的投资机会。",
};

function getDemoResponse(provider: string, userMessage: string): string {
  const base = DEMO_RESPONSES[provider] || DEMO_RESPONSES['openai'];
  if (userMessage.toLowerCase().includes('battle') || userMessage.toLowerCase().includes('对比')) {
    return `## Multi-Model Battle Result\n\n**Question**: ${userMessage.slice(0, 100)}\n\n| Model | Response Time | Quality Score |\n|-------|--------------|---------------|\n| Gemini 2.0 Flash | 1.2s | 9.2/10 |\n| DeepSeek V3 | 0.8s | 9.0/10 |\n| Qwen Turbo | 1.5s | 8.7/10 |\n\n**Winner**: DeepSeek V3 (fastest + highest quality)`;
  }
  if (userMessage.toLowerCase().includes('synthesize') || userMessage.toLowerCase().includes('总结')) {
    return `## Synthesis Report\n\n**Goal**: ${userMessage.slice(0, 100)}\n\n### Key Findings\n- **Pages Analyzed**: 3 URLs\n- **Entities Extracted**: 12\n- **Token Savings**: 78% (from 15,000 to 3,300)\n\n### Actionable Insights\n1. React still dominates but growth is slowing\n2. Svelte is the fastest-growing framework\n3. AI tools represent 40% of all trending projects\n\n### Direct Links\n- [facebook/react](https://github.com/facebook/react)\n- [sveltejs/svelte](https://github.com/sveltejs/svelte)\n- [vuejs/core](https://github.com/vuejs/core)`;
  }
  return base;
}

export async function executeChat(opts: ExecuteChatOptions): Promise<string> {
  if (DEMO_MODE) {
    const userMessage = opts.messages.find(m => m.role === 'user')?.content || '';
    return getDemoResponse(opts.provider, userMessage);
  }

  const provider = getProviderOrThrow(opts.provider);
  const selectedModel = opts.model || provider.defaultModel;
  const client = provider.makeClient(provider.apiKey!, provider.baseURL);

  if (provider.id === "gemini") {
    return executeGemini(client as GoogleGenAI, selectedModel, opts);
  }

  return executeOpenAICompat(client as OpenAI, selectedModel, opts);
}

export async function* executeChatStream(
  opts: ExecuteChatOptions
): AsyncGenerator<string> {
  if (DEMO_MODE) {
    const fullText = getDemoResponse(opts.provider, opts.messages.find(m => m.role === 'user')?.content || '');
    const words = fullText.split(/(?=\s)/g);
    for (const word of words) {
      yield word;
      await new Promise(r => setTimeout(r, 30 + Math.random() * 50));
    }
    return;
  }

  const provider = getProviderOrThrow(opts.provider);
  const selectedModel = opts.model || provider.defaultModel;
  const client = provider.makeClient(provider.apiKey!, provider.baseURL);

  if (provider.id === "gemini") {
    yield* executeGeminiStream(client as GoogleGenAI, selectedModel, opts);
    return;
  }

  yield* executeOpenAICompatStream(client as OpenAI, selectedModel, opts);
}

function getProviderOrThrow(providerId: string): ProviderConfig {
  const provider = buildProviders().find((p) => p.id === providerId);
  if (!provider) {
    const available = buildProviders().map((p) => p.id).join(", ") || "none";
    throw new Error(`Unknown provider: ${providerId}. Available: ${available}`);
  }
  if (!provider.apiKey) {
    throw new Error(`API key not configured for ${provider.name}.`);
  }
  return provider;
}

async function executeGemini(
  ai: GoogleGenAI,
  model: string,
  opts: ExecuteChatOptions
): Promise<string> {
  const contents = opts.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const genConfig: any = {};
  if (opts.systemInstruction) genConfig.systemInstruction = opts.systemInstruction;
  if (opts.responseMimeType) genConfig.responseMimeType = opts.responseMimeType;
  if (opts.temperature !== undefined) genConfig.temperature = opts.temperature;
  if (opts.tools?.length) genConfig.tools = opts.tools;

  const response = await ai.models.generateContent({
    model,
    contents,
    config: genConfig,
  });

  return response.text || "";
}

async function* executeGeminiStream(
  ai: GoogleGenAI,
  model: string,
  opts: ExecuteChatOptions
): AsyncGenerator<string> {
  const contents = opts.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const genConfig: any = {};
  if (opts.systemInstruction) genConfig.systemInstruction = opts.systemInstruction;
  if (opts.responseMimeType) genConfig.responseMimeType = opts.responseMimeType;
  if (opts.temperature !== undefined) genConfig.temperature = opts.temperature;
  if (opts.tools?.length) genConfig.tools = opts.tools;

  try {
    const stream = await ai.models.generateContentStream({
      model,
      contents,
      config: genConfig,
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Gemini stream error:", error);
    throw error;
  }
}

async function executeOpenAICompat(
  client: OpenAI,
  model: string,
  opts: ExecuteChatOptions
): Promise<string> {
  const messages: any[] = [];

  if (opts.systemInstruction) {
    messages.push({ role: "system", content: opts.systemInstruction });
  }

  for (const m of opts.messages) {
    if (m.role === "user" || m.role === "assistant") {
      messages.push({ role: m.role, content: m.content });
    } else if (m.role === "system" && !opts.systemInstruction) {
      messages.push({ role: "system", content: m.content });
    }
  }

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: opts.temperature ?? 0.7,
    ...(opts.responseMimeType === "application/json"
      ? { response_format: { type: "json_object" } }
      : {}),
  });

  return response.choices[0]?.message?.content || "";
}

async function* executeOpenAICompatStream(
  client: OpenAI,
  model: string,
  opts: ExecuteChatOptions
): AsyncGenerator<string> {
  const messages: any[] = [];

  if (opts.systemInstruction) {
    messages.push({ role: "system", content: opts.systemInstruction });
  }

  for (const m of opts.messages) {
    if (m.role === "user" || m.role === "assistant") {
      messages.push({ role: m.role, content: m.content });
    } else if (m.role === "system" && !opts.systemInstruction) {
      messages.push({ role: "system", content: m.content });
    }
  }

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: opts.temperature ?? 0.7,
      stream: true,
      ...(opts.responseMimeType === "application/json"
        ? { response_format: { type: "json_object" } }
        : {}),
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  } catch (error) {
    console.error("OpenAI stream error:", error);
    throw error;
  }
}

// Import here to avoid circular dependency
import { buildProviders } from "./providers";
