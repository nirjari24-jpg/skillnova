import { GeminiAgent } from "./gemini-agent";

/**
 * Main entry point for the Gemini Agent System
 */
async function main() {
  // Get API key from environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set");
    console.error("Please set your Google Generative AI API key:");
    console.error("  export GEMINI_API_KEY=your_api_key_here");
    process.exit(1);
  }

  // Create agent instance
  const agent = new GeminiAgent({
    apiKey,
    model: "gemini-pro",
  });

  console.log("Gemini AI Agent initialized");
  console.log("Type 'exit' to quit\n");

  // Interactive chat loop
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question("You: ", async (input: string) => {
      if (input.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }

      try {
        const response = await agent.chat(input);
        console.log(`\nAgent: ${response}\n`);
      } catch (error) {
        console.error("Error:", error);
      }

      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
