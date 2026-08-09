import React, { useState, useCallback } from 'react';
import { AgentStep } from '../types';
import { Brain, GitBranch, CheckCircle2, XCircle, Loader2, Download, Copy, Check } from 'lucide-react';

interface ChainOfThoughtVisualizerProps {
  steps: AgentStep[];
  isRunning: boolean;
}

export const ChainOfThoughtVisualizer: React.FC<ChainOfThoughtVisualizerProps> = ({ steps, isRunning }) => {
  const [copied, setCopied] = useState(false);

  const exportAsMarkdown = useCallback(() => {
    const md = steps.map((step) => {
      const status = step.status === 'done' ? '✅' : step.status === 'active' ? '🔄' : step.status === 'failed' ? '❌' : '⏳';
      return `${status} **Step ${step.stepNumber}** [${step.timestamp}]
\`\`\`
Thought: ${step.thought}
Action: ${step.action.type}${step.action.targetDescription ? ` → ${step.action.targetDescription}` : ''}
${step.resultSummary ? `Result: ${step.resultSummary}` : ''}
\`\`\``;
    }).join('\n\n');

    downloadFile(md, 'chain-of-thought.md', 'text/markdown');
  }, [steps]);

  const exportAsJSON = useCallback(() => {
    const json = JSON.stringify(steps, null, 2);
    downloadFile(json, 'chain-of-thought.json', 'application/json');
  }, [steps]);

  const copyToClipboard = useCallback(async () => {
    const text = steps.map((step) => `Step ${step.stepNumber}: ${step.thought}`).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [steps]);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="text-center space-y-3">
          <Brain className="w-12 h-12 mx-auto text-slate-700" />
          <p className="text-sm">No reasoning steps yet.</p>
          <p className="text-xs text-slate-600">Run an agent task to see the chain of thought.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header with export buttons */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-sky-400" />
            <span>Chain of Thought Visualization</span>
            <span className="text-xs font-mono text-slate-500">({steps.length} steps)</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={exportAsMarkdown}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={exportAsJSON}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.stepNumber} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-slate-700" />
              )}

              <div className="flex items-start space-x-4">
                {/* Step indicator */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step.status === 'done'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : step.status === 'active'
                      ? 'bg-sky-500/20 border-sky-500 text-sky-400 animate-pulse'
                      : step.status === 'failed'
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : step.status === 'active' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : step.status === 'failed' ? (
                    <XCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.stepNumber}</span>
                  )}
                </div>

                {/* Step content with streaming animation */}
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-sky-400">STEP {step.stepNumber}</span>
                      <span className="text-xs text-slate-500">{step.timestamp}</span>
                    </div>

                    {/* Thought bubble with streaming effect */}
                    <div className="mb-3 p-3 bg-slate-950 rounded border border-slate-800">
                      <div className="text-xs font-bold text-amber-400 mb-1 flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>THOUGHT</span>
                        {step.status === 'active' && isRunning && (
                          <span className="ml-2 flex space-x-1">
                            <span className="w-1 h-3 bg-amber-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-3 bg-amber-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-3 bg-amber-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                          </span>
                        )}
                      </div>
                      <p className={`text-sm text-slate-300 leading-relaxed ${step.status === 'active' && isRunning ? 'animate-pulse' : ''}`}>
                        {step.thought}
                      </p>
                    </div>

                    {/* Action badge */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
                        {step.action.type}
                      </span>
                      {step.action.targetDescription && (
                        <span className="text-xs text-slate-400">{step.action.targetDescription}</span>
                      )}
                    </div>

                    {/* Result */}
                    {step.resultSummary && (
                      <div className="mt-2 p-2 bg-slate-950/50 rounded border border-slate-800/50">
                        <span className="text-xs font-bold text-emerald-400 block mb-0.5">RESULT:</span>
                        <p className="text-xs text-slate-400 italic">{step.resultSummary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};