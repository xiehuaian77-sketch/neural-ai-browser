export interface ModelInfo {
  id: string;
  name: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  defaultModel: string;
  models: ModelInfo[];
}

export type ViewMode = 'visual' | 'neural' | 'split' | 'battle' | 'chain';

export type AgentStatus = 'idle' | 'analyzing' | 'navigating' | 'extracting' | 'executing' | 'synthesizing' | 'completed' | 'error';

export interface DOMNode {
  id: string;
  type: 'heading' | 'paragraph' | 'link' | 'button' | 'input' | 'table' | 'card' | 'image' | 'list' | 'container';
  tag: string;
  label: string;
  content: string;
  attributes?: Record<string, string>;
  children?: DOMNode[];
  isActionable?: boolean;
  actionType?: 'click' | 'input' | 'scroll' | 'select' | 'extract';
  boundingBox?: {
    x: number; // percentage
    y: number; // percentage
    w: number;
    h: number;
  };
  tokenCount?: number;
  relevanceScore?: number; // 0 - 100
}

export interface ExtractedEntity {
  id: string;
  category: 'Key Fact' | 'Price / Metric' | 'Technical Term' | 'Code / API' | 'Date / Time' | 'Person / Org';
  text: string;
  confidence: number;
  sourceNodeId?: string;
}

export interface AgentStep {
  stepNumber: number;
  timestamp: string;
  thought: string;
  action: {
    type: 'navigate' | 'click' | 'input' | 'extract' | 'scroll' | 'synthesize';
    targetNodeId?: string;
    targetDescription?: string;
    value?: string;
  };
  status: 'pending' | 'active' | 'done' | 'failed';
  resultSummary?: string;
}

export interface WebPageData {
  url: string;
  title: string;
  domain: string;
  favicon?: string;
  rawContentHtml?: string;
  summary: string;
  markdownContent: string;
  domTree: DOMNode[];
  extractedEntities: ExtractedEntity[];
  rawTokenCount: number;
  aiOptimizedTokenCount: number;
  loadTimeMs: number;
  interactiveElementsCount: number;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  isLoading: boolean;
  pageData: WebPageData;
  agentTask?: string;
  agentStatus: AgentStatus;
  currentStepIndex: number;
  steps: AgentStep[];
}

export interface KnowledgeItem {
  id: string;
  timestamp: string;
  sourceUrl: string;
  sourceTitle: string;
  topic: string;
  contentMarkdown: string;
  entities: ExtractedEntity[];
  tags: string[];
}

export interface SwarmTask {
  id: string;
  targetUrl: string;
  taskGoal: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  assignedAgentName: string;
  progress: number;
  resultSummary?: string;
}

// ==============================
// Battle Mode Types
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
  winner?: 'A' | 'B' | 'tie';
  totalLatencyMs: number;
}

export interface BattleRequest {
  question: string;
  sideA: {
    provider: string;
    model?: string;
  };
  sideB: {
    provider: string;
    model?: string;
  };
}

export interface BattleVote {
  side: 'A' | 'B' | 'tie';
  timestamp: string;
}
