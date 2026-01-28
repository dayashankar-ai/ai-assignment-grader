import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;
console.log(`API Key loaded: ${apiKey.substring(0, 20)}...`);
console.log(`Key length: ${apiKey.length} characters`);

const client = new Anthropic({ apiKey });

try {
    const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say hi' }]
    });
    console.log('\n✅ SUCCESS! API key is valid!');
    console.log('Response:', message.content[0].text);
} catch (error) {
    console.log('\n❌ FAILED:', error.message);
    console.log('Status:', error.status);
}
