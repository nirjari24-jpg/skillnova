import { buildGeminiRequest, extractGeminiText } from './gemini-agent.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const apiKeyInput = document.querySelector('#api-key');
  const toggleApiKeyBtn = document.querySelector('#toggle-api-key');
  const promptInput = document.querySelector('#prompt');
  const sendBtn = document.querySelector('#send-btn');
  const form = document.querySelector('#gemini-form');
  const statusText = document.querySelector('#gemini-status');
  const messagesContainer = document.querySelector('#messages-container');
  const welcomeScreen = document.querySelector('#welcome-screen');
  const newChatBtn = document.querySelector('#new-chat-btn');
  const chatList = document.querySelector('#chat-list');
  const activeThreadTitle = document.querySelector('#active-thread-title');
  const clearCurrentChatBtn = document.querySelector('#clear-current-chat');

  // State
  let threads = [];
  let activeThreadId = null;

  // Initialize App
  init();

  function init() {
    // Load settings
    const savedKey = localStorage.getItem('skillnova_api_key');
    if (savedKey) {
      apiKeyInput.value = savedKey;
    }

    // Load Chat threads
    try {
      threads = JSON.parse(localStorage.getItem('skillnova_threads')) || [];
    } catch (e) {
      threads = [];
    }

    activeThreadId = localStorage.getItem('skillnova_active_thread_id');

    if (threads.length === 0) {
      createNewThread();
    } else {
      // Validate activeThreadId exists
      const exists = threads.some(t => t.id === activeThreadId);
      if (!exists) {
        activeThreadId = threads[0].id;
      }
      renderThreads();
      renderActiveThread();
    }

    setupEventListeners();
  }

  function setupEventListeners() {
    // Toggle API Key visibility
    toggleApiKeyBtn.addEventListener('click', () => {
      if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleApiKeyBtn.textContent = '🙈';
      } else {
        apiKeyInput.type = 'password';
        toggleApiKeyBtn.textContent = '👁️';
      }
    });

    // Save API key on change
    apiKeyInput.addEventListener('input', () => {
      localStorage.setItem('skillnova_api_key', apiKeyInput.value.trim());
    });

    // Auto-resize textarea
    promptInput.addEventListener('input', () => {
      promptInput.style.height = 'auto';
      promptInput.style.height = (promptInput.scrollHeight) + 'px';
    });

    // Shift+Enter behaves normally, Enter submits
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    // Form submit for asking Gemini
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });

    // New Chat Button
    newChatBtn.addEventListener('click', () => {
      createNewThread();
    });

    // Clear Chat Button
    clearCurrentChatBtn.addEventListener('click', () => {
      const activeThread = threads.find(t => t.id === activeThreadId);
      if (activeThread) {
        activeThread.messages = [];
        saveThreads();
        renderActiveThread();
      }
    });

    // Suggestion Cards click delegation
    messagesContainer.addEventListener('click', (e) => {
      const suggestionCard = e.target.closest('.suggestion-card');
      if (suggestionCard) {
        const promptVal = suggestionCard.getAttribute('data-prompt');
        promptInput.value = promptVal;
        promptInput.focus();
        // Trigger auto-resize
        promptInput.style.height = 'auto';
        promptInput.style.height = (promptInput.scrollHeight) + 'px';
        form.requestSubmit();
      }
    });

    // Copy Code Button delegation
    messagesContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy-code-btn')) {
        const codeId = e.target.getAttribute('data-code-id');
        const codeEl = document.getElementById(codeId);
        if (codeEl) {
          // Unescape HTML entities before copying
          const rawCode = codeEl.innerHTML
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
          navigator.clipboard.writeText(rawCode).then(() => {
            const originalText = e.target.textContent;
            e.target.textContent = 'Copied!';
            e.target.style.borderColor = 'var(--success-color)';
            e.target.style.color = 'var(--success-color)';
            setTimeout(() => {
              e.target.textContent = originalText;
              e.target.style.borderColor = '';
              e.target.style.color = '';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      }
    });
  }

  // Create thread
  function createNewThread() {
    const threadId = 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newThread = {
      id: threadId,
      title: 'New Workspace Chat',
      messages: [],
      timestamp: Date.now()
    };
    threads.unshift(newThread);
    activeThreadId = threadId;
    saveThreads();
    renderThreads();
    renderActiveThread();
    promptInput.focus();
  }

  // Delete thread
  window.deleteThread = function(threadId, event) {
    if (event) {
      event.stopPropagation();
    }
    threads = threads.filter(t => t.id !== threadId);
    if (activeThreadId === threadId) {
      activeThreadId = threads.length > 0 ? threads[0].id : null;
    }
    if (threads.length === 0) {
      createNewThread();
    } else {
      saveThreads();
      renderThreads();
      renderActiveThread();
    }
  };

  // Switch active thread
  window.selectThread = function(threadId) {
    activeThreadId = threadId;
    localStorage.setItem('skillnova_active_thread_id', activeThreadId);
    renderThreads();
    renderActiveThread();
    promptInput.focus();
  };

  // Save state
  function saveThreads() {
    localStorage.setItem('skillnova_threads', JSON.stringify(threads));
    localStorage.setItem('skillnova_active_thread_id', activeThreadId);
  }

  // Render sidebar threads
  function renderThreads() {
    chatList.innerHTML = '';
    if (threads.length === 0) {
      chatList.innerHTML = '<div class="empty-threads">No chats yet</div>';
      return;
    }

    threads.forEach(thread => {
      const isSelected = thread.id === activeThreadId;
      const item = document.createElement('div');
      item.className = `chat-thread-item ${isSelected ? 'active' : ''}`;
      item.setAttribute('onclick', `selectThread('${thread.id}')`);

      // Limit title size
      const displayTitle = thread.title.length > 25 ? thread.title.substr(0, 25) + '...' : thread.title;

      item.innerHTML = `
        <div class="thread-details">
          <span class="thread-icon">💬</span>
          <span class="thread-title" title="${thread.title}">${displayTitle}</span>
        </div>
        <button class="thread-delete" onclick="deleteThread('${thread.id}', event)" title="Delete thread">🗑️</button>
      `;
      chatList.appendChild(item);
    });
  }

  // Render chat area messages
  function renderActiveThread() {
    const activeThread = threads.find(t => t.id === activeThreadId);
    if (!activeThread) return;

    activeThreadTitle.textContent = activeThread.title;

    // Clear messages area (except welcome screen)
    const bubbles = messagesContainer.querySelectorAll('.message-wrapper');
    bubbles.forEach(b => b.remove());

    if (activeThread.messages.length === 0) {
      welcomeScreen.style.display = 'flex';
    } else {
      welcomeScreen.style.display = 'none';
      activeThread.messages.forEach(msg => {
        appendMessageBubble(msg.role, msg.text);
      });
      scrollToBottom();
    }
  }

  // Append bubble helper
  function appendMessageBubble(role, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (role === 'user') {
      // Escape HTML for user input for safety
      bubble.textContent = text;
    } else {
      // Format Markdown for assistant output
      bubble.innerHTML = formatMarkdown(text);
    }

    wrapper.appendChild(bubble);
    messagesContainer.appendChild(wrapper);
  }

  // Handle Send action
  async function handleSend() {
    const apiKey = apiKeyInput.value.trim();
    const prompt = promptInput.value.trim();

    if (!apiKey) {
      statusText.textContent = 'Error: Please configure your API Key.';
      statusText.classList.remove('working');
      apiKeyInput.focus();
      return;
    }

    if (!prompt) return;

    const activeThread = threads.find(t => t.id === activeThreadId);
    if (!activeThread) return;

    // If first message, update thread title
    if (activeThread.messages.length === 0) {
      activeThread.title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
    }

    // Add user message
    activeThread.messages.push({ role: 'user', text: prompt });
    saveThreads();
    renderThreads();
    renderActiveThread();

    // Clear input
    promptInput.value = '';
    promptInput.style.height = 'auto';

    // Set Loading state
    statusText.textContent = 'Thinking...';
    statusText.classList.add('working');
    promptInput.disabled = true;
    sendBtn.disabled = true;

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
        throw new Error(data?.error || 'Failed to query model.');
      }

      const responseText = data.text || 'No response returned.';

      // Add assistant message
      activeThread.messages.push({ role: 'assistant', text: responseText });
      saveThreads();
      renderActiveThread();
      statusText.textContent = 'Ready.';
    } catch (error) {
      console.error(error);
      activeThread.messages.push({ 
        role: 'assistant', 
        text: `⚠️ **Error querying Gemini API:**\n\n${error.message || 'Unable to connect to the backend server.'}`
      });
      saveThreads();
      renderActiveThread();
      statusText.textContent = 'Failed to connect.';
    } finally {
      statusText.classList.remove('working');
      promptInput.disabled = false;
      sendBtn.disabled = false;
      promptInput.focus();
    }
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Light regex-based markdown parser
  function formatMarkdown(text) {
    // Escape HTML to prevent XSS (done safely first)
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks with language specification
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    html = html.replace(codeBlockRegex, (match, lang, code) => {
      const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
      const languageLabel = lang || 'code';
      return `
        <div class="code-block-header">
          <span>${languageLabel}</span>
          <button class="copy-code-btn" data-code-id="${codeId}">Copy code</button>
        </div>
        <pre><code id="${codeId}">${code}</code></pre>
      `;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic text
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Bullet Lists
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
        const content = cleanLine.substring(2);
        if (!inList) {
          inList = true;
          return '<ul><li>' + content + '</li>';
        }
        return '<li>' + content + '</li>';
      } else {
        if (inList) {
          inList = false;
          return '</ul>' + line;
        }
        return line;
      }
    });
    if (inList) {
      processedLines.push('</ul>');
    }
    html = processedLines.join('\n');

    // Paragraph wrapping (separated by double linebreaks or headers)
    html = html.split(/\n{2,}/g).map(p => {
      p = p.trim();
      if (!p) return '';
      // Don't wrap code blocks, code headers, or list items
      if (p.startsWith('<ul') || p.startsWith('<div class="code-block-header"') || p.startsWith('<pre>')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return html;
  }
});

