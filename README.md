# Gemini AI Agent System

A Node.js/TypeScript-based conversational AI agent system powered by Google Gemini.

## Features

- 🤖 Conversational AI agent using Google Gemini
- 💬 Multi-turn conversation support with history tracking
- 📝 Built with TypeScript for type safety
- 🚀 Easy to integrate into larger applications

## Prerequisites

- Node.js 16+ and npm
- Google Generative AI API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation

1. **Clone or setup the project**
   ```bash
   cd skillnova
   npm install
   ```

2. **Set your API key**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```
   On Windows (PowerShell):
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### Run Interactive Chat

```bash
npm start
```

This will launch an interactive chat interface where you can converse with the Gemini agent.

### Use as a Library

```typescript
import { GeminiAgent } from "./src/gemini-agent";

const agent = new GeminiAgent({
  apiKey: process.env.GEMINI_API_KEY || "",
  model: "gemini-pro",
});

const response = await agent.chat("Hello, how are you?");
console.log(response);
```

## API Reference

### GeminiAgent

#### Constructor

```typescript
new GeminiAgent(config: AgentConfig)
```

**Parameters:**
- `config.apiKey` (string): Google Generative AI API key (required)
- `config.model` (string): Model name (default: "gemini-pro")

#### Methods

- `chat(userMessage: string): Promise<string>` - Send a message and get a response
- `getHistory(): Message[]` - Get conversation history
- `clearHistory(): void` - Clear conversation history

## Development

```bash
# Run in development mode with ts-node
npm run dev

# Build TypeScript
npm run build

# Start compiled version
npm start
```

## Contributors

See the list of [contributors](CONTRIBUTORS.md) who participated in this project.

## License

MIT

