import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface JSONPaneProps {
  jsonData: any;
}

const JSONPane: React.FC<JSONPaneProps> = ({ jsonData }) => {
  // Convert JSON object to a formatted JSON string with indentation
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  return (
    <div className="json-pane">
      <SyntaxHighlighter language="json" style={materialLight}>
        {jsonString}
      </SyntaxHighlighter>
    </div>
  );
};

export default JSONPane;
