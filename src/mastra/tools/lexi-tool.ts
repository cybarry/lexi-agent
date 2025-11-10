import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const lexiTool = createTool({
  id: 'get-word-definition',
  description: 'Finds the definition of a specific word. Use this for any dictionary requests.',
  
  inputSchema: z.object({
    word: z.string().describe('The word to find the definition for.'),
  }),
  
  outputSchema: z.object({
    definition: z.string(),
  }),
  
  execute: async ({ context }) => {
    const { word } = context;
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    try {
      // 1. Call the public API
      const response = await fetch(API_URL);
      
      // 2. Handle "Word Not Found" (API returns 404)
      if (!response.ok) {
        return { definition: `Sorry, I couldn't find a definition for the word "${word}".` };
      }
      
      // 3. Get the JSON data
      const data = await response.json();
      
      // 4. Find the first definition in the complex JSON response
      // This is data[0] -> meanings[0] -> definitions[0] -> definition
      const firstMeaning = data[0]?.meanings[0];
      const firstDefinition = firstMeaning?.definitions[0]?.definition;
      
      if (firstDefinition) {
        // SUCCESS!
        return { definition: firstDefinition };
      } else {
        // We found the word but it has a weird format
        return { definition: `Sorry, I couldn't find a clear definition for "${word}".` };
      }
      
    } catch (error) {
      console.error("Dictionary API Error:", error);
      // 5. Handle any other errors (e.g., network down)
      return { definition: "Sorry, I had trouble connecting to the dictionary service." };
    }
  },
});