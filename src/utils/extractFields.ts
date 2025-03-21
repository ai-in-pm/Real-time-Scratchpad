/**
 * Recursively extract key-value pairs from an object for the specified target keys.
 * @param obj - The JSON object to search.
 * @param targets - List of key names to extract.
 * @returns Array of extracted key-value pairs.
 */
export function extractFields(obj: any, targets: string[]): Array<{key: string, value: any}> {
  const results: Array<{key: string, value: any}> = [];
  
  function recurse(current: any, path: string = '') {
    if (current && typeof current === 'object') {
      for (const [key, value] of Object.entries(current)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (targets.includes(key)) {
          results.push({ key, value });
        }
        
        // Recurse into nested objects or arrays
        if (value !== null && typeof value === 'object') {
          recurse(value, currentPath);
        }
      }
    }
  }
  
  recurse(obj);
  return results;
}

/**
 * Format the extracted field pairs into a readable string
 * @param pairs - Array of key-value pairs
 * @returns Formatted string with each pair on a new line
 */
export function formatExtractedFields(pairs: Array<{key: string, value: any}>): string {
  return pairs.map(pair => {
    const valueStr = typeof pair.value === 'object' 
      ? JSON.stringify(pair.value)
      : pair.value;
    return `${pair.key}: ${valueStr}`;
  }).join('\n');
}
