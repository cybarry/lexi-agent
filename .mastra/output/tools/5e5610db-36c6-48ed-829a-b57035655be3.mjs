import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const lexiTool = createTool({
  id: "get-word-definition",
  description: "Finds the definition of a specific word. Use this for any dictionary requests.",
  inputSchema: z.object({
    word: z.string().describe("The word to find the definition for.")
  }),
  outputSchema: z.object({
    definition: z.string()
  }),
  execute: async ({ context }) => {
    const { word } = context;
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        return { definition: `Sorry, I couldn't find a definition for the word "${word}".` };
      }
      const data = await response.json();
      const firstMeaning = data[0]?.meanings[0];
      const firstDefinition = firstMeaning?.definitions[0]?.definition;
      if (firstDefinition) {
        return { definition: firstDefinition };
      } else {
        return { definition: `Sorry, I couldn't find a clear definition for "${word}".` };
      }
    } catch (error) {
      console.error("Dictionary API Error:", error);
      return { definition: "Sorry, I had trouble connecting to the dictionary service." };
    }
  }
});

export { lexiTool };
