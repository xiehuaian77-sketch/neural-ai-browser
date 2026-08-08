# FAQ

**Q: Which providers are supported?**
A: Google Gemini, OpenAI, DeepSeek, Qwen, GLM, Kimi, Yi, Baichuan, and MiniMax.

**Q: Why is the app showing preset data instead of live pages?**
A: The backend uses simulated parsing for unknown URLs. Configure provider API keys for live page analysis.

**Q: How do I persist agent memory?**
A: Memory is stored in `localStorage` under `ai-browser-memory-items`.

**Q: How do I add a new provider?**
A: Add provider config in `server.ts` under `allProviders`, add env vars in `.env.example`, and expose the model in the frontend selector.
