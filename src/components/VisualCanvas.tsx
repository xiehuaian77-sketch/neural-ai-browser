import React from 'react';
import { DOMNode, WebPageData } from '../types';
import { MousePointerClick, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface VisualCanvasProps {
  pageData: WebPageData;
  hoveredNodeId?: string | null;
  setHoveredNodeId?: (id: string | null) => void;
  onNodeAction?: (node: DOMNode, actionType: 'click' | 'extract') => void;
  activeAgentTargetId?: string | null;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  pageData,
  hoveredNodeId,
  setHoveredNodeId,
  onNodeAction,
  activeAgentTargetId,
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 relative select-none overflow-hidden">
      {/* Simulated Browser Address Bar & Security Ribbon */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-sans font-medium">{pageData?.domain || 'loading...'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500 truncate max-w-xs">{pageData?.url || ''}</span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-sans border border-emerald-500/20">
            Render Time: {pageData?.loadTimeMs ?? 0}ms
          </span>
          <span className="text-slate-500 font-sans">
            {pageData?.interactiveElementsCount ?? 0} AI Action Hotspots
          </span>
        </div>
      </div>

      {/* Rendered Web Page Container */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-100 font-sans relative">
        {/* Background AI Grid Matrix Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        />

        {/* Real Simulated Web Page Render */}
        <div className="max-w-3xl mx-auto bg-slate-950 rounded-xl p-8 shadow-2xl border border-slate-800 relative space-y-6 min-h-[600px]">
          {/* Web Header */}
          <div className="border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between text-xs text-sky-400 font-mono mb-2">
              <span>{pageData.domain.toUpperCase()}</span>
              <span>AUG 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
              {pageData?.title || 'Loading...'}
            </h1>
          </div>

          {/* AI Page Summary Box */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-lg relative overflow-hidden">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 mb-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>AI AGENT EXECUTIVE SUMMARY</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {pageData?.summary || 'Analyzing page content...'}
            </p>
          </div>

          {/* Rendered Interactive DOM Nodes with Bounding Box Overlays */}
          <div className="space-y-4 pt-2 relative">
            {(pageData?.domTree || []).map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const isAgentTarget = activeAgentTargetId === node.id;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNodeId && setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId && setHoveredNodeId(null)}
                  className={`group relative p-3 rounded-lg border transition ${
                    isAgentTarget
                      ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-400 animate-pulse'
                      : isHovered
                      ? 'bg-slate-900 border-sky-500/80 shadow-lg'
                      : node.isActionable
                      ? 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                      : 'bg-slate-950 border-slate-900'
                  }`}
                >
                  {/* AI Hotspot Bounding Tag */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold border border-sky-500/30">
                        #{node.id}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-medium">
                        {node.tag}
                      </span>
                    </div>

                    {node.isActionable && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onNodeAction && onNodeAction(node, 'click')}
                          className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium flex items-center space-x-1 transition"
                        >
                          <MousePointerClick className="w-3 h-3" />
                          <span>Action</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Render Node Content */}
                  <div className="text-slate-200 text-sm font-sans">
                    {node.content}
                  </div>

                  {/* Agent Beam Pointer Overlay when active */}
                  {isAgentTarget && (
                    <div className="absolute -top-3 -right-3 flex items-center space-x-1 bg-sky-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-lg animate-bounce">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>AGENT TARGET</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
