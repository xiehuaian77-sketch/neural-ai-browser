# Contributing to Neural AI Browser

Thank you for your interest in contributing! This document describes the workflow and standards for this repository.

## Ways to Contribute

- Report bugs or request features via Issues
- Improve documentation or code comments
- Submit bug fixes and improvements via Pull Requests
- Add new providers/models in `server.ts` and update frontend selectors

## Setup

```bash
git clone https://github.com/your-org/neural-ai-browser.git
cd neural-ai-browser
cp .env.example .env
npm install
npm run lint
```

## Branching

- Create a branch from `main`
- Use descriptive names: `fix/agent-crash`, `feat/add-minimax-provider`, `docs/readme-screenshots`
- Keep PRs focused; avoid mixing unrelated changes

## Commits

Use Conventional Commits style where possible:

```
feat: add MiniMax provider support
fix: avoid white screen when pageData is undefined
docs: update README quick start
chore: upgrade vite to 6.2.3
```

## Pull Requests

- Keep changes minimal and reviewable
- Ensure `npm run lint` passes
- Update README or docs when behavior changes
- Link related issues in the PR description

## Code of Conduct

Be respectful and constructive. harassment, trolling, or exclusionary behavior is not acceptable.
