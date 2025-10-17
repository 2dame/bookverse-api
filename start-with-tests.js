/**
 * BookVerse API - Start Server with Automatic Testing
 * Starts the server and automatically runs all tests
 */

const { spawn } = require('child_process');
const path = require('path');

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

console.log(`\n${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║                                                              ║${colors.reset}`);
console.log(`${colors.green}║        🚀 BookVerse API v1.5 - Starting with Tests          ║${colors.reset}`);
console.log(`${colors.cyan}║                                                              ║${colors.reset}`);
console.log(`${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

// Start the server in background
console.log(`${colors.yellow}📡 Starting server on http://localhost:5001/ ...${colors.reset}\n`);

const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true,
  detached: false
});

// Wait for server to start, then run tests
setTimeout(() => {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.yellow}🧪 Running automated test suite...${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const tests = spawn('node', ['autotest.js'], {
    stdio: 'inherit',
    shell: true
  });

  tests.on('close', (code) => {
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    if (code === 0) {
      console.log(`${colors.green}✅ All tests completed successfully!${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  Tests completed with warnings${colors.reset}`);
    }
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`\n${colors.green}🎯 Server is running and ready for manual testing!${colors.reset}`);
    console.log(`${colors.yellow}📊 View reports: RESULTS.md and tests/responses/${colors.reset}`);
    console.log(`${colors.yellow}🌐 Access API: http://localhost:5001/${colors.reset}\n`);
  });
}, 3000);

// Handle termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down server...${colors.reset}`);
  server.kill();
  process.exit(0);
});

