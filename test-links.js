#!/usr/bin/env node

/**
 * Comprehensive Link Testing Script for Pine City Zoo Website
 * Tests all internal and external links for validity
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Test results storage
const results = {
    internal: { passed: [], failed: [] },
    external: { passed: [], failed: [] },
    images: { passed: [], failed: [] },
    css: { passed: [], failed: [] },
    js: { passed: [], failed: [] }
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractLinksFromHTML(htmlContent, filename) {
    const links = {
        internal: [],
        external: [],
        images: [],
        css: [],
        js: []
    };

    // Extract href links
    const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(htmlContent)) !== null) {
        const url = match[1];
        if (url.startsWith('http://') || url.startsWith('https://')) {
            links.external.push({ url, file: filename });
        } else if (url.endsWith('.css')) {
            links.css.push({ url, file: filename });
        } else if (!url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
            links.internal.push({ url, file: filename });
        }
    }

    // Extract src links (images, scripts)
    const srcRegex = /src\s*=\s*["']([^"']+)["']/gi;
    while ((match = srcRegex.exec(htmlContent)) !== null) {
        const url = match[1];
        if (url.startsWith('http://') || url.startsWith('https://')) {
            links.external.push({ url, file: filename });
        } else if (url.endsWith('.js')) {
            links.js.push({ url, file: filename });
        } else if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
            links.images.push({ url, file: filename });
        }
    }

    return links;
}

function checkFileExists(filePath) {
    return fs.existsSync(filePath);
}

function checkExternalLink(url) {
    return new Promise((resolve) => {
        try {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? https : http;
            
            const options = {
                method: 'HEAD',
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)'
                }
            };

            const req = protocol.request(url, options, (res) => {
                resolve({
                    success: res.statusCode >= 200 && res.statusCode < 400,
                    status: res.statusCode,
                    url
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message,
                    url
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Request timeout',
                    url
                });
            });

            req.setTimeout(10000);
            req.end();
        } catch (error) {
            resolve({
                success: false,
                error: error.message,
                url
            });
        }
    });
}

async function testInternalLinks(links) {
    log('\n🔗 Testing Internal Links...', 'cyan');
    
    for (const link of links) {
        const filePath = path.resolve(link.url);
        const exists = checkFileExists(filePath);
        
        if (exists) {
            results.internal.passed.push(link);
            log(`  ✅ ${link.url} (in ${link.file})`, 'green');
        } else {
            results.internal.failed.push({ ...link, error: 'File not found' });
            log(`  ❌ ${link.url} (in ${link.file}) - File not found`, 'red');
        }
    }
}

async function testExternalLinks(links) {
    log('\n🌐 Testing External Links...', 'cyan');
    
    // Remove duplicates
    const uniqueLinks = [...new Map(links.map(link => [link.url, link])).values()];
    
    for (const link of uniqueLinks) {
        log(`  Testing: ${link.url}`, 'yellow');
        const result = await checkExternalLink(link.url);
        
        if (result.success) {
            results.external.passed.push({ ...link, status: result.status });
            log(`  ✅ ${link.url} (Status: ${result.status})`, 'green');
        } else {
            results.external.failed.push({ ...link, error: result.error, status: result.status });
            log(`  ❌ ${link.url} - ${result.error || `Status: ${result.status}`}`, 'red');
        }
        
        // Add delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function testAssets(links, type) {
    log(`\n📁 Testing ${type.toUpperCase()} Files...`, 'cyan');
    
    for (const link of links) {
        const filePath = path.resolve(link.url);
        const exists = checkFileExists(filePath);
        
        if (exists) {
            results[type].passed.push(link);
            log(`  ✅ ${link.url} (in ${link.file})`, 'green');
        } else {
            results[type].failed.push({ ...link, error: 'File not found' });
            log(`  ❌ ${link.url} (in ${link.file}) - File not found`, 'red');
        }
    }
}

function printSummary() {
    log('\n📊 LINK TESTING SUMMARY', 'bright');
    log('=' .repeat(50), 'blue');
    
    const categories = ['internal', 'external', 'images', 'css', 'js'];
    let totalPassed = 0;
    let totalFailed = 0;
    
    categories.forEach(category => {
        const passed = results[category].passed.length;
        const failed = results[category].failed.length;
        const total = passed + failed;
        
        if (total > 0) {
            totalPassed += passed;
            totalFailed += failed;
            
            const status = failed === 0 ? '✅' : '⚠️';
            const color = failed === 0 ? 'green' : 'yellow';
            
            log(`${status} ${category.toUpperCase()}: ${passed}/${total} passed`, color);
            
            if (failed > 0) {
                results[category].failed.forEach(item => {
                    log(`    ❌ ${item.url} (${item.file}) - ${item.error}`, 'red');
                });
            }
        }
    });
    
    log('\n' + '='.repeat(50), 'blue');
    log(`🎯 OVERALL: ${totalPassed}/${totalPassed + totalFailed} links working`, 
        totalFailed === 0 ? 'green' : 'yellow');
    
    if (totalFailed === 0) {
        log('🎉 All links are working perfectly!', 'green');
    } else {
        log(`⚠️  ${totalFailed} links need attention`, 'yellow');
    }
}

async function main() {
    log('🦁 Pine City Zoo - Link Testing Tool', 'bright');
    log('Testing all internal and external links...\n', 'blue');
    
    // Get all HTML files
    const htmlFiles = fs.readdirSync('.')
        .filter(file => file.endsWith('.html'))
        .filter(file => !file.includes('node_modules'));
    
    log(`Found ${htmlFiles.length} HTML files to test:`, 'blue');
    htmlFiles.forEach(file => log(`  📄 ${file}`, 'cyan'));
    
    // Extract all links from all HTML files
    const allLinks = {
        internal: [],
        external: [],
        images: [],
        css: [],
        js: []
    };
    
    htmlFiles.forEach(filename => {
        const content = fs.readFileSync(filename, 'utf8');
        const links = extractLinksFromHTML(content, filename);
        
        allLinks.internal.push(...links.internal);
        allLinks.external.push(...links.external);
        allLinks.images.push(...links.images);
        allLinks.css.push(...links.css);
        allLinks.js.push(...links.js);
    });
    
    // Test all link types
    await testInternalLinks(allLinks.internal);
    await testExternalLinks(allLinks.external);
    await testAssets(allLinks.images, 'images');
    await testAssets(allLinks.css, 'css');
    await testAssets(allLinks.js, 'js');
    
    // Print summary
    printSummary();
}

// Run the tests
main().catch(console.error);
