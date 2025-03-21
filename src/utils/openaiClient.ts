import { OPENAI_API_KEY } from '../config';

// Simple client for OpenAI API calls - separated from React's state management
export const extractFieldsWithAI = async (
  jsonData: any,
  selectedFields: string[]
): Promise<{ success: boolean; data?: string; error?: string }> => {
  // Don't make API calls if there's no data or no fields selected
  if (!jsonData || !selectedFields.length) {
    return { success: false, error: 'No data or fields provided' };
  }

  try {
    // Create a simplified representation of the JSON data including only selected fields
    const simplifiedData: Record<string, any> = {};
    
    // Extract just the fields that were selected
    selectedFields.forEach(field => {
      if (typeof jsonData[field] !== 'undefined') {
        simplifiedData[field] = jsonData[field];
      }
    });

    // Prepare the system prompt
    const systemPrompt = 'You are a helpful assistant that extracts specific fields from JSON data. ' +
      'Extract only the requested fields and format them in a clear, human-readable way. ' +
      'Present each field on a new line. For each field, include the field name followed by its value. ' +
      'Do not include any explanatory text before or after the extraction.';

    // Prepare the user prompt
    const userPrompt = `Extract these fields from the following JSON data: ${selectedFields.join(', ')}\n\nJSON DATA:\n${JSON.stringify(simplifiedData, null, 2)}`;

    // Make the API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (response.ok) {
      if (data.choices && data.choices.length > 0) {
        return { 
          success: true, 
          data: data.choices[0].message.content.trim() 
        };
      } else {
        return { 
          success: false, 
          error: 'No response content returned from OpenAI' 
        };
      }
    } else {
      return { 
        success: false, 
        error: data.error?.message || 'Unknown error from OpenAI API' 
      };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};
