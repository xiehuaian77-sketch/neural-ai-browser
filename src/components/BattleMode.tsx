import { useState, useCallback } from 'react';
import { BattleResponse, BattleVote } from '../types';
import { ThumbsUp, ThumbsDown, Minus, RefreshCw, Trophy } from 'lucide-react';

interface BattleModeProps {
  question: string;
  onQuestionChange: (question: string) => void;
  sideA: { provider: string; model: string };
  sideB: { provider: string; model: string };
  onSideAChange: (side: { provider: string; model: string }) => void;
  onSideBChange: (side: { provider: string; model: string }) => void;
  providers: { id: string; name: string; defaultModel: string; models: { id: string; name: string }[] }[];
}

const VOTE_STORAGE_KEY = 'ai-browser-battle-votes';

export const BattleMode: React.FC<BattleModeProps> = ({
  question,
  onQuestionChange,
  sideA,
  sideB,
  onSideAChange,
  onSideBChange,
  providers,
}) => {
  const [result, setResult] = useState<BattleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vote, setVote] = useState<BattleVote | null>(() => {
    try {
      const saved = localStorage.getItem(VOTE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const handleVote = useCallback((side: 'A' | 'B' | 'tie') => {
    const newVote: BattleVote = { side, timestamp: new Date().toISOString() };
    setVote(newVote);
    try {
      localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(newVote));
    } catch {}
  }, []);

  const handleBattle = async () => {
    if (!question.trim() || !sideA.provider || !sideB.provider) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setVote(null);

    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          sideA,
          sideB,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Battle failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to run battle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100">
      {/* Battle Header / Controls */}
      <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Battle Mode
            </h2>
            <span className="text-xs text-slate-500 font-mono">Dual-Model Comparison</span>
          </div>
          {result && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Total:</span>
              <span className="text-sm font-mono text-amber-400">{result.totalLatencyMs}ms</span>
            </div>
          )}
        </div>

        {/* Question Input */}
        <div className="mb-3">
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Enter a question to battle two models..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition"
            onKeyDown={(e) => e.key === 'Enter' && handleBattle()}
          />
        </div>

        {/* Model Selectors */}
        <div className="flex items-center space-x-3 mb-3">
          {/* Side A */}
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-medium">Model A</label>
            <div className="flex space-x-2">
              <select
                value={sideA.provider}
                onChange={(e) => {
                  const provider = providers.find(p => p.id === e.target.value);
                  onSideAChange({
                    provider: e.target.value,
                    model: provider?.defaultModel || '',
                  });
                }}
                className="flex-1 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none focus:border-sky-500/50"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={sideA.model}
                onChange={(e) => onSideAChange({ ...sideA, model: e.target.value })}
                className="flex-1 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none focus:border-sky-500/50"
              >
                {providers.find(p => p.id === sideA.provider)?.models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-slate-600 font-bold text-lg pt-5">VS</div>

          {/* Side B */}
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-medium">Model B</label>
            <div className="flex space-x-2">
              <select
                value={sideB.provider}
                onChange={(e) => {
                  const provider = providers.find(p => p.id === e.target.value);
                  onSideBChange({
                    provider: e.target.value,
                    model: provider?.defaultModel || '',
                  });
                }}
                className="flex-1 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none focus:border-rose-500/50"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={sideB.model}
                onChange={(e) => onSideBChange({ ...sideB, model: e.target.value })}
                className="flex-1 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none focus:border-rose-500/50"
              >
                {providers.find(p => p.id === sideB.provider)?.models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Battle Button */}
        <button
          onClick={handleBattle}
          disabled={isLoading || !question.trim() || !sideA.provider || !sideB.provider}
          className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium rounded-lg transition flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Battling...</span>
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4" />
              <span>Start Battle</span>
            </>
          )}
        </button>
      </div>

      {/* Results Area */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-rose-400 mb-2">Battle failed</div>
            <div className="text-sm text-slate-500">{error}</div>
          </div>
        </div>
      )}

      {!result && !error && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Enter a question and click "Start Battle" to compare two models</p>
          </div>
        </div>
      )}

      {result && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-800 overflow-hidden">
          {/* Side A */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-sky-500/10 border-b border-sky-500/20 px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-sky-300">{result.sideA.providerName}</div>
                  <div className="text-xs text-slate-500 font-mono">{result.sideA.modelName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Latency</div>
                  <div className="text-sm font-mono text-sky-400">{result.sideA.latencyMs}ms</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="prose prose-invert max-w-none">
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.sideA.text}
                </div>
              </div>
            </div>
            {result.sideA.error && (
              <div className="flex-shrink-0 bg-rose-500/10 border-t border-rose-500/20 px-4 py-2">
                <div className="text-xs text-rose-400">{result.sideA.error}</div>
              </div>
            )}
          </div>

          {/* Side B */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-rose-500/10 border-b border-rose-500/20 px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-rose-300">{result.sideB.providerName}</div>
                  <div className="text-xs text-slate-500 font-mono">{result.sideB.modelName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Latency</div>
                  <div className="text-sm font-mono text-rose-400">{result.sideB.latencyMs}ms</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="prose prose-invert max-w-none">
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.sideB.text}
                </div>
              </div>
            </div>
            {result.sideB.error && (
              <div className="flex-shrink-0 bg-rose-500/10 border-t border-rose-500/20 px-4 py-2">
                <div className="text-xs text-rose-400">{result.sideB.error}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voting Bar */}
      {result && !result.sideA.error && !result.sideB.error && (
        <div className="flex-shrink-0 border-t border-slate-800 bg-slate-900/80 p-3">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-xs text-slate-500 mr-2">Vote:</span>
            <button
              onClick={() => handleVote('A')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                vote?.side === 'A'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-sky-300 hover:bg-sky-500/10'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">A</span>
            </button>
            <button
              onClick={() => handleVote('tie')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                vote?.side === 'tie'
                  ? 'bg-slate-600 text-white shadow-lg shadow-slate-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Tie</span>
            </button>
            <button
              onClick={() => handleVote('B')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                vote?.side === 'B'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">B</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
