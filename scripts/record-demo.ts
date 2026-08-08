import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(PROJECT_ROOT, "assets");
const VIDEOS_DIR = path.join(PROJECT_ROOT, "videos");
const GIF_PATH = path.join(ASSETS_DIR, "demo.gif");

const WIDTH = 1280;
const HEIGHT = 800;

async function waitForServer(url: string, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function recordDemo() {
  console.log("🎬 Starting demo recording...\n");

  // Ensure directories exist
  for (const dir of [ASSETS_DIR, VIDEOS_DIR]) {
    if (!(await fs.stat(dir).catch(() => false))) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  // Start dev server with DEMO_MODE enabled
  console.log("🚀 Starting dev server with DEMO_MODE=true...");
  const server = spawn("npm", ["run", "dev"], {
    cwd: PROJECT_ROOT,
    shell: true,
    env: { ...process.env, DEMO_MODE: "true" },
    stdio: "pipe",
  });

  server.stdout.on("data", (data) => {
    const text = data.toString();
    if (text.includes("listening") || text.includes("Local:")) {
      console.log("📡", text.trim());
    }
  });

  server.stderr.on("data", (data) => {
    const text = data.toString();
    if (text.includes("listening") || text.includes("Local:")) {
      console.log("📡", text.trim());
    }
  });

  try {
    await waitForServer("http://localhost:3000/api/health", 90000);
    console.log("✅ Server is ready!\n");
  } catch (e) {
    console.error("❌ Server failed to start:", e);
    server.kill();
    process.exit(1);
  }

  console.log("🎥 Launching browser with video recording...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: { dir: VIDEOS_DIR, size: { width: WIDTH, height: HEIGHT } },
  });

  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    console.log("  [0-3s] Initial load...");
    await page.waitForTimeout(1000);

    console.log("  [3-6s] Selecting DeepSeek provider...");
    const providerSelect = await page.$('select, [role="combobox"], button:has-text("Gemini")');
    if (providerSelect) {
      await providerSelect.click();
      await page.waitForTimeout(500);
      const deepseekOption = await page.$('text=DeepSeek, [data-value="deepseek"]');
      if (deepseekOption) {
        await deepseekOption.click();
      }
      await page.waitForTimeout(1000);
    }

    console.log("  [6-10s] Typing question...");
    const textarea = await page.$('textarea, input[type="text"], [contenteditable="true"]');
    if (textarea) {
      await textarea.click();
      await page.waitForTimeout(200);
      await textarea.fill("分析 GitHub Trending 趋势");
      await page.waitForTimeout(1000);
    }

    console.log("  [10-15s] Sending and watching stream...");
    const sendButton = await page.$('button:has-text("Send"), button[type="submit"], button:has-text("发送")');
    if (sendButton) {
      await sendButton.click();
    }
    await page.waitForTimeout(5000);

    console.log("  [15-18s] Switching to Neural DOM view...");
    const domTab = await page.$('text=Neural DOM, text=DOM Tree, button:has-text("DOM")');
    if (domTab) {
      await domTab.click();
      await page.waitForTimeout(2000);
    }

    console.log("  [18-20s] Back to chat...");
    const chatTab = await page.$('text=Chat, button:has-text("Chat")');
    if (chatTab) {
      await chatTab.click();
    }
    await page.waitForTimeout(2000);

    console.log("✅ Recording complete!\n");
  } catch (e) {
    console.error("⚠️ Recording error:", e);
  } finally {
    await context.close();
    await browser.close();
    server.kill();

    // Wait for video file to be flushed
    await new Promise((r) => setTimeout(r, 3000));

    // Find the recorded video
    const files = await fs.readdir(VIDEOS_DIR);
    const videoFile = files.find((f) => f.endsWith(".webm"));

    if (videoFile) {
      const videoPath = path.join(VIDEOS_DIR, videoFile);
      console.log(`🔄 Converting ${videoFile} to GIF...`);
      await convertWebmToGif(videoPath, GIF_PATH);
      await fs.unlink(videoPath);
      console.log(`✅ GIF saved to: ${GIF_PATH}`);
    } else {
      console.log("⚠️ No video file found. Taking screenshot instead...");
      const browser2 = await chromium.launch({ headless: true });
      const context2 = await browser2.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
      const page2 = await context2.newPage();
      await page2.goto("http://localhost:3000", { waitUntil: "networkidle" });
      await page2.screenshot({ path: path.join(ASSETS_DIR, "demo-screenshot.png"), fullPage: false });
      await browser2.close();
      console.log(`📸 Screenshot saved to: ${ASSETS_DIR}/demo-screenshot.png`);
    }
  }

  console.log("\n🎉 Demo recording finished!");
}

async function convertWebmToGif(input: string, output: string) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      input,
      "-vf",
      "fps=10,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse",
      "-loop",
      "0",
      "-y",
      output,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      // ffmpeg logs to stderr
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

recordDemo().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
