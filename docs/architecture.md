# Architecture

## Overview

Neural AI Browser is a React frontend + Express backend app for visualizing web pages and running AI agent tasks.

## Frontend

- Entry: `src/main.tsx` -> `src/App.tsx`
- UI: Tailwind CSS, Lucide icons, Motion
- Views: `VisualCanvas`, `NeuralView`, `AgentPanel`
- State: React useState + localStorage for memory

## Backend

- Entry: `server.ts`
- Unified chat: `POST /api/chat`
- Legacy page parsing: `POST /api/gemini/parse-page`
- Agent step planner: `POST /api/gemini/agent-step`
- Knowledge synthesis: `POST /api/gemini/synthesize-knowledge`
- Models list: `GET /api/models`

## Data Model

- `WebPageData`: parsed page representation
- `BrowserTab`: tab state including pageData, steps, agent status
- `KnowledgeItem`: memory graph entries persisted in localStorage
- `SwarmTask`: async multi-page crawl tasks
