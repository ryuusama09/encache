#!/usr/bin/env node

const { version } = require('../package.json');

function showVersion() {
  console.log(`encache version: ${version}`);
}

// Simple argument handling
const args = process.argv.slice(2);
if (args.includes('--version')) {
  showVersion();
} else {
  console.log("Usage: encache --version");
}
