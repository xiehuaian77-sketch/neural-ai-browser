import React from 'react';
import { BrowserTab } from '../types';
import { Plus, X, CheckCircle2, Loader2 } from 'lucide-react';

interface TabManagerProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
}

export const TabManager: React.FC<TabManagerProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  return (
    <div className="flex items-center bg-slate-950 px-2 pt-1 border-b border-slate-800 overflow-x-auto select-none no-scrollbar">
      <div className="flex items-center space-x-1 flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isRunning = tab.agentStatus === 'navigating' || tab.agentStatus === 'analyzing' || tab.agentStatus === 'executing';
          const isDone = tab.agentStatus === 'completed';

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center space-x-2 px-3 py-1.5 rounded-t-lg border-t border-x text-xs cursor-pointer transition max-w-[240px] min-w-[140px] truncate ${
                isActive
                  ? 'bg-slate-900 border-slate-700 text-sky-300 font-medium'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span className="text-sm">{tab.favicon || '📄'}</span>

              <span className="truncate flex-1 font-sans">{tab.title || tab.url}</span>

              {/* Status Badge */}
              {isRunning && (
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
              )}
              {isDone && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}

              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onNewTab}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
          title="Open New AI Browser Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
