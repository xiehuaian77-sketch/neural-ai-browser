import React, { useState } from 'react';
import { SwarmTask } from '../types';
import { X, Layers, Bot, Plus, Sparkles } from 'lucide-react';

interface SwarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchSwarm: (tasks: { url: string; goal: string }[]) => void;
  swarmTasks: SwarmTask[];
}

export const SwarmModal: React.FC<SwarmModalProps> = ({
  isOpen,
  onClose,
  onDispatchSwarm,
  swarmTasks,
}) => {
  const [taskInputs, setTaskInputs] = useState<Array<{ url: string; goal: string }>>([
    { url: 'https://arxiv.org/abs/2608.01234', goal: 'Extract paper abstract and performance metrics' },
    { url: 'https://cloud-pricing.ai/gpu-matrix', goal: 'Extract lowest GPU spot pricing rates' },
    { url: 'https://docs.agentic-web.dev/api/v2', goal: 'Summarize API endpoints for headless DOM' },
  ]);

  if (!isOpen) return null;

  const handleAddField = () => {
    setTaskInputs([...taskInputs, { url: '', goal: '' }]);
  };

  const handleUpdateField = (index: number, field: 'url' | 'goal', value: string) => {
    const updated = [...taskInputs];
    updated[index][field] = value;
    setTaskInputs(updated);
  };

  const handleRunSwarm = () => {
    const valid = taskInputs.filter((t) => t.url.trim() && t.goal.trim());
    if (valid.length > 0) {
      onDispatchSwarm(valid);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="font-bold text-base">Multi-Agent Swarm Orchestration</h2>
              <p className="text-xs text-slate-400 font-mono">
                Dispatch parallel AI worker threads to crawl, parse, and synthesize multiple websites asynchronously
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Configure Parallel Swarm Agents ({taskInputs.length} Active Targets)</span>
              <button
                onClick={handleAddField}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Target</span>
              </button>
            </div>

            {taskInputs.map((input, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-slate-400 font-bold">
                  <span className="text-purple-400 flex items-center space-x-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Agent Worker #{idx + 1}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Target URL..."
                    value={input.url}
                    onChange={(e) => handleUpdateField(idx, 'url', e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="text"
                    placeholder="Specific Sub-Goal..."
                    value={input.goal}
                    onChange={(e) => handleUpdateField(idx, 'goal', e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Active Swarm Tasks Progress */}
          {swarmTasks.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-purple-400 font-mono block">
                Swarm Dispatch Status
              </span>

              {swarmTasks.map((st) => (
                <div
                  key={st.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{st.assignedAgentName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        st.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30 animate-pulse'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>

                  <p className="text-slate-400 font-sans">{st.taskGoal}</p>

                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-purple-500 h-full transition-all duration-500"
                      style={{ width: `${st.progress}%` }}
                    />
                  </div>

                  {st.resultSummary && (
                    <div className="text-[11px] text-emerald-300 font-sans bg-slate-900 p-2 rounded border border-slate-800">
                      Result: {st.resultSummary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={handleRunSwarm}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Parallel Swarm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
