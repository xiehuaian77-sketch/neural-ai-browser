# Deployment Guide

> ✅ **Vercel 已上线**：[https://ai-browser-glgme67e2-xiehuaian77-7548s-projects.vercel.app](https://ai-browser-glgme67e2-xiehuaian77-7548s-projects.vercel.app)

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

### Step 1: Create a New Space (Web UI)

1. Open https://huggingface.co/new
2. **Owner**: select your username (e.g. `xiehuaian77-sketch`)
3. **Space name**: `neural-ai-browser`
4. **License**: `mit`
5. **Space SDK**: select **Docker**
6. **Visibility**: Public
7. Click **"Create Space"**

> **Screenshot tip**: Capture the "Create a new Space" form with all fields filled.

### Step 2: Configure Space Settings

1. Go to your new Space: https://huggingface.co/spaces/YOUR_USERNAME/neural-ai-browser
2. Click **"Settings"** tab
3. Scroll to **"Docker image"** section:
   - Ensure **"Dockerfile"** is selected (not "Docker image URL")
   - This is the default when you chose "Docker" SDK
4. Scroll to **"Secrets and variables"** → **"Repository secrets"**:
   - Click **"New secret"**
   - Add the following secrets (optional, for real AI responses):
     - `GEMINI_API_KEY` → your Gemini API key
     - `OPENAI_API_KEY` → your OpenAI API key  
     - `DEEPSEEK_API_KEY` → your DeepSeek API key
     - `OPENAI_BASE_URL` → custom endpoint (if using OpenAI-compatible API)
   - Click **"Add"** for each

> **Screenshot tip**: 
> - Capture the Settings page showing "Dockerfile" selected
> - Capture the Secrets section with at least one secret added

> **Note**: Without any API keys, the Space will still run in `DEMO_MODE` (mock responses).

### Step 3: Push Code to HuggingFace Spaces

**Option A: Using Git (Recommended)**

```bash
cd D:/31986/Documents/ai-browser

# Add HF Space as a remote (replace YOUR_USERNAME)
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/neural-ai-browser

# Push the main branch to HF Space
git subtree push --prefix . hf main
```

**Option B: Using HF CLI**

```bash
# Install HF CLI
pip install -U huggingface_hub

# Login (paste your token)
hf auth login

# Clone your empty Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/neural-ai-browser
cd neural-ai-browser

# Copy all files from your local repo
cp -r D:/31986/Documents/ai-browser/* .

# Commit and push
git add -A
git commit -m "deploy: initial deployment"
git push
```

### Step 4: Monitor Build & Verify Deployment

1. Go to your Space URL
2. Click **"Builds"** tab to see build logs
3. Wait for build to complete (usually 2-5 minutes)
4. Click **"App"** tab to see the running app
5. Verify:
   - Health check: visit `https://YOUR_USERNAME-neural-ai-browser.hf.space/api/health`
   - Should return JSON with providers list
   - Port `7860` is proxied by HF Spaces automatically

> **Screenshot tip**: 
> - Capture the "Builds" tab showing successful build
> - Capture the "App" tab showing the running UI

### Step 5: Update README with Live URL

Once deployed, update your README.md with the actual Space URL:

```markdown
[![HuggingFace Spaces](https://img.shields.io/badge/HuggingFace-Spaces-blue)](https://huggingface.co/spaces/YOUR_USERNAME/neural-ai-browser)
```

### Updating the Space

```bash
# Make changes locally, then:
git add -A && git commit -m "update: description"
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
