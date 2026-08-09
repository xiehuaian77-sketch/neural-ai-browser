import { useState, useEffect, useCallback } from 'react';
import { X, BrainCircuit, Upload } from 'lucide-react';
import {
  BrowserTab,
  DOMNode,
  KnowledgeItem,
  SwarmTask,
  ViewMode,
  WebPageData,
  ProviderInfo,
  AgentStep,
} from './types';
import { PRESET_PAGES, INITIAL_TABS } from './data/presetPages';
import { HeaderNavbar } from './components/HeaderNavbar';
import { TabManager } from './components/TabManager';
import { VisualCanvas } from './components/VisualCanvas';
import { NeuralView } from './components/NeuralView';
import { AgentPanel } from './components/AgentPanel';
import { MemoryModal } from './components/MemoryModal';
import { SwarmModal } from './components/SwarmModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BattleMode } from './components/BattleMode';
import { ChainOfThoughtVisualizer } from './components/ChainOfThoughtVisualizer';
import { FileUpload, UploadedFile } from './components/FileUpload';

const STORAGE_KEY = 'ai-browser-memory-items';

export default function App() {
  const [tabs, setTabs] = useState<BrowserTab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [urlInput, setUrlInput] = useState<string>('https://arxiv.org/abs/2608.01234');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeAgentTargetId, setActiveAgentTargetId] = useState<string | null>(null);
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);

  // Model / Provider state
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Load providers from backend
  useEffect(() => {
    fetch('/api/models')
      .then((r) => r.json())
      .then((data) => {
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
          const first = data.providers[0];
          const second = data.providers[1] || data.providers[0];
          setSelectedProvider(first.id);
          setSelectedModel(first.defaultModel);
          setBattleSideA({ provider: first.id, model: first.defaultModel });
          setBattleSideB({ provider: second.id, model: second.defaultModel });
        }
      })
      .catch(() => {});
  }, []);

  // Modals state
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isSwarmOpen, setIsSwarmOpen] = useState(false);

  // Battle Mode state
  const [battleQuestion, setBattleQuestion] = useState('');
  const [battleSideA, setBattleSideA] = useState<{ provider: string; model: string }>({
    provider: '',
    model: '',
  });
  const [battleSideB, setBattleSideB] = useState<{ provider: string; model: string }>({
    provider: '',
    model: '',
  });

  // Memory: load from localStorage
  const [memoryItems, setMemoryItems] = useState<KnowledgeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'mem-1',
        timestamp: '2026-08-07 22:00',
        sourceUrl: 'https://arxiv.org/abs/2608.01234',
        sourceTitle: 'Autonomous Multimodal AI Agents in Web Browsing & DOM Reasoning',
        topic: 'Neural DOM Protocol (NDP)',
        contentMarkdown: 'Neural DOM Protocol achieves 98.4% web task completion rate with 85% reduced token consumption compared to standard visual HTML parsing.',
        entities: [
          { id: 'e-1', category: 'Technical Term', text: 'Neural DOM Protocol', confidence: 99 },
          { id: 'e-2', category: 'Price / Metric', text: '85% Token Savings', confidence: 98 },
        ],
        tags: ['Research', 'DOM Parsing', 'AI Agent'],
      },
    ];
  });

  // Memory: persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryItems));
    } catch {}
  }, [memoryItems]);

  const [swarmTasks, setSwarmTasks] = useState<SwarmTask[]>([]);
  const [synthesizedReport, setSynthesizedReport] = useState<string | null>(null);
  const [parsedFiles, setParsedFiles] = useState<UploadedFile[]>([]);
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);

  const handleFilesParsed = (files: UploadedFile[]) => {
    setParsedFiles((prev) => [...prev, ...files]);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const safePageData: WebPageData = activeTab.pageData || {
    url: activeTab.url,
    title: activeTab.title || activeTab.url,
    domain: new URL(activeTab.url).hostname,
    summary: 'Loading...',
    markdownContent: '',
    domTree: [],
    extractedEntities: [],
    rawTokenCount: 0,
    aiOptimizedTokenCount: 0,
    loadTimeMs: 0,
    interactiveElementsCount: 0,
  };

  const activeTabForRender = { ...activeTab, pageData: safePageData };

  // Helper: call unified chat API
  const callChatAPI = useCallback(
    async (body: Record<string, any>) => {
      const res = await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          ...body,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'API request failed');
      return json;
    },
    [selectedProvider, selectedModel]
  );

  // Helper: streaming chat API via SSE
  const callChatAPIStream = useCallback(
    async (body: Record<string, any>, onChunk: (delta: string, fullText: string) => void) => {
      const res = await fetch(`/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          ...body,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Stream request failed');
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('Streaming not supported');
      }

      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6).trim();
            if (!payload) continue;
            try {
              const data = JSON.parse(payload);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.delta) {
                fullText += data.delta;
                onChunk(data.delta, fullText);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }

      return fullText;
    },
    [selectedProvider, selectedModel]
  );

  // Handle URL Navigation
  const handleNavigate = async (targetUrl: string) => {
    setUrlInput(targetUrl);
    updateActiveTab((tab) => ({
      ...tab,
      url: targetUrl,
      title: targetUrl.replace(/^https?:\/\//, '').split('/')[0],
      isLoading: true,
      agentStatus: 'navigating',
    }));

    try {
      if (PRESET_PAGES[targetUrl]) {
        setTimeout(() => {
          updateActiveTab((tab) => ({
            ...tab,
            pageData: PRESET_PAGES[targetUrl],
            title: PRESET_PAGES[targetUrl].title,
            isLoading: false,
            agentStatus: 'idle',
          }));
        }, 300);
        return;
      }

      const chatRes = await callChatAPI({
        messages: [
          {
            role: 'user',
            content: `URL or Web Goal: "${targetUrl}"\nSpecific Agent Objective: "${activeTab.agentTask || 'Examine and parse page structure'}"`,
          },
        ],
        systemInstruction: `You are the core perception engine of an AI-Dedicated Web Browser.
Analyze the given URL and output a structured JSON matching this schema:
{
  "title": "Page Title",
  "domain": "example.com",
  "summary": "2-3 sentence core summary",
  "markdownContent": "# Main Title\n\nStructured article/page content in clean markdown...",
  "rawTokenCount": 5400,
  "aiOptimizedTokenCount": 420,
  "loadTimeMs": 180,
  "interactiveElementsCount": 8,
  "extractedEntities": [{ "id": "e-1", "category": "Key Fact", "text": "...", "confidence": 95, "sourceNodeId": "a-1" }],
  "domTree": [{ "id": "a-1", "type": "heading", "tag": "h1", "label": "Heading", "content": "...", "isActionable": false, "actionType": "click", "boundingBox": { "x": 10, "y": 5, "w": 80, "h": 8 }, "tokenCount": 15, "relevanceScore": 95 }]
}
Ensure all IDs are unique. Provide 6 to 12 realistic DOM nodes.`,
        responseMimeType: 'application/json',
      });

      const parsedData = JSON.parse(chatRes.text || '{}');
      updateActiveTab((tab) => ({
        ...tab,
        pageData: { ...parsedData, url: targetUrl } as WebPageData,
        title: parsedData.title || targetUrl,
        isLoading: false,
        agentStatus: 'idle',
      }));
    } catch (err: any) {
      console.warn('Backend navigate fallback to preset:', err?.message);
      const fallbackData = PRESET_PAGES['https://arxiv.org/abs/2608.01234'];
      updateActiveTab((tab) => ({
        ...tab,
        pageData: { ...fallbackData, url: targetUrl, title: `AI Browser View: ${targetUrl}` },
        title: targetUrl,
        isLoading: false,
        agentStatus: 'idle',
      }));
    }
  };
  const updateActiveTab = (updater: (prevTab: BrowserTab) => BrowserTab) => {
    setTabs((prevTabs) =>
      prevTabs.map((t) => (t.id === activeTabId ? updater(t) : t))
    );
  };

  // Execute Goal via Agent
  const handleRunAgentGoal = async (goal: string) => {
    updateActiveTab((tab) => ({
      ...tab,
      agentTask: goal,
      agentStatus: 'analyzing',
    }));
    await handleStepNext(goal);
  };

  // Execute Next Agent Step
  const handleStepNext = async (customGoal?: string) => {
    const goal = customGoal || activeTab.agentTask || 'Analyze web page structure';
    updateActiveTab((tab) => ({ ...tab, agentStatus: 'executing' }));

    try {
      const chatRes = await callChatAPI({
        messages: [
          {
            role: 'user',
            content: `Goal: "${goal}"
Current Page: "${safePageData.title}" (${safePageData.url})
DOM Nodes available: ${JSON.stringify(safePageData.domTree || []).slice(0, 3000)}
Previous Steps Executed: ${JSON.stringify(activeTab.steps || [])}`,
          },
        ],
        systemInstruction: `You are an Autonomous AI Browser Agent.
Given the target goal, current page summary, and available DOM nodes, decide the single next best step.
Return JSON:
{
  "thought": "Deep reasoning",
  "action": { "type": "navigate|click|input|extract|scroll|synthesize", "targetNodeId": "a-3", "targetDescription": "...", "value": "optional" },
  "resultSummary": "Anticipated result"
}`,
        responseMimeType: 'application/json',
      });

      const stepResult = JSON.parse(chatRes.text || '{}');
      const newStepNumber = (activeTab.steps?.length || 0) + 1;
      const targetNodeId = stepResult.action?.targetNodeId || `a-${newStepNumber}`;
      setActiveAgentTargetId(targetNodeId);

      const newStep: AgentStep = {
        stepNumber: newStepNumber,
        timestamp: new Date().toLocaleTimeString(),
        thought: stepResult.thought || 'Determined optimal DOM node action for goal.',
        action: {
          type: stepResult.action?.type || 'extract',
          targetNodeId,
          targetDescription: stepResult.action?.targetDescription || 'Inspecting target semantic element',
          value: stepResult.action?.value,
        },
        status: 'done',
        resultSummary: stepResult.resultSummary || 'Action completed successfully.',
      };

      updateActiveTab((tab) => ({
        ...tab,
        steps: [...(tab.steps || []), newStep],
        agentStatus: 'completed',
      }));

      // Add to memory graph
      const newKnowledge: KnowledgeItem = {
        id: `mem-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        sourceUrl: safePageData.url,
        sourceTitle: safePageData.title,
        topic: goal,
        contentMarkdown: `**Reasoning**: ${stepResult.thought}\n**Action Executed**: ${stepResult.action?.targetDescription}\n**Result**: ${stepResult.resultSummary || 'Extracted DOM data'}`,
        entities: safePageData.extractedEntities.slice(0, 3),
        tags: ['Agent Run', 'Extracted'],
      };
      setMemoryItems((prev) => [newKnowledge, ...prev]);
    } catch {
      // Fallback simulation
      const newStepNumber = (activeTab.steps?.length || 0) + 1;
      const targetNodeId = `a-${(newStepNumber % 3) + 1}`;
      setActiveAgentTargetId(targetNodeId);

      const fallbackStep: AgentStep = {
        stepNumber: newStepNumber,
        timestamp: new Date().toLocaleTimeString(),
        thought: `Analysing target page nodes to extract relevant info for: "${goal}"`,
        action: { type: 'extract', targetNodeId, targetDescription: 'Extracting semantic node data table' },
        status: 'done',
        resultSummary: 'Target node parsed and added to session memory graph.',
      };

      updateActiveTab((tab) => ({
        ...tab,
        steps: [...(tab.steps || []), fallbackStep],
        agentStatus: 'completed',
      }));
    }
  };

  // Run Auto Loop
  const handleRunAutoLoop = async () => {
    await handleStepNext();
  };

  // Reset Agent
  const handleResetAgent = () => {
    setActiveAgentTargetId(null);
    setSynthesizedReport(null);
    updateActiveTab((tab) => ({
      ...tab,
      steps: [],
      agentStatus: 'idle',
    }));
  };

  // Synthesize Knowledge Report
  const handleSynthesize = async () => {
    updateActiveTab((tab) => ({ ...tab, agentStatus: 'synthesizing' }));

    try {
      const fullText = await callChatAPIStream(
        {
          messages: [
            {
              role: 'user',
              content: `Synthesize a comprehensive structured report based on web browsing session for goal: "${activeTab.agentTask || 'General Analysis'}"\nPages analyzed: ${JSON.stringify([safePageData]).slice(0, 6000)}\n\nOutput: Key Findings, Data Tables, Direct Links, Actionable Insights, Entity Graph summaries.`,
            },
          ],
          systemInstruction: 'You are an AI research analyst compiling data gathered from AI browser agent runs.',
        },
        (_delta, fullText) => {
          setSynthesizedReport(fullText);
        }
      );

      if (fullText) {
        setSynthesizedReport(fullText);
      }
      updateActiveTab((tab) => ({ ...tab, agentStatus: 'completed' }));
    } catch {
      setSynthesizedReport(
        `# Executive Synthesis Report: ${safePageData.title}\n\n` +
          `**Goal**: ${activeTab.agentTask || 'General Analysis'}\n\n` +
          `## Key Findings\n` +
          `- **Tokens Reduced**: Saved ${safePageData.rawTokenCount - safePageData.aiOptimizedTokenCount} tokens using Neural DOM Protocol.\n` +
          `- **Interactive Nodes**: ${safePageData.domTree.length} actionable nodes cataloged.\n` +
          `- **Extracted Entities**: ${safePageData.extractedEntities.map((e) => e.text).join(', ')}.\n`
      );
      updateActiveTab((tab) => ({ ...tab, agentStatus: 'completed' }));
    }
  };

  // Simulate Node Action Click/Extract
  const handleNodeAction = (node: DOMNode, actionType: 'click' | 'extract') => {
    setActiveAgentTargetId(node.id);
    const actionDesc = actionType === 'click' ? `Simulated click on #${node.id}` : `Extracted content from #${node.id}`;

    const manualStep = {
      stepNumber: activeTab.steps.length + 1,
      timestamp: new Date().toLocaleTimeString(),
      thought: `Manual user trigger on node #${node.id} (${node.label})`,
      action: {
        type: actionType,
        targetNodeId: node.id,
        targetDescription: actionDesc,
      },
      status: 'done' as const,
      resultSummary: `Node content: "${node.content.slice(0, 60)}..."`,
    };

    updateActiveTab((tab) => ({
      ...tab,
      steps: [...tab.steps, manualStep],
    }));
  };

  // Tab Handlers
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    const selected = tabs.find((t) => t.id === id);
    if (selected) {
      setUrlInput(selected.url);
    }
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
      setUrlInput(remaining[0].url);
    }
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const defaultPage = PRESET_PAGES['https://docs.agentic-web.dev/api/v2'];
    const newTab: BrowserTab = {
      id: newId,
      title: defaultPage.title,
      url: defaultPage.url,
      favicon: '⚙️',
      isLoading: false,
      pageData: defaultPage,
      agentTask: 'Inspect API endpoints and parameter schemas.',
      agentStatus: 'idle',
      currentStepIndex: 0,
      steps: [],
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setUrlInput(defaultPage.url);
  };

  // Swarm Dispatch Handler
  const handleDispatchSwarm = (tasks: { url: string; goal: string }[]) => {
    const createdTasks: SwarmTask[] = tasks.map((t, idx) => ({
      id: `swarm-${Date.now()}-${idx}`,
      targetUrl: t.url,
      taskGoal: t.goal,
      status: 'running',
      assignedAgentName: `Worker Alpha-${idx + 1}`,
      progress: 30,
    }));

    setSwarmTasks(createdTasks);

    // Simulate swarm progress completion
    setTimeout(() => {
      setSwarmTasks((prev) =>
        prev.map((t) => ({
          ...t,
          status: 'completed',
          progress: 100,
          resultSummary: `Successfully extracted structured data from ${t.targetUrl}`,
        }))
      );
    }, 2000);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
        {/* Top Header Navbar */}
        <HeaderNavbar
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        onNavigate={handleNavigate}
        onRunAgent={handleRunAgentGoal}
        viewMode={viewMode}
        setViewMode={setViewMode}
        rawTokens={safePageData.rawTokenCount || 18400}
        aiTokens={safePageData.aiOptimizedTokenCount || 1250}
        openKnowledgeModal={() => setIsMemoryOpen(true)}
        openSwarmModal={() => setIsSwarmOpen(true)}
        providers={providers}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Multi-Tab Strip */}
      <TabManager
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* File Upload Sidebar */}
        {isUploadPanelOpen && (
          <div className="w-80 md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
            <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-sm text-slate-100">文件解析</span>
              </div>
              <button
                onClick={() => setIsUploadPanelOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <FileUpload onFilesParsed={handleFilesParsed} />
            </div>
          </div>
        )}

        {/* Left/Main Canvas Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile upload toggle FAB */}
          <button
            onClick={() => setIsUploadPanelOpen((v) => !v)}
            className={`md:hidden absolute bottom-4 left-4 z-20 p-3 rounded-full shadow-lg border transition ${
              isUploadPanelOpen ? 'bg-slate-800 border-slate-600 text-white' : 'bg-sky-600 border-sky-500 text-white'
            }`}
            title="Toggle file upload"
          >
            <Upload className="w-5 h-5" />
          </button>
          {/* VISUAL MODE */}
          {viewMode === 'visual' && (
            <div className="w-full h-full">
              <VisualCanvas
                pageData={activeTabForRender.pageData}
                hoveredNodeId={hoveredNodeId}
                setHoveredNodeId={setHoveredNodeId}
                onNodeAction={handleNodeAction}
                activeAgentTargetId={activeAgentTargetId}
              />
            </div>
          )}

          {/* NEURAL MODE */}
          {viewMode === 'neural' && (
            <div className="w-full h-full">
              <NeuralView
                pageData={activeTabForRender.pageData}
                onNodeAction={handleNodeAction}
                hoveredNodeId={hoveredNodeId}
                setHoveredNodeId={setHoveredNodeId}
              />
            </div>
          )}

          {/* SPLIT DUAL VIEW */}
          {viewMode === 'split' && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              <VisualCanvas
                pageData={activeTabForRender.pageData}
                hoveredNodeId={hoveredNodeId}
                setHoveredNodeId={setHoveredNodeId}
                onNodeAction={handleNodeAction}
                activeAgentTargetId={activeAgentTargetId}
              />
              <NeuralView
                pageData={activeTabForRender.pageData}
                onNodeAction={handleNodeAction}
                hoveredNodeId={hoveredNodeId}
                setHoveredNodeId={setHoveredNodeId}
              />
            </div>
          )}

          {/* BATTLE MODE */}
          {viewMode === 'battle' && (
            <div className="w-full h-full">
              <BattleMode
                question={battleQuestion}
                onQuestionChange={setBattleQuestion}
                sideA={battleSideA}
                sideB={battleSideB}
                onSideAChange={setBattleSideA}
                onSideBChange={setBattleSideB}
                providers={providers}
              />
            </div>
          )}

          {/* CHAIN OF THOUGHT MODE */}
          {viewMode === 'chain' && (
            <div className="w-full h-full bg-slate-950">
              <ChainOfThoughtVisualizer
                steps={activeTabForRender.steps || []}
                isRunning={(activeTabForRender.agentStatus || 'idle') === 'analyzing' || (activeTabForRender.agentStatus || 'idle') === 'executing'}
              />
            </div>
          )}
        </div>

        {/* Right Side Agent Controller Drawer */}
        <button
          onClick={() => setIsAgentPanelOpen((v) => !v)}
          className="md:hidden absolute bottom-4 right-4 z-20 p-3 rounded-full shadow-lg border bg-sky-600 border-sky-500 text-white"
          title="Toggle agent panel"
        >
          <BrainCircuit className="w-5 h-5" />
        </button>

        {/* Agent Panel - always visible on desktop, toggleable overlay on mobile */}
        <div className={`${isAgentPanelOpen ? 'fixed inset-0 z-30' : 'hidden'} md:relative md:block md:z-auto`}>
          <div className="md:relative absolute inset-0 md:inset-auto">
            {isAgentPanelOpen && (
              <button
                onClick={() => setIsAgentPanelOpen(false)}
                className="md:hidden absolute top-2 right-2 z-40 p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className={`md:block ${isAgentPanelOpen ? 'block' : 'hidden'} md:w-auto`} style={{ width: '320px' }}>
              <AgentPanel
                agentTask={activeTabForRender.agentTask || ''}
                setAgentTask={(task) => updateActiveTab((t) => ({ ...t, agentTask: task }))}
                agentStatus={activeTabForRender.agentStatus || 'idle'}
                steps={activeTabForRender.steps || []}
                onRunAutoLoop={handleRunAutoLoop}
                onStepNext={() => handleStepNext()}
                onResetAgent={handleResetAgent}
                onSynthesize={handleSynthesize}
                synthesizedReport={synthesizedReport}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MemoryModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        items={memoryItems}
        onDeleteItem={(id) => setMemoryItems((prev) => prev.filter((i) => i.id !== id))}
      />

      <SwarmModal
        isOpen={isSwarmOpen}
        onClose={() => setIsSwarmOpen(false)}
        onDispatchSwarm={handleDispatchSwarm}
        swarmTasks={swarmTasks}
      />
    </div>
    </ErrorBoundary>
  );
}
