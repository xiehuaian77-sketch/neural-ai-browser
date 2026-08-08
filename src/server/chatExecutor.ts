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

export async function executeChat(opts: ExecuteChatOptions): Promise<string> {
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
