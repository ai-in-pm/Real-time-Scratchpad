import React, { useState, ChangeEvent } from 'react';

interface FileImportProps {
  onFileLoaded: (jsonData: any) => void;
  onError: (error: string) => void;
}

const FileImport: React.FC<FileImportProps> = ({ onFileLoaded, onError }) => {
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        onFileLoaded(parsedData);
        setLoading(false);
      } catch (error) {
        onError('Error parsing JSON file. Please ensure it is a valid JSON file.');
        setLoading(false);
        setFileName('');
      }
    };

    reader.onerror = () => {
      onError('Error reading file.');
      setLoading(false);
      setFileName('');
    };

    reader.readAsText(file);
  };

  return (
    <div className="file-import">
      <div className="file-input-container">
        <input
          type="file"
          id="json-file"
          accept=".json"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="json-file" className="file-label">
          {fileName ? `Selected: ${fileName}` : 'Choose JSON File'}
        </label>
      </div>
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default FileImport;
