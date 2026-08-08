import { executeChat } from "./chatExecutor";

// ==============================
// Battle Mode: Parallel Dual-Model Execution
// ==============================

export interface BattleSide {
  provider: string;
  model: string;
  providerName: string;
  modelName: string;
  text: string;
  latencyMs: number;
  error?: string;
}

export interface BattleResponse {
  success: boolean;
  question: string;
  sideA: BattleSide;
  sideB: BattleSide;
  winner?: "A" | "B" | "tie";
  totalLatencyMs: number;
}

const DEMO_MODE = process.env.DEMO_MODE === "true";

const DEMO_BATTLE_RESPONSES: Record<string, { a: string; b: string }> = {
  default: {
    a: "## Analysis from Model A\n\n**Key Points**:\n1. The most critical factor is user experience design\n2. Performance optimization should prioritize core user journeys\n3. Community-driven development accelerates innovation\n\n**Recommendation**: Focus on the 80/20 principle — optimize the 20% of features that drive 80% of user satisfaction.",
    b: "## Analysis from Model B\n\n**Key Points**:\n1. Technical debt accumulates faster than feature velocity\n2. Automated testing coverage below 80% is a risk\n3. Documentation lag is the #1 contributor to onboarding friction\n\n**Recommendation**: Invest in developer experience tooling and CI/CD pipelines before expanding the feature set.",
  },
};

function getDemoBattleResponse(question: string): { a: string; b: string } {
  const q = question.toLowerCase();
  if (q.includes("react") || q.includes("前端") || q.includes("frontend")) {
    return {
      a: "## Frontend Architecture Analysis\n\n**Current State**: React maintains 40% market share with Svelte/Vue gaining in specific niches.\n\n**Key Trends**:\n1. Server Components reduce bundle size by 30-50%\n2. TypeScript adoption is now a baseline expectation\n3. AI-assisted coding (Cursor, Copilot) shifts focus from syntax to architecture\n\n**Recommendation**: For new projects, prioritize React Server Components + TypeScript + Vite.",
      b: "## Frontend Architecture Analysis\n\n**Current State**: The framework wars are stabilizing — React for enterprise, Svelte for performance-critical apps, Vue for rapid prototyping.\n\n**Key Trends**:\n1. Islands Architecture (Astro) is redefining content sites\n2. Edge rendering (Vercel Edge Functions) is becoming standard\n3. Web Components are resurging for design system portability\n\n**Recommendation**: Choose based on team expertise, not hype. All three are production-ready.",
    };
  }
  if (q.includes("ai") || q.includes("模型") || q.includes("model")) {
    return {
      a: "## AI Model Landscape 2026\n\n**Frontier Models**: GPT-5, Claude 4, Gemini 3 are converging on similar capabilities.\n\n**Differentiators**:\n1. Context window: 1M+ tokens is now table stakes\n2. Reasoning: Chain-of-thought is being replaced by system-2 thinking\n3. Multimodality: Native image/audio/video is expected\n\n**Recommendation**: Use a multi-model strategy. No single provider wins on all dimensions.",
      b: "## AI Model Landscape 2026\n\n**Frontier Models**: Open-source (DeepSeek, Qwen, Llama) has closed 90% of the gap with proprietary models.\n\n**Differentiators**:\n1. Cost: Open-source is 10-50x cheaper for equivalent quality\n2. Privacy: Local deployment is now feasible for enterprise\n3. Customization: Fine-tuning on domain data provides competitive advantage\n\n**Recommendation**: Start with open-source, upgrade to proprietary only for edge cases.",
    };
  }
  return DEMO_BATTLE_RESPONSES.default;
}

export async function executeBattle(
  question: string,
  sideA: { provider: string; model: string },
  sideB: { provider: string; model: string }
): Promise<BattleResponse> {
  const startTime = Date.now();

  if (DEMO_MODE) {
    const demoResponses = getDemoBattleResponse(question);
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    const providerNameA = sideA.provider || "Model A";
    const providerNameB = sideB.provider || "Model B";

    return {
      success: true,
      question,
      sideA: {
        provider: sideA.provider,
        model: sideA.model,
        providerName: providerNameA,
        modelName: sideA.model,
        text: demoResponses.a,
        latencyMs: 600 + Math.floor(Math.random() * 400),
      },
      sideB: {
        provider: sideB.provider,
        model: sideB.model,
        providerName: providerNameB,
        modelName: sideB.model,
        text: demoResponses.b,
        latencyMs: 700 + Math.floor(Math.random() * 500),
      },
      winner: "tie",
      totalLatencyMs: Date.now() - startTime,
    };
  }

  // Run both sides in parallel
  const [resultA, resultB] = await Promise.allSettled([
    executeChat({
      provider: sideA.provider,
      model: sideA.model,
      messages: [{ role: "user", content: question }],
    }),
    executeChat({
      provider: sideB.provider,
      model: sideB.model,
      messages: [{ role: "user", content: question }],
    }),
  ]);

  const buildSide = (
    result: PromiseFulfilledResult<string> | PromiseRejectedResult,
    side: { provider: string; model: string }
  ): BattleSide => {
    if (result.status === "fulfilled") {
      return {
        provider: side.provider,
        model: side.model,
        providerName: side.provider,
        modelName: side.model,
        text: result.value,
        latencyMs: 0, // Will be calculated by caller if needed
      };
    }
    return {
      provider: side.provider,
      model: side.model,
      providerName: side.provider,
      modelName: side.model,
      text: "",
      latencyMs: 0,
      error: result.reason?.message || "Request failed",
    };
  };

  const builtA = buildSide(resultA, sideA);
  const builtB = buildSide(resultB, sideB);

  return {
    success: true,
    question,
    sideA: builtA,
    sideB: builtB,
    totalLatencyMs: Date.now() - startTime,
  };
}
