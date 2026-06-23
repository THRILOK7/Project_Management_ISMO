/**
 * Configuration Verification Script
 * Run this to verify your deployment configuration is correct
 * 
 * Usage: node verify-config.js
 */

const https = require('https');

const CONFIG = {
  BACKEND_URL: 'https://projectmanagementismo-production.up.railway.app',
  FRONTEND_URL: 'https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app',
};

console.log('🔍 Verifying Deployment Configuration...\n');

// Helper function to make HTTPS requests
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers, 
        body: data 
      }));
    }).on('error', reject);
  });
}

// Test 1: Backend is accessible
async function testBackendAccessibility() {
  console.log('📡 Test 1: Backend Accessibility');
  try {
    const response = await httpsGet(CONFIG.BACKEND_URL);
    if (response.statusCode === 200) {
      console.log('✅ Backend is accessible');
      console.log(`   Response: ${response.body.substring(0, 50)}...`);
      return true;
    } else {
      console.log(`❌ Backend returned status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed to reach backend: ${error.message}`);
    return false;
  }
}

// Test 2: CORS headers check
async function testCorsHeaders() {
  console.log('\n🔐 Test 2: CORS Configuration');
  try {
    const response = await httpsGet(CONFIG.BACKEND_URL);
    const corsOrigin = response.headers['access-control-allow-origin'];
    const corsCredentials = response.headers['access-control-allow-credentials'];
    
    if (corsOrigin) {
      console.log(`✅ CORS origin header present: ${corsOrigin}`);
      if (corsOrigin === CONFIG.FRONTEND_URL || corsOrigin === '*') {
        console.log('✅ CORS origin matches frontend URL');
      } else {
        console.log(`⚠️  CORS origin doesn't match frontend URL`);
        console.log(`   Expected: ${CONFIG.FRONTEND_URL}`);
        console.log(`   Got: ${corsOrigin}`);
      }
    } else {
      console.log('⚠️  CORS origin header not found (may need a preflight request)');
    }

    if (corsCredentials === 'true') {
      console.log('✅ CORS credentials enabled');
    } else {
      console.log('⚠️  CORS credentials not enabled');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Failed to check CORS: ${error.message}`);
    return false;
  }
}

// Test 3: API endpoint check
async function testApiEndpoint() {
  console.log('\n🔌 Test 3: API Endpoints');
  try {
    const response = await httpsGet(`${CONFIG.BACKEND_URL}/api/auth/login`);
    // We expect 400 or 404 since we're not sending data, but the endpoint should respond
    if (response.statusCode === 400 || response.statusCode === 404 || response.statusCode === 405) {
      console.log('✅ API endpoints are responding');
      console.log(`   Status: ${response.statusCode}`);
      return true;
    } else if (response.statusCode === 200) {
      console.log('⚠️  Login endpoint returned 200 without credentials (unexpected)');
      return true;
    } else {
      console.log(`⚠️  Unexpected response: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed to reach API endpoint: ${error.message}`);
    return false;
  }
}

// Summary and recommendations
function printSummary(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  const allPassed = results.every(r => r);
  
  if (allPassed) {
    console.log('✅ All tests passed! Your configuration looks good.\n');
    console.log('Next steps:');
    console.log('1. Deploy your backend to Railway');
    console.log('2. Set FRONTEND_URL in Railway environment variables:');
    console.log(`   FRONTEND_URL=${CONFIG.FRONTEND_URL}`);
    console.log('3. Deploy your frontend to Vercel');
    console.log('4. Set NEXT_PUBLIC_API_URL in Vercel environment variables:');
    console.log(`   NEXT_PUBLIC_API_URL=${CONFIG.BACKEND_URL}`);
    console.log('5. Test login/register functionality');
  } else {
    console.log('⚠️  Some tests failed. Review the output above.\n');
    console.log('Common issues:');
    console.log('- Backend not deployed or sleeping');
    console.log('- Wrong environment variables in Railway/Vercel');
    console.log('- Typos in URLs');
    console.log('- Missing CORS configuration in backend');
  }
  
  console.log('\n📖 For detailed instructions, see: DEPLOYMENT_SETUP.md');
}

// Run all tests
(async () => {
  const results = [
    await testBackendAccessibility(),
    await testCorsHeaders(),
    await testApiEndpoint(),
  ];
  
  printSummary(results);
})();
