# Deployment Guide

This project is ready to deploy to **HuggingFace Spaces** or **Vercel**. Choose one platform and follow the steps below.

---

## Option A: HuggingFace Spaces (Recommended)

HuggingFace Spaces is the best first choice because:
- Free GPU/CPU for small traffic
- Built-in community discovery
- Supports Docker runtime
- One-click `docker push` deployment

### Prerequisites
- A HuggingFace account: https://huggingface.co/join
- A HuggingFace token with `write` permission: https://huggingface.co/settings/tokens

### Step 1: Install / Update HF CLI

```bash
# Windows (PowerShell)
winget install -e --id HuggingFace.HuggingFaceCli

# Or via pip
pip install -U huggingface_hub
```

### Step 2: Login to HuggingFace

```bash
hf auth login
# Paste your HF token when prompted
```

### Step 3: Create a New Space

```bash
# Create a new Space named "neural-ai-browser"
hf repo create neural-ai-browser --type space --space_sdk docker
```

### Step 4: Configure Space Settings

1. Go to https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser/settings
2. Under **"Docker image"**, ensure `Dockerfile` is selected
3. Under **"Secrets and variables"**, add the following secrets:
   - `GEMINI_API_KEY` (optional, for Gemini)
   - `OPENAI_API_KEY` (optional, for OpenAI)
   - `DEEPSEEK_API_KEY` (optional, for DeepSeek)
   - `OPENAI_BASE_URL` (optional, if using a custom OpenAI-compatible endpoint)

> Note: Without any API keys, the Space will still run in `DEMO_MODE` (mock responses).

### Step 5: Push to HuggingFace Spaces

```bash
cd D:/31986/Documents/ai-browser

# Add HF Space as a remote
git remote add hf https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser

# Push the main branch to HF Space
git subtree push --prefix . hf main
```

### Step 6: Verify Deployment

1. Open https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser
2. Click **"App"** tab to see the running app
3. The health check endpoint is `/api/health`
4. Default port is `7860` (HF Spaces will proxy it)

### Updating the Space

```bash
# Make changes locally, then:
git add -A && git commit -m "update"
git subtree push --prefix . hf main
```

---

## Option B: Vercel

Vercel is better for:
- High-traffic production deployments
- Edge functions and global CDN
- Zero-config Next.js / Node.js support
- Custom domains

### Prerequisites
- A Vercel account: https://vercel.com/signup
- Vercel CLI: `npm i -g vercel`

### Step 1: Login to Vercel

```bash
vercel login
```

### Step 2: Import Project

```bash
cd D:/31986/Documents/ai-browser

# Link to existing Vercel project or create new one
vercel link

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

1. Go to https://vercel.com/xiehuaian77-sketch/neural-ai-browser/settings/environment-variables
2. Add the following variables (same as HF Spaces):
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - `DEEPSEEK_API_KEY`
   - `OPENAI_BASE_URL`
   - `DEMO_MODE` (set to `true` for demo mode)

### Step 4: Redeploy After Env Changes

```bash
vercel --prod
```

---

## Option C: Docker (Self-Hosted)

### Build Image

```bash
cd D:/31986/Documents/ai-browser

# Build production image
docker build -t neural-ai-browser:latest .

# Run locally
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  -e DEMO_MODE=false \
  neural-ai-browser:latest
```

### Push to Docker Hub

```bash
# Tag image
docker tag neural-ai-browser:latest yourname/neural-ai-browser:latest

# Push
docker push yourname/neural-ai-browser:latest
```

---

## Post-Deployment Checklist

- [ ] Update `README.md` with actual deployment URLs:
  - `https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser`
  - `https://neural-ai-browser.vercel.app` (or your Vercel domain)
- [ ] Update `package.json` with actual repository URL:
  - `"repository.url": "https://github.com/xiehuaian77-sketch/neural-ai-browser"`
- [ ] Update `.env` with production API keys (do NOT commit `.env`)
- [ ] Test the deployed app:
  - [ ] Homepage loads
  - [ ] Chat works with at least one provider
  - [ ] Battle Mode works
  - [ ] `/api/health` returns 200
- [ ] Enable GitHub Discussions for community
- [ ] Pin the repo to your GitHub profile

---

## Troubleshooting

### HF Spaces: "Build Failed"
- Check the **"Logs"** tab in HF Space settings
- Ensure `Dockerfile` uses `EXPOSE 7860` (HF default)
- Ensure `PORT` env var is respected

### HF Spaces: "App Crashed"
- Check `/api/health` endpoint exists and returns 200
- Ensure `node dist/server.cjs` starts without errors
- Check memory limits (HF free tier: 2GB RAM)

### Vercel: "Function Timeout"
- Increase timeout in `vercel.json`:
  ```json
  { "functions": { "dist/server.cjs": { "maxDuration": 30 } } }
  ```

### Vercel: "Build Failed"
- Ensure `npm run build` works locally
- Check Node.js version (Vercel uses Node 18+)
- Ensure `esbuild` is in `dependencies`, not `devDependencies`

---

## Need Help?

- Open a [GitHub Issue](https://github.com/xiehuaian77-sketch/neural-ai-browser/issues)
- Join [GitHub Discussions](https://github.com/xiehuaian77-sketch/neural-ai-browser/discussions)
