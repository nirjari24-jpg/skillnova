import { buildGeminiRequest, extractGeminiText } from './gemini-agent.js';

document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('h1');
  if (heading) {
    heading.textContent = 'Welcome to SkillNova';
  }

  const form = document.querySelector('#gemini-form');
  const apiKeyInput = document.querySelector('#api-key');
  const promptInput = document.querySelector('#prompt');
  const output = document.querySelector('#gemini-output');
  const status = document.querySelector('#gemini-status');

  if (!form || !apiKeyInput || !promptInput || !output || !status) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const apiKey = apiKeyInput.value.trim();
    const prompt = promptInput.value.trim();

    if (!apiKey || !prompt) {
      status.textContent = 'Please enter both your API key and a prompt.';
      output.textContent = 'Missing input.';
      return;
    }

    status.textContent = 'Asking Gemini...';
    output.textContent = 'Waiting for a response...';

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, apiKey }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Gemini request failed.');
      }

      output.textContent = extractGeminiText({ candidates: [{ content: { parts: [{ text: data.text }] } }] });
      status.textContent = 'Response ready.';
    } catch (error) {
      output.textContent = error.message || 'Unable to reach Gemini right now.';
      status.textContent = 'Request failed.';
    }
  });
});
