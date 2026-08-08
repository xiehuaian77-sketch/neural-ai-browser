import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// ==============================
// Provider Definition (Single Source of Truth)
// ==============================

export interface ProviderDefinition {
  id: string;
  name: string;
  envKey: string;
  defaultModel: string;
  models: { id: string; name: string }[];
  makeClient: (apiKey: string, baseURL?: string) => GoogleGenAI | OpenAI;
  getDefaultBaseURL: () => string | undefined;
}

export const PROVIDER_DEFS: ProviderDefinition[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    envKey: "GEMINI_API_KEY",
    defaultModel: "gemini-2.5-flash",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
    ],
    makeClient: (key: string) => new GoogleGenAI({ apiKey: key }),
    getDefaultBaseURL: () => undefined,
  },
  {
    id: "openai",
    name: "OpenAI",
    envKey: "OPENAI_API_KEY",
    defaultModel: "gpt-4o",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
      { id: "o1", name: "o1" },
      { id: "o1-mini", name: "o1 Mini" },
      { id: "o3", name: "o3" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://api.openai.com/v1" }),
    getDefaultBaseURL: () => "https://api.openai.com/v1",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    envKey: "DEEPSEEK_API_KEY",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat" },
      { id: "deepseek-reasoner", name: "DeepSeek R1 (Reasoner)" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://api.deepseek.com/v1" }),
    getDefaultBaseURL: () => "https://api.deepseek.com/v1",
  },
  {
    id: "qwen",
    name: "阿里云 Qwen",
    envKey: "QWEN_API_KEY",
    defaultModel: "qwen-plus",
    models: [
      { id: "qwen-turbo", name: "Qwen Turbo" },
      { id: "qwen-plus", name: "Qwen Plus" },
      { id: "qwen-max", name: "Qwen Max" },
      { id: "qwen-coder-plus", name: "Qwen Coder Plus" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://dashscope.aliyuncs.com/compatible-mode/v1" }),
    getDefaultBaseURL: () => "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  {
    id: "glm",
    name: "智谱 AI (GLM)",
    envKey: "GLM_API_KEY",
    defaultModel: "glm-4-plus",
    models: [
      { id: "glm-4-plus", name: "GLM-4 Plus" },
      { id: "glm-4-flash", name: "GLM-4 Flash" },
      { id: "glm-4v-plus", name: "GLM-4V Plus (多模态)" },
      { id: "glm-4-long", name: "GLM-4 Long" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://open.bigmodel.cn/api/paas/v4" }),
    getDefaultBaseURL: () => "https://open.bigmodel.cn/api/paas/v4",
  },
  {
    id: "moonshot",
    name: "月之暗面 (Kimi)",
    envKey: "MOONSHOT_API_KEY",
    defaultModel: "moonshot-v1-8k",
    models: [
      { id: "moonshot-v1-8k", name: "Kimi 8K" },
      { id: "moonshot-v1-32k", name: "Kimi 32K" },
      { id: "moonshot-v1-128k", name: "Kimi 128K" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://api.moonshot.cn/v1" }),
    getDefaultBaseURL: () => "https://api.moonshot.cn/v1",
  },
  {
    id: "yi",
    name: "零一万物 (Yi)",
    envKey: "YI_API_KEY",
    defaultModel: "yi-lightning",
    models: [
      { id: "yi-lightning", name: "Yi Lightning" },
      { id: "yi-medium", name: "Yi Medium" },
      { id: "yi-large", name: "Yi Large" },
      { id: "yi-vision", name: "Yi Vision" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://api.lingyiwanwu.com/v1" }),
    getDefaultBaseURL: () => "https://api.lingyiwanwu.com/v1",
  },
  {
    id: "baichuan",
    name: "百川智能",
    envKey: "BAICHUAN_API_KEY",
    defaultModel: "Baichuan2-Turbo",
    models: [
      { id: "Baichuan2-Turbo", name: "Baichuan 2 Turbo" },
      { id: "Baichuan2-Turbo-192k", name: "Baichuan 2 Turbo 192K" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://api.baichuan-ai.com/v1" }),
    getDefaultBaseURL: () => "https://api.baichuan-ai.com/v1",
  },
  {
    id: "minimax",
    name: "MiniMax",
    envKey: "MINIMAX_API_KEY",
    defaultModel: "minimax/MiniMax-M1-80k",
    models: [
      { id: "minimax/MiniMax-M1-80k", name: "MiniMax M1 80K" },
      { id: "minimax/MiniMax-M1-40k", name: "MiniMax M1 40K" },
    ],
    makeClient: (key: string, baseURL?: string) =>
      new OpenAI({ apiKey: key, baseURL: baseURL || "https://api.minimax.chat/v1" }),
    getDefaultBaseURL: () => "https://api.minimax.chat/v1",
  },
];

// ==============================
// Runtime Provider Config
// ==============================

export interface ProviderConfig {
  id: string;
  name: string;
  apiKey?: string;
  baseURL?: string;
  makeClient: (apiKey: string, baseURL?: string) => GoogleGenAI | OpenAI;
  defaultModel: string;
  models: { id: string; name: string }[];
}

export function buildProviders(): ProviderConfig[] {
  return PROVIDER_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    apiKey: process.env[def.envKey],
    baseURL: process.env[`${def.id.toUpperCase()}_BASE_URL`] || def.getDefaultBaseURL(),
    makeClient: def.makeClient,
    defaultModel: def.defaultModel,
    models: def.models,
  })).filter((p) => p.apiKey && !p.apiKey.startsWith(`YOUR_${p.id.toUpperCase()}_API_KEY`));
}

export function getProvider(providerId: string): ProviderConfig | undefined {
  const providers = buildProviders();
  return providers.find((p) => p.id === providerId);
}

export function getConfiguredProviders(): ProviderConfig[] {
  return buildProviders();
}

// UI-friendly list (includes unconfigured providers so the dropdown can show them)
export function getAllProvidersForUI() {
  return PROVIDER_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    defaultModel: def.defaultModel,
    models: def.models,
    configured: !!(
      process.env[def.envKey] &&
      !process.env[def.envKey]!.startsWith(`YOUR_${def.id.toUpperCase()}_API_KEY`)
    ),
  }));
}
