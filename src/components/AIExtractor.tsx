import React, { useEffect, useState, useRef } from 'react';
import { extractFieldsWithAI } from '../utils/openaiClient';
import OutputPane from './OutputPane';

interface AIExtractorProps {
  jsonData: any;
  selectedFields: string[];
  typingConfig?: {
    baseSpeed?: number;
    speedVariance?: number;
    mistakeChance?: number;
    mistakeFixDelay?: number;
  };
}

const AIExtractor: React.FC<AIExtractorProps> = ({ jsonData, selectedFields, typingConfig }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track if we've already processed this data
  const hasProcessedRef = useRef(false);
  const prevFieldsRef = useRef<string[]>([]);
  const isInitialMountRef = useRef(true);
  
  useEffect(() => {
    // Skip processing on initial mount to prevent double API calls
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    // Only make API call if fields have changed or we haven't processed yet
    const fieldsChanged = JSON.stringify(selectedFields) !== JSON.stringify(prevFieldsRef.current);
    
    if (!hasProcessedRef.current || fieldsChanged) {
      // Update tracking refs
      hasProcessedRef.current = true;
      prevFieldsRef.current = [...selectedFields];
      
      // Check if we have valid data to process
      if (jsonData && selectedFields.length > 0) {
        // Set loading state and clear errors
        setIsLoading(true);
        setError(null);
        
        // Make the API call using our standalone client
        extractFieldsWithAI(jsonData, selectedFields)
          .then(result => {
            if (result.success && result.data) {
              setExtractedText(result.data);
            } else {
              setError(result.error || 'Unknown error');
              setExtractedText('Error: Failed to extract fields using AI');
            }
          })
          .catch(err => {
            setError(err.message || 'Failed to call OpenAI API');
            setExtractedText('Error: Failed to extract fields using AI');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [jsonData, selectedFields]);
  
  // Reset processing flag when component is unmounted (when toggle changes)
  useEffect(() => {
    return () => {
      hasProcessedRef.current = false;
    };
  }, []);

  return (
    <div className="ai-extractor">
      {isLoading && <div className="loading-indicator">AI is analyzing the JSON data...</div>}
      {error && <div className="error-message">Error: {error}</div>}
      <OutputPane text={extractedText} typingConfig={typingConfig} />
    </div>
  );
};

export default AIExtractor;
