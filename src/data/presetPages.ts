import { WebPageData } from '../types';

export const PRESET_PAGES: Record<string, WebPageData> = {
  'https://arxiv.org/abs/2608.01234': {
    url: 'https://arxiv.org/abs/2608.01234',
    title: 'Autonomous Multimodal AI Agents in Web Browsing & DOM Reasoning',
    domain: 'arxiv.org',
    favicon: '📄',
    summary: 'A 2026 foundational paper introducing Agentic Vision Transformer (AVT-3) architecture that parses raw HTML DOM into zero-redundancy semantic graphs, achieving 98.4% web task completion with 85% reduced token consumption.',
    markdownContent: `
# Autonomous Multimodal AI Agents in Web Browsing & DOM Reasoning

**Authors**: Dr. Elena Vance, Prof. Marcus Sterling, Neural AI Research Group  
**Published**: August 2026 | **Categories**: cs.AI, cs.HC, cs.CL  

## Abstract
Traditional web browsers present DOM trees designed for visual human layout engines. We propose **Neural DOM Protocol (NDP)**, an AI-native browser rendering paradigm that strips visual layout overhead and converts web DOM into actionable agent graphs. Our evaluation across 5,000 real-world web tasks demonstrates a 12x speedup in agent interaction and 85% token reduction.

## Key Breakthroughs
1. **Semantic Node Pruning**: Removes 94% of styling div wrappers and advertisement noise.
2. **Action Hotspot Tagging**: Direct node binding for \`click()\`, \`input()\`, and \`extract()\`.
3. **Cross-Tab Parallel Swarm Execution**: Enables asynchronous multi-agent crawling with zero DOM locking.

## Performance Metrics Table
| Metric | Standard Chrome + LLM | Neural AI Browser | Improvement |
| :--- | :--- | :--- | :--- |
| Token Usage / Page | 18,400 tokens | 1,250 tokens | **93.2% Reduction** |
| Task Completion Time | 14.2 seconds | 1.8 seconds | **7.8x Faster** |
| Form Filling Accuracy | 81.5% | 99.1% | **+17.6%** |

## Interactive Agent Node Map
- [Action #a-1] **Download Full PDF (2.4MB)**
- [Action #a-2] **Extract Citation Data (BibTeX)**
- [Action #a-3] **Run Autonomous Synthesis Agent**
- [Action #a-4] **Input Query in Related Papers Search**
    `,
    rawTokenCount: 18400,
    aiOptimizedTokenCount: 1250,
    loadTimeMs: 120,
    interactiveElementsCount: 6,
    extractedEntities: [
      { id: 'e-1', category: 'Technical Term', text: 'Neural DOM Protocol (NDP)', confidence: 99, sourceNodeId: 'a-101' },
      { id: 'e-2', category: 'Price / Metric', text: '85% Token Reduction', confidence: 98, sourceNodeId: 'a-102' },
      { id: 'e-3', category: 'Price / Metric', text: '1.8s Task Completion Time', confidence: 96, sourceNodeId: 'a-103' },
      { id: 'e-4', category: 'Key Fact', text: '98.4% Web Task Completion Rate', confidence: 97, sourceNodeId: 'a-104' },
      { id: 'e-5', category: 'Person / Org', text: 'Dr. Elena Vance (Neural AI Research)', confidence: 95, sourceNodeId: 'a-105' },
    ],
    domTree: [
      {
        id: 'a-1',
        type: 'heading',
        tag: 'h1',
        label: 'Paper Title',
        content: 'Autonomous Multimodal AI Agents in Web Browsing & DOM Reasoning',
        isActionable: false,
        boundingBox: { x: 5, y: 4, w: 90, h: 8 },
        tokenCount: 12,
        relevanceScore: 100,
      },
      {
        id: 'a-2',
        type: 'container',
        tag: 'div.meta',
        label: 'Metadata Block',
        content: 'Authors: Dr. Elena Vance, Prof. Marcus Sterling | August 2026',
        isActionable: false,
        boundingBox: { x: 5, y: 13, w: 90, h: 6 },
        tokenCount: 18,
        relevanceScore: 80,
      },
      {
        id: 'a-3',
        type: 'button',
        tag: 'button#download-pdf',
        label: 'Download Full PDF (2.4MB)',
        content: 'Download PDF',
        isActionable: true,
        actionType: 'click',
        boundingBox: { x: 5, y: 20, w: 28, h: 6 },
        tokenCount: 5,
        relevanceScore: 95,
      },
      {
        id: 'a-4',
        type: 'button',
        tag: 'button#cite-bibtex',
        label: 'Export BibTeX Citation',
        content: 'BibTeX',
        isActionable: true,
        actionType: 'extract',
        boundingBox: { x: 35, y: 20, w: 25, h: 6 },
        tokenCount: 4,
        relevanceScore: 85,
      },
      {
        id: 'a-5',
        type: 'input',
        tag: 'input#paper-search',
        label: 'Search Related Literature',
        content: 'Enter keyword or topic...',
        isActionable: true,
        actionType: 'input',
        boundingBox: { x: 62, y: 20, w: 33, h: 6 },
        tokenCount: 6,
        relevanceScore: 70,
      },
      {
        id: 'a-6',
        type: 'paragraph',
        tag: 'p.abstract',
        label: 'Abstract Content',
        content: 'We propose Neural DOM Protocol (NDP), an AI-native browser rendering paradigm...',
        isActionable: false,
        boundingBox: { x: 5, y: 28, w: 90, h: 18 },
        tokenCount: 65,
        relevanceScore: 98,
      },
      {
        id: 'a-7',
        type: 'table',
        tag: 'table.metrics',
        label: 'Performance Benchmark Table',
        content: 'Token Usage: 18.4k -> 1.25k (-93.2%). Time: 14.2s -> 1.8s. Accuracy: 81.5% -> 99.1%',
        isActionable: true,
        actionType: 'extract',
        boundingBox: { x: 5, y: 48, w: 90, h: 28 },
        tokenCount: 88,
        relevanceScore: 99,
      },
      {
        id: 'a-8',
        type: 'button',
        tag: 'button#run-synthesis',
        label: 'Synthesize & Add to Knowledge Graph',
        content: 'Add to Knowledge Graph',
        isActionable: true,
        actionType: 'click',
        boundingBox: { x: 5, y: 78, w: 40, h: 8 },
        tokenCount: 8,
        relevanceScore: 92,
      },
    ],
  },

  'https://cloud-pricing.ai/gpu-matrix': {
    url: 'https://cloud-pricing.ai/gpu-matrix',
    title: 'Global AI Cloud GPU Compute Index & Live Spot Rates 2026',
    domain: 'cloud-pricing.ai',
    favicon: '⚡',
    summary: 'Live real-time AI hardware pricing database monitoring NVIDIA B200, H200, H100, and Google TPU v6e availability across top cloud providers.',
    markdownContent: `
# Global AI Cloud GPU Compute Index (August 2026)

Updated real-time every 60 seconds via automated API telemetry.

## Live Rate Comparison
- **NVIDIA B200 SXM 192GB**: $3.85 / hr (On-Demand) | $1.92 / hr (Spot) | Provider: AWS & Azure
- **NVIDIA H200 SXM 141GB**: $2.90 / hr (On-Demand) | $1.45 / hr (Spot) | Provider: Lambda & CoreWeave
- **Google TPU v6e (Trillium)**: $2.10 / hr (On-Demand) | $0.98 / hr (Spot) | Provider: Google Cloud Platform
- **NVIDIA H100 80GB SXM5**: $1.95 / hr (On-Demand) | $0.85 / hr (Spot) | Provider: RunPod & GCP

## Action Nodes
- [Node #b-1] Filter by Region: [US-East, EU-Central, Asia-East]
- [Node #b-2] Filter by VRAM: [>80GB, >141GB, >192GB]
- [Node #b-3] Execute Automated Spot Instance Reservation
    `,
    rawTokenCount: 14200,
    aiOptimizedTokenCount: 890,
    loadTimeMs: 95,
    interactiveElementsCount: 5,
    extractedEntities: [
      { id: 'e-10', category: 'Price / Metric', text: 'B200 SXM: $3.85/hr', confidence: 99, sourceNodeId: 'b-101' },
      { id: 'e-11', category: 'Price / Metric', text: 'TPU v6e Spot: $0.98/hr', confidence: 99, sourceNodeId: 'b-102' },
      { id: 'e-12', category: 'Technical Term', text: 'Google TPU v6e (Trillium)', confidence: 97, sourceNodeId: 'b-103' },
      { id: 'e-13', category: 'Technical Term', text: 'NVIDIA B200 SXM 192GB', confidence: 98, sourceNodeId: 'b-104' },
    ],
    domTree: [
      {
        id: 'b-1',
        type: 'heading',
        tag: 'h1',
        label: 'Compute Index Header',
        content: 'Global AI Cloud GPU Compute Index',
        isActionable: false,
        boundingBox: { x: 5, y: 5, w: 90, h: 8 },
        tokenCount: 8,
        relevanceScore: 100,
      },
      {
        id: 'b-2',
        type: 'input',
        tag: 'select#region-filter',
        label: 'Select Cloud Region',
        content: 'US-East (N. Virginia)',
        isActionable: true,
        actionType: 'select',
        boundingBox: { x: 5, y: 15, w: 30, h: 6 },
        tokenCount: 6,
        relevanceScore: 85,
      },
      {
        id: 'b-3',
        type: 'input',
        tag: 'select#vram-filter',
        label: 'Select Minimum VRAM',
        content: '141GB+',
        isActionable: true,
        actionType: 'select',
        boundingBox: { x: 38, y: 15, w: 30, h: 6 },
        tokenCount: 5,
        relevanceScore: 85,
      },
      {
        id: 'b-4',
        type: 'table',
        tag: 'table#gpu-rates',
        label: 'Live Pricing Data Matrix',
        content: 'B200: $3.85/hr, H200: $2.90/hr, TPU v6e: $2.10/hr, H100: $1.95/hr',
        isActionable: true,
        actionType: 'extract',
        boundingBox: { x: 5, y: 24, w: 90, h: 50 },
        tokenCount: 110,
        relevanceScore: 99,
      },
      {
        id: 'b-5',
        type: 'button',
        tag: 'button#reserve-best-spot',
        label: 'Reserve Lowest Spot Rate Automatically',
        content: 'Book Lowest Rate',
        isActionable: true,
        actionType: 'click',
        boundingBox: { x: 5, y: 78, w: 45, h: 8 },
        tokenCount: 7,
        relevanceScore: 94,
      },
    ],
  },

  'https://docs.agentic-web.dev/api/v2': {
    url: 'https://docs.agentic-web.dev/api/v2',
    title: 'Agentic Web Engine API v2 Specification & Interactive Sandbox',
    domain: 'agentic-web.dev',
    favicon: '⚙️',
    summary: 'Developer reference for building AI agents that programmatically orchestrate headless browser sessions with DOM semantic tagging, OCR fallback, and structured schema extraction.',
    markdownContent: `
# Agentic Web Engine API v2

## Endpoints

### 1. \`POST /v2/browser/session/create\`
Initializes a new isolated AI browser session instance.

**Parameters**:
- \`headless\`: boolean (default: true)
- \`viewport\`: { width: 1920, height: 1080 }
- \`userAgent\`: "AIBrowserEngine/2.0 (+https://ai.studio/build)"
- \`proxyRegion\`: "us-west" | "eu-central"

### 2. \`POST /v2/browser/parse\`
Converts raw DOM into a structured Semantic Tree with unique Node Action IDs.

\`\`\`json
{
  "session_id": "sess_89f2a01",
  "url": "https://example.com",
  "extract_entities": true,
  "prune_styles": true
}
\`\`\`

### 3. \`POST /v2/browser/act\`
Triggers an agent action on a designated target Node ID.
    `,
    rawTokenCount: 12500,
    aiOptimizedTokenCount: 940,
    loadTimeMs: 110,
    interactiveElementsCount: 4,
    extractedEntities: [
      { id: 'e-20', category: 'Code / API', text: 'POST /v2/browser/session/create', confidence: 99, sourceNodeId: 'c-1' },
      { id: 'e-21', category: 'Code / API', text: 'POST /v2/browser/parse', confidence: 99, sourceNodeId: 'c-2' },
      { id: 'e-22', category: 'Technical Term', text: 'Semantic Tree Pruning', confidence: 95, sourceNodeId: 'c-3' },
    ],
    domTree: [
      {
        id: 'c-1',
        type: 'heading',
        tag: 'h1',
        label: 'API Documentation Header',
        content: 'Agentic Web Engine API v2 Specification',
        isActionable: false,
        boundingBox: { x: 5, y: 5, w: 90, h: 8 },
        tokenCount: 9,
        relevanceScore: 100,
      },
      {
        id: 'c-2',
        type: 'card',
        tag: 'div.endpoint-card',
        label: 'POST /v2/browser/session/create',
        content: 'Initializes isolated browser session with custom proxy and agent viewport',
        isActionable: true,
        actionType: 'extract',
        boundingBox: { x: 5, y: 16, w: 90, h: 22 },
        tokenCount: 45,
        relevanceScore: 92,
      },
      {
        id: 'c-3',
        type: 'card',
        tag: 'div.endpoint-card',
        label: 'POST /v2/browser/parse',
        content: 'Converts raw DOM into zero-redundancy semantic tree with node action handles',
        isActionable: true,
        actionType: 'extract',
        boundingBox: { x: 5, y: 41, w: 90, h: 22 },
        tokenCount: 40,
        relevanceScore: 95,
      },
      {
        id: 'c-4',
        type: 'button',
        tag: 'button#test-in-sandbox',
        label: 'Run Request in Interactive Sandbox',
        content: 'Test in Sandbox',
        isActionable: true,
        actionType: 'click',
        boundingBox: { x: 5, y: 68, w: 35, h: 8 },
        tokenCount: 6,
        relevanceScore: 90,
      },
    ],
  },
};

export const INITIAL_TABS = [
  {
    id: 'tab-1',
    title: 'Autonomous AI Agents Paper',
    url: 'https://arxiv.org/abs/2608.01234',
    favicon: '📄',
    isLoading: false,
    pageData: PRESET_PAGES['https://arxiv.org/abs/2608.01234'],
    agentTask: 'Analyze paper innovations, extract key metrics, and prepare executive summary.',
    agentStatus: 'idle' as const,
    currentStepIndex: 0,
    steps: [
      {
        stepNumber: 1,
        timestamp: '10:00:12',
        thought: 'Received goal to extract research innovations. Need to parse semantic DOM tree first.',
        action: { type: 'navigate' as const, targetDescription: 'Navigated to paper URL' },
        status: 'done' as const,
        resultSummary: 'Page loaded in 120ms. Identified 8 actionable nodes and 5 key entities.',
      },
      {
        stepNumber: 2,
        timestamp: '10:00:15',
        thought: 'I will target Node #a-7 (Benchmark Table) to extract quantitative performance comparison.',
        action: { type: 'extract' as const, targetNodeId: 'a-7', targetDescription: 'Extract benchmark metrics table' },
        status: 'done' as const,
        resultSummary: 'Extracted: 93.2% token reduction, 7.8x speedup, 99.1% form accuracy.',
      },
      {
        stepNumber: 3,
        timestamp: '10:00:18',
        thought: 'Synthesizing all extracted findings into Knowledge Base.',
        action: { type: 'synthesize' as const, targetDescription: 'Generate structured markdown summary' },
        status: 'done' as const,
        resultSummary: 'Knowledge item created and attached to session memory graph.',
      },
    ],
  },
  {
    id: 'tab-2',
    title: 'AI Cloud GPU Compute Index',
    url: 'https://cloud-pricing.ai/gpu-matrix',
    favicon: '⚡',
    isLoading: false,
    pageData: PRESET_PAGES['https://cloud-pricing.ai/gpu-matrix'],
    agentTask: 'Compare GPU hourly rates across NVIDIA B200 and TPU v6e.',
    agentStatus: 'completed' as const,
    currentStepIndex: 2,
    steps: [
      {
        stepNumber: 1,
        timestamp: '10:02:05',
        thought: 'Analyzing live GPU spot rates table to identify cheapest compute tier.',
        action: { type: 'extract' as const, targetNodeId: 'b-4', targetDescription: 'Extract pricing data matrix' },
        status: 'done' as const,
        resultSummary: 'Identified lowest spot rate: Google TPU v6e at $0.98/hr.',
      },
    ],
  },
];
