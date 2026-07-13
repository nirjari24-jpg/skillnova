import { GoogleGenerativeAI } from "@google/generative-ai";

interface AgentConfig {
  apiKey: string;
  model?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export class GeminiAgent {
  private client: GoogleGenerativeAI;
  private model: string;
  private conversationHistory: Message[] = [];

  constructor(config: AgentConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || "gemini-pro";
  }

  /**
   * Send a message to the Gemini agent and get a response
   */
  async chat(userMessage: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    try {
      const model = this.client.getGenerativeModel({ model: this.model });

      // Create chat session
      const chat = model.startChat({
        history: this.conversationHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      });

      // Send message and get response
      const result = await chat.sendMessage(userMessage);
      const response = result.response.text();

      // Add assistant response to history
      this.conversationHistory.push({
        role: "assistant",
        content: response,
      });

      return response;
    } catch (error) {
      console.error("Error communicating with Gemini:", error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }
}
