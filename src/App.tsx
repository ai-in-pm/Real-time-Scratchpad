import React, { useState, useEffect } from 'react';
import './App.css';
import JSONPane from './components/JSONPane';
import OutputPane from './components/OutputPane';
import ManualExtractor from './components/ManualExtractor';
import FileImport from './components/FileImport';
import FieldSelector from './components/FieldSelector';
import Notification from './components/Notification';
import { extractFields, formatExtractedFields } from './utils/extractFields';
import { sampleData, defaultTargetFields } from './data/sampleData';

function App() {
  const [jsonData, setJsonData] = useState(sampleData);
  const [targetFields, setTargetFields] = useState(defaultTargetFields);
  const [extractedText, setExtractedText] = useState('');
  const [notifications, setNotifications] = useState<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([]);
  const [isResetAnimation, setIsResetAnimation] = useState(false);
  const [useOpenAI, setUseOpenAI] = useState(false); // Start with simulation by default to avoid the API loop

  // Extract fields from JSON data whenever jsonData or targetFields change (for the simulated extraction)
  useEffect(() => {
    if (!useOpenAI) {
      // Extract fields from JSON data
      const extractedPairs = extractFields(jsonData, targetFields);
      
      // Format the extracted data as lines of "Key: Value" text
      const formattedText = formatExtractedFields(extractedPairs);
      setExtractedText(formattedText);
      
      // Reset animation trigger
      setIsResetAnimation(true);
      // Clear reset trigger after a brief delay
      const timer = setTimeout(() => setIsResetAnimation(false), 100);
      
      return () => clearTimeout(timer);
    }
  }, [jsonData, targetFields, useOpenAI]);

  // Typing configuration
  const typingConfig = {
    baseSpeed: 50,
    speedVariance: 100,
    mistakeChance: 0.1,
    mistakeFixDelay: 300
  };

  // Handle file upload success
  const handleFileLoaded = (data: any) => {
    setJsonData(data);
    addNotification('JSON file loaded successfully!', 'success');
  };

  // Handle file upload error
  const handleFileError = (errorMessage: string) => {
    addNotification(errorMessage, 'error');
  };

  // Handle field selection change
  const handleFieldsChange = (fields: string[]) => {
    setTargetFields([...fields]); // Create a new array to ensure state updates
    
    // Show notification when fields change
    if (fields.length === 0) {
      addNotification('Please select at least one field to extract', 'info');
    } else if (fields.length > 5) {
      addNotification(`Selected ${fields.length} fields for extraction`, 'info');
    }
  };

  // Add a notification
  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  // Remove a notification
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Toggle between simulated and OpenAI extraction
  const toggleExtractionMode = () => {
    setUseOpenAI(!useOpenAI);
    addNotification(`Switched to ${!useOpenAI ? 'OpenAI' : 'Simulated'} extraction mode`, 'info');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>JSON Extraction Simulator</h1>
        <p>Watch as the AI agent extracts specific fields from the JSON in real-time</p>
      </header>
      
      <div className="controls-container">
        <FileImport 
          onFileLoaded={handleFileLoaded} 
          onError={handleFileError} 
        />
        <button 
          className="toggle-mode-button" 
          onClick={toggleExtractionMode}
          title={useOpenAI ? "Switch to simulated extraction" : "Switch to OpenAI extraction"}
        >
          {useOpenAI ? "Using OpenAI" : "Using Simulation"}
        </button>
      </div>
      
      <main className="content-container">
        <div className="left-panel">
          {/* Field selector */}
          <FieldSelector 
            jsonData={jsonData} 
            onFieldsChange={handleFieldsChange} 
          />
          
          {/* Left pane: original JSON */}
          <JSONPane jsonData={jsonData} />
        </div>
        
        {/* Right pane: AI agent typing out the extracted info */}
        <div className="right-panel">
          <h3>AI Agent Extraction {useOpenAI ? "(OpenAI API)" : "(Simulation)"}</h3>
          {useOpenAI ? (
            <ManualExtractor 
              jsonData={jsonData}
              selectedFields={targetFields}
              typingConfig={typingConfig}
              onExtractClick={() => {}}
            />
          ) : (
            <OutputPane 
              text={extractedText} 
              typingConfig={typingConfig} 
              key={isResetAnimation ? 'reset' : 'stable'}
            />
          )}
        </div>
      </main>
      
      {/* Notification area */}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
