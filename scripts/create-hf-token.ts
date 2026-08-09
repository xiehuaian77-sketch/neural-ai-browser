import { chromium } from 'playwright';

async function createHFToken() {
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to HF token settings
    console.log('📍 Navigating to https://huggingface.co/settings/tokens...');
    await page.goto('https://huggingface.co/settings/tokens', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-step1-landing.png', fullPage: true });
    console.log('📸 Screenshot: hf-step1-landing.png');
    
    // Step 2: Check if login is required
    const currentUrl = page.url();
    console.log('🔗 Current URL:', currentUrl);
    
    if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
      console.log('⚠️  Still on login page. Please log in in the browser window...');
      console.log('⏳ Waiting 180 seconds for manual login...');
      
      // Poll for redirect every 3 seconds
      const startTime = Date.now();
      while (Date.now() - startTime < 180000) {
        await page.waitForTimeout(3000);
        const url = page.url();
        if (url.includes('/settings/tokens')) {
          console.log('✅ Login detected! Redirected to settings page');
          break;
        }
      }
      
      await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-step2-post-login.png', fullPage: true });
      console.log('📸 Screenshot: hf-step2-post-login.png');
    } else {
      console.log('✅ Already on settings page (logged in)');
    }
    
    // Step 3: Find and click "New token" button
    console.log('🔘 Looking for "New token" button...');
    
    const selectors = [
      'button:has-text("New token")',
      'button:has-text("创建")',
      'a:has-text("New token")',
      'button:has-text("Add")',
      '[data-testid="new-token-button"]',
      'button:has-text("Generate")',
      'button:has-text("新建")',
      'a:has-text("新建")',
      'button:has-text("Create")',
      // 更通用的选择器
      'button:has-text("token")',
      'a:has-text("token")',
      'button:has-text("Token")'
    ];
    
    let newTokenBtn = null;
    for (const selector of selectors) {
      const btn = page.locator(selector).first();
      if (await btn.count() > 0 && await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`✅ Found button: ${selector}`);
        newTokenBtn = btn;
        break;
      }
    }
    
    if (newTokenBtn) {
      await newTokenBtn.click();
      console.log('✅ "New token" button clicked');
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠️  "New token" button not found automatically');
      console.log('📸 Taking screenshot for manual inspection...');
      await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-step3-need-manual-click.png', fullPage: true });
      console.log('⏳ Waiting 90 seconds for manual click...');
      await page.waitForTimeout(90000);
    }
    
    await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-step4-form-visible.png', fullPage: true });
    console.log('📸 Screenshot: hf-step4-form-visible.png');
    
    // Step 4: Fill in token details
    console.log('📝 Filling token form...');
    
    // Token name - 尝试更多选择器
    const nameSelectors = [
      'input[name="name"]',
      'input[id*="name"]',
      'input[placeholder*="name"]',
      'input[placeholder*="名称"]',
      'input[placeholder*="Name"]',
      'input[type="text"]'
    ];
    
    let nameFilled = false;
    for (const selector of nameSelectors) {
      const input = page.locator(selector).first();
      if (await input.count() > 0 && await input.isVisible({ timeout: 1000 }).catch(() => false)) {
        await input.fill('neural-ai-browser-token');
        console.log(`✅ Token name filled using selector: ${selector}`);
        nameFilled = true;
        break;
      }
    }
    
    if (!nameFilled) {
      console.log('⚠️  Name input not found');
    }
    
    // Select "write" permission - 尝试多种方式
    console.log('🔒 Selecting write permission...');
    let writeSelected = false;
    
    // 方式1: 直接找 value="write" 的 input
    const writeInputs = await page.locator('input[value="write"]').all();
    for (const input of writeInputs) {
      if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
        await input.click();
        console.log('✅ Write permission selected (input[value="write"])');
        writeSelected = true;
        break;
      }
    }
    
    // 方式2: 找包含 "write" 文本的 label
    if (!writeSelected) {
      const writeLabel = page.locator('label:has-text("write"), label:has-text("写入"), label:has-text("Write")').first();
      if (await writeLabel.count() > 0 && await writeLabel.isVisible({ timeout: 1000 }).catch(() => false)) {
        await writeLabel.click();
        console.log('✅ Write permission selected (label click)');
        writeSelected = true;
      }
    }
    
    // 方式3: 找 radio buttons 并检查其关联的 label
    if (!writeSelected) {
      const radios = await page.locator('input[type="radio"]').all();
      for (const radio of radios) {
        try {
          const radioValue = await radio.getAttribute('value').catch(() => '');
          const radioId = await radio.getAttribute('id').catch(() => '');
          
          // 检查 radio 的 value
          if (radioValue === 'write') {
            await radio.click();
            console.log('✅ Write permission selected (radio value="write")');
            writeSelected = true;
            break;
          }
          
          // 检查 radio 关联的 label
          if (radioId) {
            const label = page.locator(`label[for="${radioId}"]`).first();
            if (await label.count() > 0) {
              const labelText = await label.textContent().catch(() => '');
              if (labelText && labelText.toLowerCase().includes('write')) {
                await label.click();
                console.log('✅ Write permission selected (label for radio)');
                writeSelected = true;
                break;
              }
            }
          }
        } catch (e) {
          // 继续下一个 radio
        }
      }
    }
    
    if (!writeSelected) {
      console.log('⚠️  Write option not found automatically');
    }
    
    await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-step5-form-ready.png', fullPage: true });
    console.log('📸 Screenshot: hf-step5-form-ready.png');
    
    // Step 5: Create token
    console.log('🆕 Creating token...');
    
    const createSelectors = [
      'button:has-text("Create")',
      'button:has-text("创建")',
      'button[type="submit"]',
      'button:has-text("生成")',
      'button:has-text("Generate")',
      'button:has-text("Save")',
      'button:has-text("保存")'
    ];
    
    let createClicked = false;
    for (const selector of createSelectors) {
      const btn = page.locator(selector).first();
      if (await btn.count() > 0 && await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click();
        console.log(`✅ Create button clicked using selector: ${selector}`);
        createClicked = true;
        break;
      }
    }
    
    if (!createClicked) {
      console.log('⚠️  Create button not found');
    }
    
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-step6-token-generated.png', fullPage: true });
    console.log('📸 Screenshot: hf-step6-token-generated.png');
    
    // Step 6: Extract token - 改进的提取逻辑
    console.log('🔍 Extracting token...');
    
    let token = '';
    
    // 策略1: 从特定选择器提取
    const tokenSelectors = [
      'code',
      '.token-value',
      '[data-testid="token"]',
      'input[readonly]',
      'code:has-text("hf_")',
      // HF 可能的 token 显示区域
      '.monospace',
      'pre',
      'code.highlight'
    ];
    
    for (const selector of tokenSelectors) {
      const el = page.locator(selector).first();
      if (await el.count() > 0) {
        const text = await el.textContent();
        if (text && text.includes('hf_')) {
          token = text.trim();
          console.log(`✅ Token found using selector: ${selector}`);
          break;
        }
      }
    }
    
    // 策略2: 从页面所有文本中正则匹配
    if (!token) {
      console.log('🔍 Trying regex extraction from page text...');
      const pageText = await page.textContent('body');
      if (pageText) {
        const hfTokenMatch = pageText.match(/hf_[A-Za-z0-9]{20,}/);
        if (hfTokenMatch) {
          token = hfTokenMatch[0];
          console.log('✅ Token found using regex on body text');
        }
      }
    }
    
    // 策略3: 从所有 code 元素中查找
    if (!token) {
      console.log('🔍 Checking all code elements...');
      const codeElements = await page.locator('code').all();
      for (const el of codeElements) {
        const text = await el.textContent();
        if (text && text.includes('hf_')) {
          token = text.trim();
          console.log('✅ Token found in code element');
          break;
        }
      }
    }
    
    if (token) {
      console.log('\n🎉 Token created successfully!');
      console.log('Token:', token);
      
      const fs = await import('fs');
      fs.writeFileSync('D:/31986/Documents/ai-browser/hf-token.txt', token);
      console.log('💾 Token saved to: hf-token.txt');
    } else {
      console.log('⚠️  Token not found automatically');
      console.log('📋 Please copy the token manually from the browser window');
      console.log('💡 Tip: The token should start with "hf_" and be displayed in a code block or input field');
    }
    
    // Keep browser open for manual copy
    console.log('\n⏳ Browser staying open for 180 seconds...');
    console.log('📋 If token was not extracted automatically, please copy it manually from the browser');
    await page.waitForTimeout(180000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'D:/31986/Documents/ai-browser/hf-error.png', fullPage: true });
  } finally {
    console.log('\n🔒 Closing browser...');
    await browser.close();
  }
}

createHFToken().catch(console.error);
