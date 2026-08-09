# Neural AI Browser —  launch content

> Use these as-is or tweak before posting.

---

## Product Hunt

**Tagline**
An open-source AI browser that lets multiple LLMs see, parse, and act on real web pages — side by side.

**Description**
Neural AI Browser gives LLMs a real browser. It loads a page, parses the DOM, and feeds structured content to models like DeepSeek, Gemini, OpenAI, and Qwen so they can reason over live web data instead of training-cutoff text.

Key features:
- Live page parsing + semantic DOM extraction
- Multi-model support with a unified chat interface
- Battle Mode: run two models head-to-head on the same question
- Streaming responses, history, and memory
- Deploy anywhere: Docker, HuggingFace Spaces, or Vercel

It’s local-first, open-source, and demo-ready out of the box.

**First comment**
Why I built this:
Most AI tools today still treat the web as text. Neural AI Browser treats the web as a structured environment an agent can actually read and act on.

The goal was simple: give any LLM a browser, not just a chat window.

If you want to try it without configuring API keys, use the live demo in DEMO_MODE.

---

## Hacker News (Show HN)

**Title**
Show HN: Neural AI Browser – give any LLM a real browser

**Body**
I built an open-source browser stack that lets multiple LLMs perceive, navigate, and reason about live web pages.

What it does:
- Loads real pages and extracts structured DOM/semantic data
- Supports DeepSeek, OpenAI, Gemini, Qwen, GLM, Kimi through a unified interface
- Battle Mode runs two models in parallel so you can compare answers directly
- SSE streaming, chat history, and memory
- Deployable as Docker, HuggingFace Space, or Vercel

Why I think this matters:
Current agent workflows mostly feed models static text or limited tool outputs. This project gives the model browser-native context, which changes what “grounded” answers look like.

Repo: https://github.com/xiehuaian77-sketch/neural-ai-browser
Demo: https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser

Happy to answer questions about the architecture, provider adapters, or browser automation approach.

---

## 小红书

**标题**
开源了一个能让 AI 真正“上网”的浏览器

**正文**
最近做了一个有意思的开源项目：Neural AI Browser。

简单说，就是给大模型配了一个真正的浏览器内核，而不是只给一段网页文本。

它能做什么：
- 自动读取网页结构，把 DOM 变成模型能理解的语义数据
- 支持 DeepSeek、Gemini、OpenAI、通义千问等多个模型
- Battle Mode 可以同时跑两个模型 PK，看谁回答得更好
- 支持流式输出、多轮对话、记忆
-  Docker / HuggingFace / Vercel 一键部署

我觉得最有价值的点是：很多 AI 工具现在还在“猜”网页内容，但这个项目让模型真的“看到”了页面结构。

GitHub：https://github.com/xiehuaian77-sketch/neural-ai-browser

欢迎 Star、提 Issue、一起改。

#AI #开源 #大模型 #浏览器 #AIAgent #DeepSeek #Gemini #Vercel

---

## 即刻 / 朋友圈短文案

把浏览器给 AI，不是给网页截图，而是给结构化 DOM。
Neural AI Browser 开源了：
https://github.com/xiehuaian77-sketch/neural-ai-browser

Battle Mode + 多模型 + Docker 一键部署。
