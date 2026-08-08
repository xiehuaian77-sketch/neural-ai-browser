# Neural AI Browser

An AI-native web browser engineered for autonomous AI agents to perceive, navigate, parse, and automate web tasks using multiple LLM providers through a unified `/api/chat` interface.

## Features

- **Multi-Model Chat Proxy**: Unified `/api/chat` endpoint supporting Google Gemini, OpenAI, DeepSeek, Qwen, GLM, Kimi, Yi, Baichuan, and MiniMax.
- **Neural Perception Engine**: Prunes HTML layout wrappers into a clean, semantic tree.
- **Dual Visual & Neural Canvas**: Toggle between rendered web view and AI-readable semantic node graph.
- **Autonomous Agent Autopilot**: Step-by-step reasoning loop powered by configurable LLMs.
- **Persistent Memory Graph**: Agent memory store for extracted entities and structured summaries.

---

## Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm** or compatible package manager

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in at least one provider API key:

```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with tsx |
| `npm run build` | Build frontend + bundle server |
| `npm run start` | Run production server |
| `npm run lint` | TypeScript type check |
| `npm run preview` | Preview built assets |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_BASE_URL` | OpenAI-compatible base URL |
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `DEEPSEEK_BASE_URL` | DeepSeek base URL |
| `QWEN_API_KEY` | 阿里云 Qwen API key |
| `QWEN_BASE_URL` | 阿里云 Qwen base URL |
| `GLM_API_KEY` | 智谱 GLM API key |
| `GLM_BASE_URL` | 智谱 GLM base URL |
| `MOONSHOT_API_KEY` | Moonshot/Kimi API key |
| `MOONSHOT_BASE_URL` | Moonshot base URL |
| `YI_API_KEY` | 零一万物 Yi API key |
| `YI_BASE_URL` | 零一万物 Yi base URL |
| `BAICHUAN_API_KEY` | 百川智能 API key |
| `BAICHUAN_BASE_URL` | 百川智能 base URL |
| `MINIMAX_API_KEY` | MiniMax API key |
| `MINIMAX_BASE_URL` | MiniMax base URL |
| `PORT` | Server port (default: 3000) |
| `HOST` | Server bind address (default: 127.0.0.1) |
| `NODE_ENV` | Environment (development/production) |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons, Motion
- **Backend**: Express, tsx, esbuild
- **AI SDKs**: @google/genai, openai

---

## Project Structure

```
.
├── src/
│   ├── App.tsx
│   ├── types.ts
│   ├── components/
│   └── ...
├── server.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## License

MIT

