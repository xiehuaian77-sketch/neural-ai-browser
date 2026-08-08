import React from 'react';
import { KnowledgeItem } from '../types';
import { X, Database, ExternalLink, Download, Trash2 } from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: KnowledgeItem[];
  onDeleteItem: (id: string) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  items,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ai_browser_memory_graph.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-bold text-base">Agent Knowledge Memory Graph</h2>
              <p className="text-xs text-slate-400 font-mono">
                Persistent findings synthesized by AI Browser across browsing sessions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportAll}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Database className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-sm font-medium">No Knowledge Items Saved Yet</p>
              <p className="text-xs text-slate-600">
                Run an AI Agent task on any web page to extract structured findings into memory.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 font-mono">{item.topic}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500 font-mono">{item.timestamp}</span>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 hover:text-rose-400 text-slate-500 transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono truncate">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-300 font-semibold">{item.sourceTitle}</span>
                  <span className="text-slate-600">({item.sourceUrl})</span>
                </div>

                <div className="text-xs text-slate-300 font-mono bg-slate-900 p-3 rounded border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {item.contentMarkdown}
                </div>

                {item.entities && item.entities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.entities.map((e) => (
                      <span
                        key={e.id}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      >
                        {e.category}: {e.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
