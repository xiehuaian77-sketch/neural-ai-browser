import React from 'react';
import {
  Bot,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowRight,
  FileSpreadsheet,
  BrainCircuit,
  Play,
  Download,
  FileJson,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { AgentStep, AgentStatus } from '../types';

interface AgentPanelProps {
  agentTask: string;
  setAgentTask: (task: string) => void;
  agentStatus: AgentStatus;
  steps: AgentStep[];
  onRunAutoLoop: () => void;
  onStepNext: () => void;
  onResetAgent: () => void;
  onSynthesize: () => void;
  synthesizedReport?: string | null;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  agentTask,
  setAgentTask,
  agentStatus,
  steps,
  onRunAutoLoop,
  onStepNext,
  onResetAgent,
  onSynthesize,
  synthesizedReport,
}) => {
  const isRunning = agentStatus === 'navigating' || agentStatus === 'analyzing' || agentStatus === 'executing';
  const [copied, setCopied] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  const exportSteps = (format: 'markdown' | 'json') => {
    if (steps.length === 0) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'markdown') {
      content = `# Agent Reasoning Chain\n\n**Goal**: ${agentTask}\n**Total Steps**: ${steps.length}\n**Status**: ${agentStatus}\n\n---\n\n`;
      steps.forEach((step) => {
        content += `## Step ${step.stepNumber}\n\n`;
        content += `**Time**: ${step.timestamp}\n\n`;
        content += `**Thought**: ${step.thought}\n\n`;
        content += `**Action**: ${step.action.type} - ${step.action.targetDescription || ''}\n\n`;
        if (step.resultSummary) {
          content += `**Result**: ${step.resultSummary}\n\n`;
        }
        content += `---\n\n`;
      });
      filename = `agent-reasoning-${Date.now()}.md`;
      mimeType = 'text/markdown';
    } else {
      const data = {
        goal: agentTask,
        status: agentStatus,
        exportedAt: new Date().toISOString(),
        steps: steps,
      };
      content = JSON.stringify(data, null, 2);
      filename = `agent-reasoning-${Date.now()}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const copyToClipboard = async () => {
    if (steps.length === 0) return;
    const text = steps.map((s) => `Step ${s.stepNumber}: ${s.thought}\nAction: ${s.action.type}`).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none font-sans text-slate-200">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-sm text-slate-100">AI Agent Autopilot</span>
        </div>

        <div className="flex items-center space-x-1">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
              agentStatus === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isRunning
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {agentStatus}
          </span>
        </div>
      </div>

      {/* Goal Prompt Area */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Agent Mission Goal</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </label>

        <textarea
          value={agentTask}
          onChange={(e) => setAgentTask(e.target.value)}
          placeholder="Describe what you want the AI Browser to find, extract, or automate..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono resize-none"
        />

        {/* Quick Goal Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            'Extract paper innovations & metrics',
            'Compare live GPU spot rates',
            'Summarize API endpoints & schemas',
            'Extract all key entities & prices',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAgentTask(preset)}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 transition border border-slate-700/80 font-mono truncate max-w-[200px]"
            >
              + {preset}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={onRunAutoLoop}
            disabled={isRunning || !agentTask.trim()}
            className="flex-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Autonomous Loop</span>
              </>
            )}
          </button>

          <button
            onClick={onStepNext}
            disabled={isRunning || !agentTask.trim()}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-700 text-slate-300 hover:text-white font-medium text-xs transition border border-slate-700"
            title="Execute Single Step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetAgent}
            className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition border border-slate-700"
            title="Reset Agent State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step Timeline Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-mono text-xs">
        <div className="text-slate-400 text-[11px] font-sans font-semibold flex items-center justify-between">
          <span>Agent Step Logs ({steps.length})</span>
          <span className="flex items-center space-x-2">
            {steps.length > 0 && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
                    title="Export steps"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 min-w-[140px]">
                      <button
                        onClick={() => exportSteps('markdown')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Export as Markdown</span>
                      </button>
                      <button
                        onClick={() => exportSteps('json')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition"
                      >
                        <FileJson className="w-3 h-3" />
                        <span>Export as JSON</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </>
            )}
          </span>
        </div>

        {steps.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-sans text-xs space-y-2">
            <Bot className="w-8 h-8 text-slate-700 mx-auto" />
            <p>Ready to launch agent session.</p>
            <p className="text-[11px] text-slate-600">Enter a goal and click Run Autonomous Loop.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.stepNumber}
                className={`relative p-3 rounded-lg border transition ${
                  step.status === 'active'
                    ? 'bg-sky-950/80 border-sky-500/80 shadow-md ring-1 ring-sky-500'
                    : step.status === 'done'
                    ? 'bg-slate-950/90 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500'
                }`}
              >
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-full w-px h-3 bg-slate-700" />
                )}

                {/* Step Header */}
                <div className="flex items-center justify-between mb-1.5 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sky-400">STEP {step.stepNumber}</span>
                    <span className="text-slate-500">[{step.timestamp}]</span>
                  </div>

                  {step.action.targetNodeId && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                      #{step.action.targetNodeId}
                    </span>
                  )}
                </div>

              {/* Thought Reasoning */}
              <div className="text-slate-300 font-sans text-xs leading-relaxed mb-2 bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-sky-400 font-bold font-mono text-[10px] block mb-0.5">
                  REASONING:
                </span>
                <span className={step.status === 'active' ? 'streaming-text' : ''}>{step.thought}</span>
                {step.status === 'active' && <span className="inline-block w-1.5 h-3.5 bg-sky-400 ml-0.5 animate-pulse align-middle" />}
              </div>

                {/* Action Executed */}
                <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-1 border-t border-slate-800/80 font-sans font-medium">
                  <span className="capitalize">
                    ⚡ Action: {step.action.type} ({step.action.targetDescription})
                  </span>
                  {step.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                {step.resultSummary && (
                  <p className="mt-1.5 text-[11px] text-slate-400 font-sans italic bg-slate-900/40 p-1.5 rounded">
                    Result: {step.resultSummary}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Synthesize Button & Report Box */}
        {steps.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onSynthesize}
              className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow font-sans"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Synthesize Knowledge Report</span>
            </button>

            {synthesizedReport && (
              <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-indigo-500/30 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                <div className="font-bold text-indigo-400 mb-1 border-b border-indigo-500/20 pb-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesized Knowledge Output</span>
                </div>
                {synthesizedReport}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
