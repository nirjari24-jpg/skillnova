import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGeminiRequest, extractGeminiText } from './gemini-agent.js';

test('buildGeminiRequest creates a request with the supplied API key', () => {
    const request = buildGeminiRequest('Explain AI', 'test-key');

    assert.equal(request.url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=test-key');
    assert.equal(request.options.method, 'POST');
    assert.deepEqual(request.options.headers, { 'Content-Type': 'application/json' });
    assert.match(JSON.stringify(request.options.body), /Explain AI/);
});

test('extractGeminiText returns the first candidate text', () => {
    const text = extractGeminiText({
        candidates: [{ content: { parts: [{ text: 'Hello from Gemini' }] } }],
    });

    assert.equal(text, 'Hello from Gemini');
});

test('extractGeminiText falls back to a friendly message', () => {
    const text = extractGeminiText({});

    assert.equal(text, 'No response was returned by Gemini.');
});
