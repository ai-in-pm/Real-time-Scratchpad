import React, { useState, useEffect } from 'react';

interface FieldSelectorProps {
  jsonData: any;
  onFieldsChange: (fields: string[]) => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({ jsonData, onFieldsChange }) => {
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Extract all available fields from JSON
  useEffect(() => {
    if (!jsonData) return;
    
    const fields: string[] = [];
    
    const extractFields = (obj: any, prefix: string = '') => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          const fieldPath = prefix ? `${prefix}.${key}` : key;
          
          // Don't include arrays or objects as selectable fields
          if (typeof value !== 'object' || value === null) {
            fields.push(key);
          }
          
          // Recursively extract nested fields
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            extractFields(value, fieldPath);
          }
        });
      }
    };
    
    extractFields(jsonData);
    
    // Remove duplicates by converting to a Set and back to array
    const uniqueFields = Array.from(new Set(fields)).sort();
    setAvailableFields(uniqueFields);
    
    // Default select the first few fields (up to 5)
    const defaultSelected = uniqueFields.slice(0, 5);
    setSelectedFields(defaultSelected);
    onFieldsChange(defaultSelected);
  }, [jsonData, onFieldsChange]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.value;
    const isChecked = event.target.checked;
    
    let newSelectedFields;
    if (isChecked) {
      // Add to selected fields
      newSelectedFields = [...selectedFields, field];
    } else {
      // Remove from selected fields
      newSelectedFields = selectedFields.filter(f => f !== field);
    }
    
    setSelectedFields(newSelectedFields);
    onFieldsChange(newSelectedFields);
  };

  return (
    <div className="field-selector" style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
      <h3 style={{ marginBottom: '12px' }}>Select Fields to Extract</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {availableFields.map(field => (
          <div key={field} style={{ margin: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                value={field}
                checked={selectedFields.includes(field)}
                onChange={handleCheckboxChange}
                style={{ marginRight: '8px', width: '16px', height: '16px' }}
              />
              <span>{field}</span>
            </label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Selected: {selectedFields.join(', ')}
      </div>
    </div>
  );
};

export default FieldSelector;
