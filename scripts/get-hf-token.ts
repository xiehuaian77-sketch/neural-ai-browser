import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to HF tokens page
  await page.goto('https://huggingface.co/settings/tokens');
  console.log('Opened HF tokens page. Please log in if needed...');

  // Wait for user to log in and reach the tokens page
  await page.waitForURL('https://huggingface.co/settings/tokens', { timeout: 0 });
  console.log('You are on the tokens page. Waiting 60 seconds for you to create a token...');

  // Give user time to manually create a token
  await page.waitForTimeout(60000);

  // Try to find a newly created token on the page
  const tokenText = await page.evaluate(() => {
    // Look for token-like text patterns on the page
    const allText = document.body.innerText;
    const tokenMatch = allText.match(/hf_[A-Za-z0-9]{30,}/g);
    return tokenMatch ? tokenMatch[0] : null;
  });

  if (tokenText) {
    console.log('Found token:', tokenText);
  } else {
    console.log('No token found automatically. Please copy it manually.');
  }

  console.log('Press Ctrl+C to exit, or close the browser window.');
  await page.waitForTimeout(120000);
  await browser.close();
})();
