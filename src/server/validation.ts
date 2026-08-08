import { z } from "zod";

// ==============================
// Environment Validation
// ==============================

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("127.0.0.1"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  CORS_ORIGIN: z.string().default("*"),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(): Env {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"));
    console.error("\nPlease check your .env file against .env.example");
    process.exit(1);
  }
  return result.data;
}

// ==============================
// Request Validation Schemas
// ==============================

export const ChatRequestSchema = z.object({
  provider: z.string().min(1).max(50),
  model: z.string().min(1).max(100).optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().max(100000),
    })
  ).min(1).max(100),
  systemInstruction: z.string().max(50000).optional(),
  responseMimeType: z.string().max(50).optional(),
  temperature: z.number().min(0).max(2).optional(),
  tools: z.array(z.any()).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ParsePageRequestSchema = z.object({
  url: z.string().url().optional(),
  goal: z.string().max(5000).optional(),
  provider: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(100).optional(),
});

export type ParsePageRequest = z.infer<typeof ParsePageRequestSchema>;

export const AgentStepRequestSchema = z.object({
  goal: z.string().min(1).max(5000),
  currentPageTitle: z.string().max(500).optional(),
  currentPageUrl: z.string().url().max(2000).optional(),
  domTree: z.array(z.any()).optional(),
  history: z.array(z.any()).optional(),
  provider: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(100).optional(),
});

export type AgentStepRequest = z.infer<typeof AgentStepRequestSchema>;

export const SynthesizeRequestSchema = z.object({
  taskGoal: z.string().min(1).max(5000),
  pageDataList: z.array(z.any()).optional(),
  exportFormat: z.string().max(50).optional(),
  provider: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(100).optional(),
});

export type SynthesizeRequest = z.infer<typeof SynthesizeRequestSchema>;

export const BattleRequestSchema = z.object({
  question: z.string().min(1).max(10000),
  sideA: z.object({
    provider: z.string().min(1).max(50),
    model: z.string().min(1).max(100).optional(),
  }),
  sideB: z.object({
    provider: z.string().min(1).max(50),
    model: z.string().min(1).max(100).optional(),
  }),
});

export type BattleRequest = z.infer<typeof BattleRequestSchema>;
