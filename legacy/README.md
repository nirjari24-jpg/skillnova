# Skillnova - AI Workspace & Python Backend

Welcome to **Skillnova**, a unified project combining a Python backend and web server with a Node.js/TypeScript-based Gemini AI Agent System.

## Project Structure

- **Frontend & Web Server (Python)**: A simple HTTP server (`server.py`) that serves the workspace interface (`index.html`, `script.js`, `styles.css`).
- **Gemini AI Agent System (Node.js/TypeScript)**: A conversational AI agent (`src/gemini-agent.ts`) powered by Google Gemini.
- **Skillnova Core (Python Package)**: A reusable Python package located in the `skillnova` directory.

---

## 🤖 Gemini AI Agent System (Node.js/TypeScript)

### Features

- Conversational AI agent using Google Gemini.
- Multi-turn conversation support with history tracking.
- Type safety with TypeScript.

### Prerequisites

- Node.js 16+ and npm.
- Google Generative AI API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey)).

### Installation & Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Set your API key:**
   - **Bash/zsh:**
     ```bash
     export GEMINI_API_KEY=your_api_key_here
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:GEMINI_API_KEY="your_api_key_here"
     ```

3. **Build the agent:**
   ```bash
   npm run build:agent
   ```

### Usage

- **Run Interactive Chat CLI:**
  ```bash
  npm run start:agent
  ```
- **Run in Development Mode:**
  ```bash
  npm run dev:agent
  ```

---

## 🐍 Python Project & Server

### Prerequisites

- Python 3.11+

### Installation & Setup

1. **Create and activate a virtual environment:**
   - **PowerShell:**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - **Bash/zsh:**
     ```bash
     python -m venv .venv
     source .venv/bin/activate
     ```

2. **Install Python dependencies:**
   ```bash
   python -m pip install -U pip
   python -m pip install -r requirements.txt
   ```

### Running the Server

Start the Python web server (which serves the frontend dashboard at `http://localhost:8001`):
```bash
npm start
```
*Or run directly:*
```bash
python server.py
```

### Running Tests

Run the test suite using pytest:
```bash
python -m pytest
```

---

## Contributors

See the list of [contributors](CONTRIBUTORS.md) who participated in this project.

## License

This project is licensed under the MIT License.
