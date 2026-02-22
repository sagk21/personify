const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test OpenAI connection
async function testOpenAIConnection() {
  try {
    await openai.models.list();
    console.log('✅ OpenAI connected successfully');
    return true;
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error.message);
    return false;
  }
}

module.exports = { 
  openai, 
  testOpenAIConnection 
};