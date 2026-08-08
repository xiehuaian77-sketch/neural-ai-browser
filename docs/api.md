# API Reference

## GET /api/health

Returns service health and available provider ids.

## GET /api/models

Returns configured providers and available models.

## POST /api/chat

Unified chat endpoint.

Body:
- `provider`: provider id
- `model`: model id
- `messages`: chat messages
- `systemInstruction`: optional system prompt
- `responseMimeType`: optional output format
- `temperature`: optional

## POST /api/gemini/parse-page

Legacy page parser.

Body:
- `url`
- `goal`
- `provider` (default `gemini`)
- `model` (optional)

## POST /api/gemini/agent-step

Legacy agent step planner.

Body:
- `currentUrl`
- `goal`
- `domNodes`
- `previousSteps`

## POST /api/gemini/synthesize-knowledge

Legacy knowledge synthesis.

Body:
- `pages`
- `goal`
