import React from 'react';
import OutputPane from './OutputPane';
import { extractFieldsWithAI } from '../utils/openaiClient';
import './ManualExtractor.css';

interface ManualExtractorProps {
  jsonData: any;
  selectedFields: string[];
  typingConfig?: {
    baseSpeed?: number;
    speedVariance?: number;
    mistakeChance?: number;
    mistakeFixDelay?: number;
  };
  onExtractClick: () => void;
}

interface ManualExtractorState {
  isLoading: boolean;
  extractedText: string;
  error: string | null;
}

// Using a class component avoids React hooks and their potential issues
export class ManualExtractor extends React.Component<ManualExtractorProps, ManualExtractorState> {
  constructor(props: ManualExtractorProps) {
    super(props);
    this.state = {
      isLoading: false,
      extractedText: '',
      error: null
    };
  }

  // Method that will be called manually to trigger extraction
  extractData = () => {
    const { jsonData, selectedFields } = this.props;
    
    // Skip if no data or fields available
    if (!jsonData || !selectedFields.length) {
      this.setState({ 
        error: 'Please select JSON data and at least one field to extract.',
        extractedText: 'Error: No data or fields to extract.'
      });
      return;
    }
    
    // Set loading state
    this.setState({ isLoading: true, error: null });
    
    // Call the API
    extractFieldsWithAI(jsonData, selectedFields)
      .then(result => {
        if (result.success && result.data) {
          this.setState({ extractedText: result.data });
        } else {
          this.setState({
            error: result.error || 'Unknown error',
            extractedText: 'Error: Failed to extract fields using AI'
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err.message || 'Failed to call OpenAI API',
          extractedText: 'Error: Failed to extract fields using AI'
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { typingConfig } = this.props;
    const { isLoading, extractedText, error } = this.state;
    
    return (
      <div className="ai-extractor">
        <div className="extractor-controls">
          <button 
            onClick={this.extractData}
            disabled={isLoading}
            className="extract-button"
          >
            {isLoading ? 'Extracting...' : 'Extract with OpenAI'}
          </button>
        </div>
        
        {isLoading && <div className="loading-indicator">AI is analyzing the JSON data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <OutputPane text={extractedText} typingConfig={typingConfig} />
      </div>
    );
  }
}

export default ManualExtractor;
