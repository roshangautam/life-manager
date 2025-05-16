import { useState } from 'react';
import './HouseholdSettings.css';

function HouseholdSettings() {
  const [householdName, setHouseholdName] = useState('Doe Family');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // TODO: Connect with backend API
    console.log('Updating settings:', { householdName, currency, timezone });
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSaving(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="household-settings-container">
      <h2>Household Settings</h2>
      
      {success && (
        <div className="success-message">
          Settings updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="householdName">Household Name</label>
          <input
            type="text"
            id="householdName"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select 
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
            <option value="JPY">Japanese Yen (¥)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <select 
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="Europe/London">London (GMT)</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="save-btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default HouseholdSettings;
