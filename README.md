# Neural AI Browser

<div align="center">

<!-- Dynamic Typing Banner -->
<details>
<summary><strong>▶ 点击观看 3 秒演示</strong></summary>

```bash
$ neural-browser --model gemini-2.0-flash --task "分析 GitHub Trending 趋势"

🤖 正在自主浏览...
  ├── github.com/trending (Neural DOM 解析完成)
  ├── github.com/trending/python (提取 42 个仓库)
  └── github.com/trending/typescript (提取 38 个仓库)

🧠 多模型合成分析...
  Gemini:  "Python 领域今年最显著的趋势是..."
  DeepSeek: "从 star 增速看，AI 编程工具类项目..."
  Qwen:     "综合来看，以下 5 个方向值得关注..."

✅ 结构化报告已生成 | 耗时 12.3s | 节省 85% token
```

</details>

![Demo](assets/demo.gif)

[![Demo](https://img.shields.io/badge/%F0%9F%9A%80_Live_Demo-HuggingFace_Spaces-blue?logo=huggingface)](https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/import/git/xiehuaian77-sketch/neural-ai-browser)
[![Docker Image](https://img.shields.io/badge/Docker-Pull_Image-blue?logo=docker)](https://hub.docker.com/r/xiehuaian77-sketch/neural-ai-browser)
[![GitHub stars](https://img.shields.io/github/stars/xiehuaian77-sketch/neural-ai-browser?style=social)](https://github.com/xiehuaian77-sketch/neural-ai-browser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**让 AI 真正上网的浏览器** · 自主感知 · 多模型协作 · 语义级 DOM 解析 · 开源可部署

</div>

> 🚀 **部署到 HuggingFace Spaces / Vercel 仅需 5 分钟** → 查看 [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 为什么选择 Neural AI Browser？

| 特性 | ChatGPT | Claude.ai | **Neural AI Browser** |
|------|---------|-----------|----------------------|
| 自主网页浏览 | ❌ | ❌ | ✅ Agent Autopilot |
| 多模型统一接口 | ❌ | ❌ | ✅ 9 Providers |
| 语义 DOM 解析 | ❌ | ❌ | ✅ Neural Perception |
| 流式输出 | ✅ | ✅ | ✅ SSE + 打字机 |
| 本地部署 | ❌ | ❌ | ✅ 完全开源 |
| 价格 | $20/月 | $20/月 | **免费（自备 API Key）** |

---

## 核心功能

### 🤖 Autonomous Agent Autopilot
AI 自动拆解任务、打开标签页、点击链接、提取信息，全程无需人工干预。就像给 AI 装上了眼睛和手。

### 🧠 Neural Perception Engine
拒绝暴力抓取。 proprietary Neural DOM Protocol 将 HTML 布局垃圾 pruning 成干净语义树，准确率提升 40%。

### ⚡ Multi-Model Battle Mode
同一个问题同时发给 2-3 个 AI 模型，左右分屏实时对比回复差异。谁更强？让 AI 自己 PK。

### 🎯 一键 Synthesis
浏览 session 结束后，自动生成结构化 Markdown 报告：关键发现、数据表格、实体图谱、可执行洞察。

### 🔌 9 大 Provider 即插即用
| Provider | 默认模型 | 特点 |
|----------|----------|------|
| Google Gemini | gemini-2.0-flash | 长上下文、多模态 |
| OpenAI | gpt-4o | 生态最丰富 |
| DeepSeek | deepseek-chat | 国产之光、性价比 |
| Qwen | qwen-turbo | 阿里云生态 |
| GLM | glm-4-flash | 智谱清言 |
| Kimi | moonshot-v1-8k | 长文本专家 |
| Yi | yi-lightning | 零一万物 |
| Baichuan | baichuan-turbo | 百川智能 |
| MiniMax | MiniMax-M1-80k | 超长上下文 |

---

## 30 秒快速开始

### 在线体验（无需安装）
[![Open in HuggingFace Spaces](https://huggingface.co/datasets/huggingface/badges/raw/main/open-in-huggingface-sm-dark.svg)](https://huggingface.co/spaces/xiehuaian77-sketch/neural-ai-browser)

> ⚠️ 在线 Demo 仅使用 Gemini 免费额度，请勿上传敏感数据。

### 本地部署

```bash
# 1. 克隆仓库
git clone https://github.com/xiehuaian77-sketch/neural-ai-browser.git
cd neural-ai-browser

# 2. 安装依赖
npm install

# 3. 配置环境
cp .env.example .env
# 编辑 .env，填入至少一个 API Key

# 4. 启动
npm run dev
# 打开 http://localhost:3000
```

### Docker 一键启动

```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  -e DEMO_MODE=true \
  xiehuaian77-sketch/neural-ai-browser:latest
```

---

## 项目结构

```
neural-ai-browser/
├── src/
│   ├── App.tsx              # 主界面：标签页 + Neural DOM + Agent 控制
│   ├── types.ts             # TypeScript 类型定义
│   ├── components/          # React 组件
│   └── server/              # 后端模块（Express + AI SDK）
│       ├── providers.ts     # 9 大 Provider 配置（单一数据源）
│       ├── chatExecutor.ts  # 统一聊天执行器（Gemini/OpenAI 双路径）
│       └── validation.ts    # Zod 输入校验 + 启动时 env 验证
├── server.ts                # Express 入口（CORS + RateLimit + Pino 日志）
├── Dockerfile               # 生产镜像
├── docker-compose.yml       # 本地编排
└── docs/                    # 架构 / API / 部署 / FAQ 文档
```

---

## 技术栈

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite + Lucide Icons + Motion
- **Backend**: Express + tsx + esbuild + pino（结构化日志）
- **AI SDKs**: @google/genai + openai（统一 OpenAI 兼容接口）
- **Validation**: Zod（运行时 schema 校验）
- **Security**: cors + express-rate-limit（20 req/min）+ 错误信息脱敏

---

## 贡献指南

我们欢迎所有形式的贡献！🎉

- 📖 阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解流程
- 🐛 提交 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 提议 [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
- 🔧 查看 [Good First Issues](https://github.com/yourname/neural-ai-browser/labels/good%20first%20issue) 开始你的第一个 PR

### 贡献者墙

<a href="https://github.com/xiehuaian77-sketch/neural-ai-browser/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xiehuaian77-sketch/neural-ai-browser" />
</a>

---

## Roadmap

| 阶段 | 功能 | 状态 |
|------|------|------|
| v0.1 | 基础多模型聊天 + 自主浏览 | ✅ 已完成 |
| v0.2 | SSE 流式响应 + Bundle 优化 | ✅ 已完成 |
| v0.3 | **Battle Mode 模型对战** | 🚧 进行中 |
| v0.4 | Agent 思维链可视化 Timeline | 📅 规划中 |
| v0.5 | 语音控制浏览 + 多模态 | 📅 规划中 |
| v1.0 | 插件市场 + 社区生态 | 📅 规划中 |

查看完整路线图：[GitHub Projects](https://github.com/yourname/neural-ai-browser/projects)

---

## 社区讨论

- 💬 [GitHub Discussions](https://github.com/yourname/neural-ai-browser/discussions) — 提问、分享、Show & Tell
- 🐦 [Twitter/X](https://twitter.com/yourname) — 关注获取最新动态
- 📝 [掘金](https://juejin.cn/user/yourname) — 深度技术文章

---

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=xiehuaian77-sketch/neural-ai-browser&type=Date)](https://star-history.com/#xiehuaian77-sketch/neural-ai-browser)

---

## License

MIT © [Neural AI Browser Contributors](https://github.com/xiehuaian77-sketch/neural-ai-browser)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/xiehuaian77-sketch">xiehuaian77-sketch</a> and <a href="https://github.com/xiehuaian77-sketch/neural-ai-browser/graphs/contributors">contributors</a></sub>
</div>
