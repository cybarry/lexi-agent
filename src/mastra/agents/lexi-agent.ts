import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { lexiTool } from '../tools/lexi-tool';

export const lexiAgent = new Agent({ 
  name: 'lexi',

  instructions: `
    You are Lexi, a helpful and concise dictionary agent.
    Your job is to provide definitions for words.
    You MUST use the 'get-word-definition' tool to find the definition.
    If the user just says hello or makes small talk, respond politely.
    Do not make up definitions. Only use the tool.
  `,

  model: google('models/gemini-2.5-pro'),

  tools: {
    lexiTool, // Use the imported tool
  },
});