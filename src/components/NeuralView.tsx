import React, { useState } from 'react';
import { DOMNode, WebPageData } from '../types';
import {
  Cpu,
  Sparkles,
  MousePointerClick,
  Tag,
  Copy,
} from 'lucide-react';

interface NeuralViewProps {
  pageData: WebPageData;
  onNodeAction?: (node: DOMNode, actionType: 'click' | 'extract') => void;
  hoveredNodeId?: string | null;
  setHoveredNodeId?: (id: string | null) => void;
}

export const NeuralView: React.FC<NeuralViewProps> = ({
  pageData,
  onNodeAction,
  hoveredNodeId,
  setHoveredNodeId,
}) => {
  const [activeTab, setActiveTab] = useState<'domTree' | 'entities' | 'markdown' | 'rawJson'>('domTree');
  const [filterActionableOnly, setFilterActionableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = (pageData.domTree || []).filter((node) => {
    if (filterActionableOnly && !node.isActionable) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        node.id.toLowerCase().includes(q) ||
        node.label.toLowerCase().includes(q) ||
        node.content.toLowerCase().includes(q) ||
        node.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-mono select-text">
      {/* Neural Engine Header & Metrics Banner */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center space-x-2">
              <span>Neural Perception Engine</span>
              <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.2 rounded border border-sky-500/20 font-sans">
                DOM Abstracted
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Pruned 94% visual style noise | {(pageData?.domTree || []).length} Actionable Nodes
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('domTree')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'domTree' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semantic Tree
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
              activeTab === 'entities' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>Entities ({(pageData?.extractedEntities || []).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'markdown' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clean Content
          </button>
          <button
            onClick={() => setActiveTab('rawJson')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'rawJson' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw JSON
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: SEMANTIC DOM TREE */}
        {activeTab === 'domTree' && (
          <div className="space-y-3">
            {/* Filter and Search Bar */}
            <div className="flex items-center justify-between gap-3 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-sans">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search Node ID, Tag, or Label..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-sky-500 font-mono text-xs"
                />
              </div>

              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterActionableOnly}
                  onChange={(e) => setFilterActionableOnly(e.target.checked)}
                  className="rounded border-slate-700 text-sky-600 focus:ring-sky-500"
                />
                <span>Actionable Nodes Only</span>
              </label>
            </div>

            {/* DOM Node List */}
            <div className="space-y-2">
              {filteredNodes.map((node) => {
                const isHovered = hoveredNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => setHoveredNodeId && setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId && setHoveredNodeId(null)}
                    className={`p-3 rounded-lg border transition font-mono text-xs relative ${
                      isHovered
                        ? 'bg-sky-950/60 border-sky-500 ring-1 ring-sky-500'
                        : node.isActionable
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/80 border-slate-900 text-slate-400'
                    }`}
                  >
                    {/* Node Handle & Action Tag */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30 text-[11px]">
                          #{node.id}
                        </span>
                        <span className="text-indigo-300 font-semibold">{node.tag}</span>
                        {node.type && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-sans uppercase">
                            {node.type}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px]">
                        {node.tokenCount && (
                          <span className="text-slate-500">{node.tokenCount} tokens</span>
                        )}
                        {node.relevanceScore && (
                          <span className="text-emerald-400 font-sans">
                            Score: {node.relevanceScore}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Label and Content */}
                    <div className="text-slate-200 font-sans font-medium text-sm mb-1">
                      {node.label}
                    </div>
                    <p className="text-slate-400 font-mono text-xs leading-relaxed bg-slate-950 p-2 rounded border border-slate-900 overflow-x-auto">
                      {node.content}
                    </p>

                    {/* Node Bounding Box Specs & Agent Trigger */}
                    {node.isActionable && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 font-mono">
                          <span>
                            BoundingBox: [{node.boundingBox?.x}%, {node.boundingBox?.y}%, {node.boundingBox?.w}%, {node.boundingBox?.h}%]
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 font-sans">
                          <button
                            onClick={() => onNodeAction && onNodeAction(node, 'click')}
                            className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium flex items-center space-x-1 transition shadow-sm"
                          >
                            <MousePointerClick className="w-3 h-3" />
                            <span>Simulate Click</span>
                          </button>

                          <button
                            onClick={() => onNodeAction && onNodeAction(node, 'extract')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center space-x-1 transition border border-slate-700"
                          >
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Extract Node</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EXTRACTED ENTITIES */}
        {activeTab === 'entities' && (
          <div className="space-y-3 font-sans">
            <div className="text-xs text-slate-400">
              Structured entities automatically extracted by Gemini from semantic web nodes:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(pageData?.extractedEntities || []).map((entity) => (
                <div
                  key={entity.id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {entity.category}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">
                      {entity.confidence}% confidence
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-slate-100 mb-2 font-mono">
                    {entity.text}
                  </div>

                  {entity.sourceNodeId && (
                    <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                      <span>Source Node: #{entity.sourceNodeId}</span>
                      <button
                        onClick={() => handleCopy(entity.text)}
                        className="p-1 hover:text-slate-300 transition"
                        title="Copy Entity Value"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLEAN MARKDOWN */}
        {activeTab === 'markdown' && (
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-sans text-slate-300 space-y-3 leading-relaxed text-sm">
            <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-800 font-mono">
              <span>Cleaned Page Markdown Stream</span>
              <button
                onClick={() => handleCopy(pageData.markdownContent)}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-900">
              {pageData?.markdownContent || ''}
            </pre>
          </div>
        )}

        {/* TAB 4: RAW JSON */}
        {activeTab === 'rawJson' && (
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-sky-300">
            <pre className="whitespace-pre-wrap bg-slate-950 p-3 rounded border border-slate-900 overflow-x-auto">
              {JSON.stringify(pageData || {}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
