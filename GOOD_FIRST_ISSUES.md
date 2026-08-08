# Good First Issues

想要为 Neural AI Browser 做贡献但不知道从哪里开始？这份列表包含了适合新手的任务，从简单到中等难度。

## 🟢 入门级（无需深入了解代码库）

### 1. 翻译 README 到日语
- **难度**: ⭐
- **预估时间**: 1-2 小时
- **描述**: 将 `README.md` 翻译成日语，帮助项目触达日本开发者社区。
- **技能要求**: 日语 + Markdown
- **相关文件**: `README.md`

### 2. 翻译 README 到韩语
- **难度**: ⭐
- **预估时间**: 1-2 小时
- **描述**: 将 `README.md` 翻译成韩语。
- **技能要求**: 韩语 + Markdown
- **相关文件**: `README.md`

### 3. 改进 assets/demo.gif 录制质量
- **难度**: ⭐⭐
- **预估时间**: 2-3 小时
- **描述**: 当前 GIF 分辨率较低，使用 OBS Studio 或 Kap 重新录制一个高清版本（720p 或更高）。参考 `scripts/record-demo.ts` 了解自动化录制流程。
- **技能要求**: 录屏工具 + 视频剪辑
- **相关文件**: `assets/demo.gif`, `scripts/record-demo.ts`

### 4. 为项目添加更多 Badge
- **难度**: ⭐
- **预估时间**: 30 分钟
- **描述**: 在 `README.md` 顶部添加更多 shields.io badge，例如：npm 版本、npm 下载量、GitHub 最近提交时间、PR 欢迎度等。
- **技能要求**: Markdown
- **相关文件**: `README.md`

## 🟡 进阶级（需要少量代码修改）

### 5. 为新的 Provider X 添加适配器
- **难度**: ⭐⭐
- **预估时间**: 2-3 小时
- **描述**: 在 `src/server/providers.ts` 中添加一个新的 AI provider 适配器。参考已有的 9 个 provider 配置，新增一个（例如 Groq、Perplexity、Mistral）。
- **技能要求**: TypeScript + 了解 OpenAI SDK
- **相关文件**: `src/server/providers.ts`, `.env.example`

### 6. 为 Battle Mode 添加暗色主题支持
- **难度**: ⭐⭐
- **预估时间**: 2-3 小时
- **描述**: 在 Battle Mode 分屏组件中，确保两个 AI 回复面板都支持暗色主题，与整体 UI 保持一致。
- **技能要求**: React + Tailwind CSS
- **相关文件**: `src/App.tsx`

### 7. 为 Agent Timeline 添加导出 PNG 功能
- **难度**: ⭐⭐⭐
- **预估时间**: 3-4 小时
- **描述**: 当 AI 执行自主浏览任务时，时间轴会展示每个步骤。添加一个"导出 PNG"按钮，使用 `html2canvas` 将整个 Timeline 保存为图片。
- **技能要求**: React + html2canvas
- **相关文件**: `src/components/AgentTimeline.tsx`

### 8. 优化 mobile 端响应式布局
- **难度**: ⭐⭐⭐
- **预估时间**: 3-4 小时
- **描述**: 当前 UI 主要针对桌面端优化。添加移动端响应式布局，确保在手机屏幕上也能正常使用（标签页切换、Neural DOM 面板、设置面板）。
- **技能要求**: React + Tailwind CSS + 响应式设计
- **相关文件**: `src/App.tsx`, `src/components/*`

### 9. 添加深色/浅色主题切换器
- **难度**: ⭐⭐
- **预估时间**: 2-3 小时
- **描述**: 添加一个主题切换按钮，支持深色和浅色主题。使用 `localStorage` 持久化用户偏好。
- **技能要求**: React + Tailwind CSS + localStorage
- **相关文件**: `src/App.tsx`, `tailwind.config.ts`

### 10. 为 API 响应添加 TypeScript 类型定义
- **难度**: ⭐⭐
- **预估时间**: 2-3 小时
- **描述**: 检查前端 `src/App.tsx` 中所有 `fetch` 调用，确保响应数据有正确的 TypeScript 类型定义。目前很多地方使用 `any`。
- **技能要求**: TypeScript
- **相关文件**: `src/App.tsx`, `src/types.ts`

## 🔵 挑战级（需要深入理解代码库）

### 11. 实现本地存储的 Chat History
- **难度**: ⭐⭐⭐⭐
- **预估时间**: 1 周
- **描述**: 当前聊天记录在刷新后丢失。使用 IndexedDB 或 localStorage 持久化聊天历史，支持多会话管理和搜索。
- **技能要求**: React + IndexedDB / Dexie.js
- **相关文件**: `src/App.tsx`, `src/types.ts`

### 12. 实现插件系统基础架构
- **难度**: ⭐⭐⭐⭐⭐
- **预估时间**: 2 周
- **描述**: 设计并实现一个简单的插件系统，允许第三方开发者编写自定义工具（如天气查询、翻译、截图）。参考 VS Code 的 `contributes` 点配置。
- **技能要求**: TypeScript + 插件系统设计
- **相关文件**: `src/server/plugins.ts`, `src/types.ts`

---

## 🤔 如何开始？

1. **选择一个问题**：从上面选择你感兴趣的任务
2. **在 GitHub 上回复**：在该 issue 下评论 "I'd like to work on this"，避免重复劳动
3. **Fork 并克隆**：
   ```bash
   git clone https://github.com/yourname/neural-ai-browser.git
   cd neural-ai-browser
   npm install
   ```
4. **创建分支**：
   ```bash
   git checkout -b feat/your-feature-name
   ```
5. **开始编码**：完成后提交 PR
6. **等待 Review**：维护者会在 48 小时内 Review

## 💬 需要帮助？

- 💬 在 [Discussions](https://github.com/yourname/neural-ai-browser/discussions) 中提问
- 📧 发送邮件至 maintainer@example.com
- 🐛 如果你发现这个列表有问题，欢迎提交 PR 改进它！

---

*维护者会定期更新这个列表。如果你有好的新手任务建议，请在 [Discussion](https://github.com/yourname/neural-ai-browser/discussions) 中分享！*
