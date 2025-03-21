import { useState } from 'react';

// Simplified implementation to prevent build errors
// The actual OpenAI client is in openaiClient.ts now
export const useOpenAI = (jsonData: any, selectedFields: string[]) => {
  const [isLoading] = useState(false);
  const [extractedText] = useState('');
  const [error] = useState<string | null>(null);

  return { extractedText, isLoading, error };
};
