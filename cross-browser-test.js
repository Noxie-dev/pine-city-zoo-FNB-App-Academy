#!/usr/bin/env node

/**
 * Cross-browser testing script for Pine City Zoo website
 * Tests the website across different browsers and devices
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const config = {
  baseUrl: 'http://localhost:8080',
  pages: [
    '/index.html',
    '/animals.html',
    '/elephant.html',
    '/giraffe.html',
    '/lion.html'
  ],
  viewports: [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ],
  browsers: [
    { name: 'Chrome', product: 'chrome' },
    { name: 'Firefox', product: 'firefox' }
  ]
};

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  },
  tests: []
};

/**
 * Run a single test case
 */
async function runTest(browser, page, url, viewport) {
  const testName = `${browser.name} - ${viewport.name} - ${url}`;
  console.log(`🧪 Testing: ${testName}`);
  
  try {
    // Set viewport
    await page.setViewport({
      width: viewport.width,
      height: viewport.height
    });
    
    // Navigate to page
    await page.goto(`${config.baseUrl}${url}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for page to be ready
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check for JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Take screenshot
    const screenshotDir = path.join(__dirname, 'test-screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });
    
    const screenshotName = `${browser.name}-${viewport.name}-${url.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    const screenshotPath = path.join(screenshotDir, screenshotName);
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    // Check page title
    const title = await page.title();
    const hasValidTitle = title && title.length > 0 && title !== 'Document';
    
    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.complete || img.naturalWidth === 0).length;
    });
    
    // Check for missing CSS
    const missingCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.filter(link => {
        const sheet = Array.from(document.styleSheets).find(s => s.href === link.href);
        return !sheet || sheet.cssRules.length === 0;
      }).length;
    });
    
    // Determine test result
    const issues = [];
    if (jsErrors.length > 0) issues.push(`${jsErrors.length} JavaScript errors`);
    if (consoleErrors.length > 0) issues.push(`${consoleErrors.length} console errors`);
    if (!hasValidTitle) issues.push('Invalid or missing page title');
    if (brokenImages > 0) issues.push(`${brokenImages} broken images`);
    if (missingCSS > 0) issues.push(`${missingCSS} missing CSS files`);
    
    const passed = issues.length === 0;
    
    // Record test result
    const testResult = {
      name: testName,
      browser: browser.name,
      viewport: viewport.name,
      url: url,
      passed: passed,
      issues: issues,
      screenshot: screenshotPath,
      timestamp: new Date().toISOString()
    };
    
    testResults.tests.push(testResult);
    testResults.summary.total++;
    
    if (passed) {
      testResults.summary.passed++;
      console.log(`✅ ${testName} - PASSED`);
    } else {
      testResults.summary.failed++;
      console.log(`❌ ${testName} - FAILED: ${issues.join(', ')}`);
    }
    
    return testResult;
    
  } catch (error) {
    console.log(`❌ ${testName} - ERROR: ${error.message}`);
    
    const testResult = {
      name: testName,
      browser: browser.name,
      viewport: viewport.name,
      url: url,
      passed: false,
      issues: [`Test error: ${error.message}`],
      screenshot: null,
      timestamp: new Date().toISOString()
    };
    
    testResults.tests.push(testResult);
    testResults.summary.total++;
    testResults.summary.failed++;
    
    return testResult;
  }
}

/**
 * Generate HTML report
 */
async function generateReport() {
  const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cross-Browser Test Report - Pine City Zoo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #2a8d46; color: white; padding: 20px; border-radius: 8px; }
        .summary { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
        .test-result { margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 5px solid; }
        .passed { background: #d4edda; border-color: #28a745; }
        .failed { background: #f8d7da; border-color: #dc3545; }
        .screenshot { max-width: 200px; margin: 10px 0; }
        .issues { color: #dc3545; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🦁 Pine City Zoo - Cross-Browser Test Report</h1>
        <p>Generated: ${testResults.timestamp}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Test Summary</h2>
        <p><strong>Total Tests:</strong> ${testResults.summary.total}</p>
        <p><strong>Passed:</strong> ${testResults.summary.passed}</p>
        <p><strong>Failed:</strong> ${testResults.summary.failed}</p>
        <p><strong>Success Rate:</strong> ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%</p>
    </div>
    
    <div class="results">
        <h2>🧪 Test Results</h2>
        ${testResults.tests.map(test => `
            <div class="test-result ${test.passed ? 'passed' : 'failed'}">
                <h3>${test.name}</h3>
                <p><strong>Status:</strong> ${test.passed ? '✅ PASSED' : '❌ FAILED'}</p>
                ${test.issues.length > 0 ? `<div class="issues"><strong>Issues:</strong><ul>${test.issues.map(issue => `<li>${issue}</li>`).join('')}</ul></div>` : ''}
                ${test.screenshot ? `<img src="${path.relative(__dirname, test.screenshot)}" alt="Screenshot" class="screenshot">` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  
  await fs.writeFile('cross-browser-report.html', reportHtml);
  console.log('\n📄 Report generated: cross-browser-report.html');
}

/**
 * Main test runner
 */
async function runCrossBrowserTests() {
  console.log('🦁 Pine City Zoo - Cross-Browser Testing Suite');
  console.log('==============================================\n');
  
  // Check if server is running
  try {
    const response = await fetch(`${config.baseUrl}/index.html`);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Local server is not running on port 8080');
    console.log('💡 Start the server with: npm run serve');
    process.exit(1);
  }
  
  for (const browserConfig of config.browsers) {
    console.log(`\n🌐 Testing with ${browserConfig.name}...`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        product: browserConfig.product,
        headless: 'new'
      });
      
      const page = await browser.newPage();
      
      for (const url of config.pages) {
        for (const viewport of config.viewports) {
          await runTest(browserConfig, page, url, viewport);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to test with ${browserConfig.name}: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  
  // Generate report
  await generateReport();
  
  // Print summary
  console.log('\n==============================================');
  console.log('🦁 Cross-Browser Testing Complete');
  console.log('==============================================');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  
  if (testResults.summary.failed > 0) {
    console.log('\n❌ Some tests failed. Check the report for details.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! 🎉');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runCrossBrowserTests().catch(console.error);
}

module.exports = { runCrossBrowserTests };
