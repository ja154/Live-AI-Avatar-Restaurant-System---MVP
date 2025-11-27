// test-credentials.js
const axios = require('axios');
require('dotenv').config();

console.log(`
\u001b[1;36m\u001b[1;36m╔════════════════════════════════════════╗\u001b[0m
\u001b[1;36m║   🔑 API Credentials Test Script      ║\u001b[0m\n\u001b[1;36m╚════════════════════════════════════════╝\u001b[0m
`);

async function testHeyGen() {
  console.log('📹 Testing HeyGen API...');
  
  try {
    const response = await axios.get(
      'https://api.heygen.com/v1/user.credit',
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,
        },
      }
    );

    const credits = response.data.data;
    console.log('✅ HeyGen API: WORKING');
    console.log(`   Credits remaining: ${credits.remaining || 'N/A'}`);
    console.log(`   Avatar ID: ${process.env.HEYGEN_AVATAR_ID}`);
    return true;
  } catch (error) {
    console.log('❌ HeyGen API: FAILED');
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGemini() {
  console.log('\n🤖 Testing Gemini API...');
  
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: 'Say hello' }] }],
      }
    );

    console.log('✅ Gemini API: WORKING');
    return true;
  } catch (error) {
    console.log('❌ Gemini API: FAILED');
    console.log(`   Error: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Starting tests...\n');
  
  const heygenOk = await testHeyGen();
  const geminiOk = await testGemini();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESULTS\n');
  console.log(`${heygenOk ? '✅' : '❌'} HeyGen: ${heygenOk ? 'PASS' : 'FAIL'}`);
  console.log(`${geminiOk ? '✅' : '❌'} Gemini: ${geminiOk ? 'PASS' : 'FAIL'}`);

  if (heygenOk && geminiOk) {
    console.log('\n✅ All services ready! Run: npm start\n');
  } else {
    console.log('\n❌ Fix failed services before running demo\n');
  }
}

runTests();
