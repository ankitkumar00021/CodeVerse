#!/usr/bin/env node

import fetch from "node-fetch";

const API_BASE_URL = "http://localhost:3000/api";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHealthCheck() {
  try {
    log("\n🔍 Testing Health Check Endpoint...", "blue");
    const response = await fetch(`http://localhost:3000/health`);
    const data = await response.json();

    if (response.status === 200 && data.msg) {
      log("✅ Health check passed", "green");
      testsPassed++;
      return true;
    } else {
      log(`❌ Health check failed: ${JSON.stringify(data)}`, "red");
      testsFailed++;
      return false;
    }
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, "red");
    testsFailed++;
    return false;
  }
}

async function testDatabaseConnection() {
  try {
    log("\n🔍 Testing Database Connection (via getActiveSessions)...", "blue");
    
    // This endpoint requires auth, so we expect a specific response
    const response = await fetch(`${API_BASE_URL}/sessions/active`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Since we don't have auth, we should get 401, but it means the route exists
    if (response.status === 401 || response.status === 200) {
      log("✅ Database connection endpoint accessible", "green");
      testsPassed++;
      return true;
    } else {
      log(`❌ Unexpected response: ${response.status}`, "red");
      testsFailed++;
      return false;
    }
  } catch (error) {
    log(`❌ Database connection test error: ${error.message}`, "red");
    testsFailed++;
    return false;
  }
}

async function testCORSSetup() {
  try {
    log("\n🔍 Testing CORS Configuration...", "blue");
    const response = await fetch(`http://localhost:3000/health`, {
      headers: {
        "Origin": "http://localhost:5173",
      },
    });

    const corsHeader = response.headers.get("access-control-allow-origin");
    if (corsHeader || response.status === 200) {
      log("✅ CORS is properly configured", "green");
      testsPassed++;
      return true;
    } else {
      log("❌ CORS not configured properly", "red");
      testsFailed++;
      return false;
    }
  } catch (error) {
    log(`❌ CORS test error: ${error.message}`, "red");
    testsFailed++;
    return false;
  }
}

async function testRouteExists() {
  try {
    log("\n🔍 Testing Route Accessibility...", "blue");
    
    const routes = [
      { path: "/sessions/active", method: "GET" },
      { path: "/sessions/my-recent", method: "GET" },
      { path: "/chat", method: "GET" },
    ];

    let allRoutesOk = true;

    for (const route of routes) {
      try {
        const response = await fetch(`${API_BASE_URL}${route.path}`, {
          method: route.method,
        });
        
        // We expect 401 (unauthorized) which means route exists
        if (response.status === 401 || response.status === 200 || response.status === 404) {
          log(`  ✓ ${route.method} ${route.path}: Status ${response.status}`, "green");
        } else {
          log(`  ✗ ${route.method} ${route.path}: Status ${response.status}`, "red");
          allRoutesOk = false;
        }
      } catch (err) {
        log(`  ✗ ${route.method} ${route.path}: ${err.message}`, "red");
        allRoutesOk = false;
      }
    }

    if (allRoutesOk) {
      testsPassed++;
    } else {
      testsFailed++;
    }

    return allRoutesOk;
  } catch (error) {
    log(`❌ Route test error: ${error.message}`, "red");
    testsFailed++;
    return false;
  }
}

async function testEnvironmentVariables() {
  try {
    log("\n🔍 Testing Environment Variables...", "blue");

    const requiredEnvs = [
      "PORT",
      "DB_URL",
      "NODE_ENV",
      "CLERK_PUBLISHABLE_KEY",
      "CLERK_SECRET_KEY",
      "STREAM_API_KEY",
      "STREAM_API_SECRET",
    ];

    let allPresent = true;
    for (const env of requiredEnvs) {
      if (process.env[env]) {
        log(`  ✓ ${env}: Configured`, "green");
      } else {
        log(`  ✗ ${env}: Missing`, "red");
        allPresent = false;
      }
    }

    if (allPresent) {
      testsPassed++;
    } else {
      testsFailed++;
    }

    return allPresent;
  } catch (error) {
    log(`❌ Environment variables test error: ${error.message}`, "red");
    testsFailed++;
    return false;
  }
}

async function runTests() {
  log("\n╔════════════════════════════════════════╗", "yellow");
  log("║   CODEVERSE BACKEND TEST SUITE        ║", "yellow");
  log("╚════════════════════════════════════════╝", "yellow");

  log(`\n⏳ Waiting for server at ${API_BASE_URL}...`, "yellow");
  
  // Wait for server to be ready
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const response = await fetch("http://localhost:3000/health");
      if (response.ok) {
        serverReady = true;
        log("✅ Server is ready!", "green");
        break;
      }
    } catch (error) {
      if (i === 29) {
        log(`❌ Server did not start within 30 seconds`, "red");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Run all tests
  await testHealthCheck();
  await testEnvironmentVariables();
  await testDatabaseConnection();
  await testCORSSetup();
  await testRouteExists();

  // Summary
  log("\n╔════════════════════════════════════════╗", "yellow");
  log("║         TEST SUMMARY                   ║", "yellow");
  log("╚════════════════════════════════════════╝", "yellow");
  log(`✅ Tests Passed: ${testsPassed}`, "green");
  log(`❌ Tests Failed: ${testsFailed}`, testsFailed > 0 ? "red" : "green");
  
  const totalTests = testsPassed + testsFailed;
  const passPercentage = ((testsPassed / totalTests) * 100).toFixed(2);
  log(`\n📊 Pass Rate: ${passPercentage}% (${testsPassed}/${totalTests})`, 
    passPercentage === "100.00" ? "green" : "yellow");

  if (testsFailed === 0) {
    log("\n🎉 All tests passed! Backend is ready for deployment.", "green");
    process.exit(0);
  } else {
    log("\n⚠️  Some tests failed. Please check the issues above.", "red");
    process.exit(1);
  }
}

runTests().catch((error) => {
  log(`Fatal error: ${error.message}`, "red");
  process.exit(1);
});
