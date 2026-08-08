# Contributing to Neural AI Browser

Thank you for your interest in contributing! This document describes the workflow and standards for this repository.

## 🌟 新手入门

如果你是第一次贡献开源项目，别担心！我们准备了适合新手的任务：

- 📋 查看 **[GOOD_FIRST_ISSUES.md](GOOD_FIRST_ISSUES.md)** — 从入门到进阶的任务列表
- 💬 在 [GitHub Discussions](https://github.com/yourname/neural-ai-browser/discussions) 中介绍自己，告诉我们你想做什么
- 🚀 阅读下面的 Setup 指南，运行项目，感受一下

## 🤝 贡献方式

- Report bugs or request features via Issues
- Improve documentation or code comments
- Submit bug fixes and improvements via Pull Requests
- Add new providers/models in `src/server/providers.ts`
- 参与社区讨论、帮助回答其他用户的问题

## 🛠️ Setup

```bash
git clone https://github.com/yourname/neural-ai-browser.git
cd neural-ai-browser
cp .env.example .env
npm install
npm run lint
```

## 🌿 Branching

- Create a branch from `main`
- Use descriptive names: `fix/agent-crash`, `feat/add-minimax-provider`, `docs/readme-screenshots`
- Keep PRs focused; avoid mixing unrelated changes

## 📝 Commits

Use Conventional Commits style where possible:

```
feat: add MiniMax provider support
fix: avoid white screen when pageData is undefined
docs: update README quick start
chore: upgrade vite to 6.2.3
```

## 🔀 Pull Requests

- Keep changes minimal and reviewable
- Ensure `npm run lint` passes
- Update README or docs when behavior changes
- Link related issues in the PR description
- 使用我们提供的 [PR Template](.github/pull_request_template.md)

## 🏆 贡献者荣誉体系

我们重视每一个贡献者：

- 🌟 **Core Maintainer**（核心维护者，有合并权限）
- 🔧 **Contributor**（代码贡献者）
- 📝 **Documenter**（文档贡献者）
- 💡 **Advisor**（提出关键设计思路）
- 🚀 **Ambassador**（在社交媒体传播项目）

所有贡献者都会在 README 底部的贡献者墙中出现（通过 [all-contributors](https://allcontributors.org/) 自动生成）。

## 💬 社区

- 💬 [GitHub Discussions](https://github.com/yourname/neural-ai-browser/discussions) — 提问、分享、Show & Tell
- 🐦 [Twitter/X](https://twitter.com/yourname) — 关注获取最新动态
- 📝 [掘金](https://juejin.cn/user/yourname) — 深度技术文章

## 🔍 Issue 标签说明

- `good first issue` — 适合新手的任务
- `help wanted` — 需要社区帮助的任务
- `bug` — 需要修复的 Bug
- `enhancement` — 新功能建议
- `documentation` — 文档改进
- `priority: high` — 高优先级任务

## ⏱️ 响应时间

- 所有 Issue 我们会在 **24 小时内**回复
- PR 评论不超过 **48 小时**不合并（即使只是说 "LGTM，等 CI 通过"）
- 我们重视快速响应，因为这对 GitHub Trending 排名很重要

## 📜 Code of Conduct

Be respectful and constructive. harassment, trolling, or exclusionary behavior is not acceptable.

By participating, you are expected to uphold this code. Please report unacceptable behavior to maintainer@example.com.
