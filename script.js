import { extractGeminiText } from './gemini-agent.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#gemini-form');
  const apiKeyInput = document.querySelector('#api-key');
  const promptInput = document.querySelector('#prompt');
  const chatMessages = document.querySelector('#chat-messages');
  const logsArea = document.querySelector('#logs-area');
  const agentStatus = document.querySelector('#agent-status');
  const sendBtn = document.querySelector('#send-btn');
  const clearChatBtn = document.querySelector('#clear-chat-btn');
  const clearLogsBtn = document.querySelector('#clear-logs-btn');

  let conversationHistory = [];

  if (!form || !apiKeyInput || !promptInput || !chatMessages || !logsArea || !agentStatus || !sendBtn) {
    console.error('Core DOM elements missing.');
    return;
  }

  // Load API key from sessionStorage if it exists
  const savedApiKey = sessionStorage.getItem('gemini_api_key');
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  // Save API key to sessionStorage when changed
  apiKeyInput.addEventListener('change', () => {
    sessionStorage.setItem('gemini_api_key', apiKeyInput.value.trim());
  });

  // Auto-resize composer textarea
  promptInput.addEventListener('input', () => {
    promptInput.style.height = 'auto';
    promptInput.style.height = `${promptInput.scrollHeight}px`;
  });

  // Form submission handler
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const apiKey = apiKeyInput.value.trim();
    const prompt = promptInput.value.trim();

    if (!apiKey) {
      addLogEntry('System', 'Error: API Key is required.', 'tool-error');
      alert('Please enter your Google AI Studio API key at the top.');
      return;
    }

    if (!prompt) return;

    // Reset prompt input and height
    promptInput.value = '';
    promptInput.style.height = 'auto';

    // Disable composer during generation
    promptInput.disabled = true;
    sendBtn.disabled = true;
    agentStatus.className = 'status-indicator running';
    agentStatus.textContent = 'Agent Working...';

    // Add user message to chat area
    addChatMessage('user', prompt);
    addLogEntry('Client', `Submitted prompt: "${prompt.slice(0, 60)}${prompt.length > 60 ? '...' : ''}"`, 'system');

    try {
      addLogEntry('Agent', 'Initiating local agent execution loop...', 'system');

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          apiKey,
          history: conversationHistory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      // Log the agent trace/activity to the workspace log
      if (data.trace && data.trace.length > 0) {
        data.trace.forEach(step => {
          if (step.status === 'completed') {
            const argsStr = step.args ? JSON.stringify(step.args) : '';
            addLogEntry(
              'Workspace', 
              `Tool [${step.action}] completed: ${step.result || argsStr}`, 
              step.error ? 'tool-error' : 'tool-done'
            );
          } else {
            addLogEntry('Workspace', `Tool [${step.action}] failed or is running...`, 'tool-run');
          }
        });
      }

      // Update conversation history from the server response
      if (data.history) {
        conversationHistory = data.history;
      }

      // Add response message to chat area
      addChatMessage('assistant', data.text);
      addLogEntry('Agent', 'Generation finished successfully.', 'tool-done');

      agentStatus.className = 'status-indicator success';
      agentStatus.textContent = 'Done';
      setTimeout(() => {
        if (agentStatus.textContent === 'Done') {
          agentStatus.className = 'status-indicator idle';
          agentStatus.textContent = 'Idle';
        }
      }, 3000);

    } catch (error) {
      console.error(error);
      addChatMessage('system', `Error: ${error.message || 'Unable to reach the Gemini server.'}`);
      addLogEntry('Agent', `Error: ${error.message || 'Execution failed.'}`, 'tool-error');
      
      agentStatus.className = 'status-indicator error';
      agentStatus.textContent = 'Failed';
    } finally {
      promptInput.disabled = false;
      sendBtn.disabled = false;
      promptInput.focus();
    }
  });

  // Clear Chat Handler
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      conversationHistory = [];
      chatMessages.innerHTML = `
        <div class="message system-message">
          <div class="message-content">
            Conversation cleared. Start a new topic with the agent below.
          </div>
        </div>
      `;
      addLogEntry('System', 'Conversation history cleared.', 'system');
    });
  }

  // Clear Logs Handler
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      logsArea.innerHTML = '';
      addLogEntry('System', 'Activity feed cleared.', 'system');
    });
  }

  // Helper function to append log entries
  function addLogEntry(source, message, typeClass = 'system') {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const entry = document.createElement('div');
    entry.className = `log-entry ${typeClass}`;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    timeSpan.textContent = timeStr;

    const sourceSpan = document.createElement('span');
    sourceSpan.style.fontWeight = '700';
    sourceSpan.style.marginRight = '0.5rem';
    sourceSpan.textContent = `[${source}]`;

    const messageSpan = document.createElement('span');
    messageSpan.className = 'log-message';
    messageSpan.textContent = message;

    entry.appendChild(timeSpan);
    entry.appendChild(sourceSpan);
    entry.appendChild(messageSpan);
    
    logsArea.appendChild(entry);
    logsArea.scrollTop = logsArea.scrollHeight;
  }

  // Helper function to append chat messages
  function addChatMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role === 'user' ? 'user-message' : role === 'system' ? 'system-message' : 'model-message'}`;

    const header = document.createElement('div');
    header.className = 'message-header';
    header.textContent = role === 'user' ? 'You' : role === 'system' ? 'System' : 'Gemini Agent';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = formatMarkdown(text);

    messageDiv.appendChild(header);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Very simple client-side markdown formatter for chat styling
  function formatMarkdown(text) {
    if (!text) return '';
    // Escape HTML
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Code blocks: ```javascript\ncode\n```
    html = html.replace(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Code blocks without newlines
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });
    
    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Line breaks
    html = html.split('\n').join('<br>');
    
    return html;
  }
});
