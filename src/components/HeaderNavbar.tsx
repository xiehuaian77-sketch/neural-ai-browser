import React, { useState } from 'react';
import { ViewMode, ProviderInfo } from '../types';
import {
  Globe,
  Bot,
  Zap,
  Eye,
  Code2,
  Columns3,
  Play,
  RotateCw,
  Search,
  Sparkles,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  Download,
  ChevronDown,
  Swords,
} from 'lucide-react';

interface HeaderNavbarProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  onNavigate: (url: string) => void;
  onRunAgent: (goal: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  rawTokens: number;
  aiTokens: number;
  openKnowledgeModal: () => void;
  openSwarmModal: () => void;
  providers: ProviderInfo[];
  selectedProvider: string;
  setSelectedProvider: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (id: string) => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  urlInput,
  setUrlInput,
  onNavigate,
  onRunAgent,
  viewMode,
  setViewMode,
  rawTokens,
  aiTokens,
  openKnowledgeModal,
  openSwarmModal,
  providers,
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
}) => {
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const tokenSavings = rawTokens > 0 ? Math.round(((rawTokens - aiTokens) / rawTokens) * 100) : 0;

  const currentProvider = providers.find((p) => p.id === selectedProvider);

  const handleProviderChange = (id: string) => {
    setSelectedProvider(id);
    const p = providers.find((pr) => pr.id === id);
    if (p) setSelectedModel(p.defaultModel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (isCommandMode || (!urlInput.startsWith('http://') && !urlInput.startsWith('https://') && urlInput.includes(' '))) {
      onRunAgent(urlInput);
    } else {
      onNavigate(urlInput);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 select-none">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sky-400 font-semibold tracking-wide">
            <Bot className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Neural Browser Engine
            </span>
            <span className="bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono">
              v2.6-AI
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* AI Perception Badge */}
          <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Semantic Pruning: Active</span>
          </div>

          {/* Token Savings Metric */}
          <div className="hidden md:flex items-center space-x-2 bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20 text-[11px] font-mono">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Tokens: {aiTokens.toLocaleString()} / {rawTokens.toLocaleString()}</span>
            <span className="text-emerald-400 font-semibold">({tokenSavings}% Saved)</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Model / Provider Selector */}
          {providers.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700"
                title="Select AI Model"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{currentProvider?.name || selectedProvider}</span>
                <span className="font-mono text-[10px] text-slate-400">{selectedModel}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showModelPicker && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {providers.map((provider) => (
                    <div key={provider.id} className="border-b border-slate-800 last:border-b-0">
                      <button
                        onClick={() => {
                          handleProviderChange(provider.id);
                          setShowModelPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 transition ${
                          selectedProvider === provider.id ? 'bg-sky-500/10 text-sky-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="font-semibold">{provider.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {provider.models.map((m) => (
                            <button
                              key={m.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedModel(m.id);
                                setSelectedProvider(provider.id);
                              }}
                              className={`mr-2 mb-1 px-1.5 py-0.5 rounded text-[10px] transition ${
                                selectedModel === m.id && selectedProvider === provider.id
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {m.name}
                            </button>
                          ))}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Download Full Code Zip */}
          <a
            href="/api/download-zip"
            download="neural-ai-browser.zip"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition text-xs shadow"
            title="Download full project code as ZIP archive"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Project (.zip)</span>
          </a>

          {/* Swarm Crawler Button */}
          <button
            onClick={openSwarmModal}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Multi-Agent Swarm</span>
          </button>

          {/* Knowledge Memory Base Button */}
          <button
            onClick={openKnowledgeModal}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agent Memory Graph</span>
          </button>
        </div>
      </div>

      {/* Main Omnibox & Navigation Row */}
      <div className="flex items-center justify-between px-4 py-2.5 gap-3">
        {/* Navigation Control Buttons */}
        <div className="flex items-center space-x-1 text-slate-400">
          <button
            onClick={() => onNavigate(urlInput)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            title="Reload Page Engine"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox Input */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-4xl relative">
          <div className="relative flex items-center bg-slate-950 border border-slate-700 focus-within:border-sky-500 rounded-lg overflow-hidden shadow-inner transition-all">
            {/* Mode Selector Toggle inside Omnibox */}
            <button
              type="button"
              onClick={() => setIsCommandMode(!isCommandMode)}
              className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium border-r border-slate-800 transition ${
                isCommandMode
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isCommandMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  <span>Agent Goal</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>URL Mode</span>
                </>
              )}
            </button>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={
                isCommandMode
                  ? 'Enter AI browsing goal, e.g., "Find latest AI agent research papers and summarize metrics"...'
                  : 'Enter URL or search query, e.g., https://arxiv.org/abs/2608.01234...'
              }
              className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            />

            <button
              type="submit"
              className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white transition text-xs font-medium flex items-center space-x-1"
            >
              {isCommandMode ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Fetch</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Dual Mode View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition ${
              viewMode === 'visual'
                ? 'bg-sky-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Human Rendered Visual Canvas"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition ${
              viewMode === 'split'
                ? 'bg-sky-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split Dual View (Visual + Neural DOM)"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => setViewMode('neural')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition ${
              viewMode === 'neural'
                ? 'bg-sky-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="AI Neural Perception (Semantic Tree & Tokens)"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">Neural</span>
          </button>

          <button
            onClick={() => setViewMode('battle')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition ${
              viewMode === 'battle'
                ? 'bg-amber-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-amber-300'
            }`}
            title="Battle Mode: Compare Two Models Side-by-Side"
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Battle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
